"use server";

import { redirect } from "next/navigation";
import { db } from "./db";
import { parolXesh, parolTekshir } from "./hash";
import { sessiyaYaratish, sessiyaTugatish, joriyFoydalanuvchi } from "./auth";

export interface AuthHolat {
  xato?: string;
}

type UserRow = { id: number; parol: string; rol: string };

// ── Ro'yxatdan o'tish ──
export async function royxatdanOtish(_prev: AuthHolat, form: FormData): Promise<AuthHolat> {
  const ism = String(form.get("ism") ?? "").trim();
  const familiya = String(form.get("familiya") ?? "").trim();
  const username = String(form.get("username") ?? "").trim().toLowerCase();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const parol = String(form.get("parol") ?? "");

  if (!ism || !username || !parol) return { xato: "Barcha majburiy maydonlarni to'ldiring." };
  if (username.length < 3) return { xato: "Foydalanuvchi nomi kamida 3 ta belgi bo'lsin." };
  if (parol.length < 6) return { xato: "Parol kamida 6 ta belgi bo'lsin." };

  const bor = db().prepare("SELECT id FROM users WHERE username = ? OR email = ?").get(username, email || null);
  if (bor) return { xato: "Bu foydalanuvchi nomi yoki email band." };

  const info = db()
    .prepare("INSERT INTO users (ism, familiya, username, email, parol, rol, created_at) VALUES (?,?,?,?,?,?,?)")
    .run(ism, familiya, username, email || null, parolXesh(parol), "student", Date.now());

  await sessiyaYaratish(Number(info.lastInsertRowid));
  redirect("/dashboard");
}

// ── Kirish ──
export async function kirish(_prev: AuthHolat, form: FormData): Promise<AuthHolat> {
  const idf = String(form.get("idf") ?? "").trim().toLowerCase();
  const parol = String(form.get("parol") ?? "");
  if (!idf || !parol) return { xato: "Ma'lumotlarni kiriting." };

  const u = db()
    .prepare("SELECT id, parol, rol FROM users WHERE username = ? OR email = ?")
    .get(idf, idf) as UserRow | undefined;

  if (!u || !parolTekshir(parol, u.parol)) return { xato: "Login yoki parol noto'g'ri." };

  await sessiyaYaratish(u.id);
  redirect(u.rol === "admin" || u.rol === "teacher" ? "/admin/dashboard" : "/dashboard");
}

// ── Chiqish ──
export async function chiqish() {
  await sessiyaTugatish();
  redirect("/login");
}

// ── Savollarni olish (mashq uchun) ──
export interface KlientSavol {
  id: number;
  mavzu: string;
  qiyinchilik: string;
  matn: string;
  variantlar: string[];
  togri: string;
  izoh: string;
}

export async function savollarOl(params: {
  rejim: "mavzu" | "kurs";
  mavzu?: string;
  qiyinchilik?: string;
  soni: number;
}): Promise<KlientSavol[]> {
  const d = db();
  let rows: Record<string, unknown>[];

  if (params.rejim === "kurs") {
    rows = d.prepare("SELECT * FROM questions ORDER BY RANDOM() LIMIT ?").all(params.soni) as Record<string, unknown>[];
  } else if (params.qiyinchilik && params.qiyinchilik !== "aralash") {
    rows = d
      .prepare("SELECT * FROM questions WHERE mavzu = ? AND qiyinchilik = ? ORDER BY RANDOM() LIMIT ?")
      .all(params.mavzu ?? "", params.qiyinchilik, params.soni) as Record<string, unknown>[];
    if (rows.length === 0) {
      rows = d.prepare("SELECT * FROM questions WHERE mavzu = ? ORDER BY RANDOM() LIMIT ?").all(params.mavzu ?? "", params.soni) as Record<string, unknown>[];
    }
  } else {
    rows = d.prepare("SELECT * FROM questions WHERE mavzu = ? ORDER BY RANDOM() LIMIT ?").all(params.mavzu ?? "", params.soni) as Record<string, unknown>[];
  }

  return rows.map((r) => ({
    id: r.id as number,
    mavzu: r.mavzu as string,
    qiyinchilik: r.qiyinchilik as string,
    matn: r.matn as string,
    variantlar: JSON.parse(r.variantlar as string) as string[],
    togri: r.togri as string,
    izoh: r.izoh as string,
  }));
}

// ── Urinishni saqlash ──
export async function urinishSaqlash(data: {
  rejim: string;
  mavzu?: string;
  jami: number;
  togri: number;
  davomiylik: number;
}) {
  const u = await joriyFoydalanuvchi();
  if (!u) return;
  const ball = Math.round((data.togri / Math.max(1, data.jami)) * 100);
  db()
    .prepare("INSERT INTO attempts (user_id, rejim, mavzu, jami, togri, ball, davomiylik, created_at) VALUES (?,?,?,?,?,?,?,?)")
    .run(u.id, data.rejim, data.mavzu ?? null, data.jami, data.togri, ball, data.davomiylik, Date.now());
}
