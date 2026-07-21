"use server";

import { redirect } from "next/navigation";
import { db } from "./db";
import { parolXesh, parolTekshir } from "./hash";
import { sessiyaYaratish, sessiyaTugatish, joriyFoydalanuvchi } from "./auth";

export interface AuthHolat {
  xato?: string;
}

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
    .get(idf, idf) as { id: number; parol: string; rol: string } | undefined;

  if (!u || !parolTekshir(parol, u.parol)) return { xato: "Login yoki parol noto'g'ri." };

  await sessiyaYaratish(u.id);
  redirect(u.rol === "admin" || u.rol === "teacher" ? "/admin/dashboard" : "/dashboard");
}

export async function chiqish() {
  await sessiyaTugatish();
  redirect("/login");
}

// ═══════════════ MASHQ (practice — klientda baholanadi) ═══════════════

export interface KlientSavol {
  id: number;
  bob: string | null;
  mavzu: string;
  manba_kod: string | null;
  qiyinchilik: string;
  matn: string;
  variantlar: string[];
  togri: string;
  izoh: string;
}

type SavolRow = {
  id: number; bob: string | null; mavzu: string; manba_kod: string | null;
  qiyinchilik: string | null; matn: string; variantlar: string; togri: string; izoh: string;
};

export async function savollarOl(params: {
  rejim: "mavzu" | "kurs";
  mavzu?: string;
  qiyinchilik?: string;
  soni: number;
}): Promise<KlientSavol[]> {
  const d = db();
  let rows: SavolRow[];
  if (params.rejim === "kurs") {
    rows = d.prepare("SELECT * FROM questions ORDER BY RANDOM() LIMIT ?").all(params.soni) as SavolRow[];
  } else if (params.qiyinchilik && params.qiyinchilik !== "aralash") {
    rows = d.prepare("SELECT * FROM questions WHERE mavzu = ? AND qiyinchilik = ? ORDER BY RANDOM() LIMIT ?").all(params.mavzu ?? "", params.qiyinchilik, params.soni) as SavolRow[];
    if (rows.length === 0) rows = d.prepare("SELECT * FROM questions WHERE mavzu = ? ORDER BY RANDOM() LIMIT ?").all(params.mavzu ?? "", params.soni) as SavolRow[];
  } else {
    rows = d.prepare("SELECT * FROM questions WHERE mavzu = ? ORDER BY RANDOM() LIMIT ?").all(params.mavzu ?? "", params.soni) as SavolRow[];
  }
  return rows.map((r) => ({
    id: r.id, bob: r.bob, mavzu: r.mavzu, manba_kod: r.manba_kod,
    qiyinchilik: r.qiyinchilik ?? "orta", matn: r.matn,
    variantlar: JSON.parse(r.variantlar) as string[], togri: r.togri, izoh: r.izoh ?? "",
  }));
}

export interface JavobYozuv {
  question_id: number;
  tanlangan: string | null;
  togri: boolean;
  sekund: number;
}

// Urinishni + har bir savol javobini saqlaydi (tarix/review uchun).
export async function urinishSaqlash(data: {
  turi: string;
  mock_id?: number | null;
  nomi?: string;
  jami: number;
  togri: number;
  davomiylik: number;
  javoblar: JavobYozuv[];
}) {
  const u = await joriyFoydalanuvchi();
  if (!u) return;
  const ball = Math.round((data.togri / Math.max(1, data.jami)) * 100);
  const info = db()
    .prepare("INSERT INTO attempts (user_id, turi, mock_id, nomi, jami, togri, ball, davomiylik, created_at) VALUES (?,?,?,?,?,?,?,?,?)")
    .run(u.id, data.turi, data.mock_id ?? null, data.nomi ?? null, data.jami, data.togri, ball, data.davomiylik, Date.now());
  const aid = Number(info.lastInsertRowid);
  const ins = db().prepare("INSERT INTO attempt_answers (attempt_id, question_id, tanlangan, togri, sekund) VALUES (?,?,?,?,?)");
  for (const j of data.javoblar) ins.run(aid, j.question_id, j.tanlangan, j.togri ? 1 : 0, j.sekund);
}

// ═══════════════ SINOV IMTIHONLARI (mock — SERVERDA baholanadi) ═══════════════

export interface MockRoyxatItem {
  id: number; nomi: string; tavsif: string; turi: string;
  davomiylikDaqiqa: number; savollarSoni: number;
  holat: "ochiq" | "kelgusi" | "yopilgan";
  boshlanish: number | null; tugash: number | null;
}
export interface MockSavol {
  id: number; mavzu: string; qiyinchilik: string; matn: string; variantlar: string[]; manba_kod: string | null;
}
export interface MockBoshlash { nomi: string; davomiylikDaqiqa: number; savollar: MockSavol[]; }
export interface NatijaSavol {
  question_id: number; matn: string; variantlar: string[]; mavzu: string; manba_kod: string | null;
  tanlangan: string | null; togriJavob: string; togri: boolean; izoh: string; sekund: number;
}
export interface MockNatija { attemptId: number; ball: number; togri: number; jami: number; davomiylik: number; natijalar: NatijaSavol[]; }

type MockRow = {
  id: number; nomi: string; tavsif: string; turi: string; davomiylik_daqiqa: number;
  boshlanish_at: number | null; tugash_at: number | null; savollarSoni: number;
};

export async function mockRoyxat(): Promise<MockRoyxatItem[]> {
  const now = Date.now();
  const rows = db()
    .prepare("SELECT m.*, (SELECT COUNT(*) FROM mock_questions q WHERE q.mock_id = m.id) savollarSoni FROM mock_exams m WHERE m.active = 1 ORDER BY m.id")
    .all() as MockRow[];
  return rows.map((r) => {
    let holat: "ochiq" | "kelgusi" | "yopilgan" = "ochiq";
    if (r.boshlanish_at && now < r.boshlanish_at) holat = "kelgusi";
    else if (r.tugash_at && now > r.tugash_at) holat = "yopilgan";
    return {
      id: r.id, nomi: r.nomi, tavsif: r.tavsif, turi: r.turi,
      davomiylikDaqiqa: r.davomiylik_daqiqa, savollarSoni: r.savollarSoni,
      holat, boshlanish: r.boshlanish_at, tugash: r.tugash_at,
    };
  });
}

export async function mockSavollari(mockId: number): Promise<MockBoshlash | { xato: string }> {
  const u = await joriyFoydalanuvchi();
  if (!u) return { xato: "Avval tizimga kiring." };
  const m = db().prepare("SELECT * FROM mock_exams WHERE id = ? AND active = 1").get(mockId) as MockRow | undefined;
  if (!m) return { xato: "Imtihon topilmadi." };
  const now = Date.now();
  if (m.boshlanish_at && now < m.boshlanish_at) return { xato: "Imtihon hali boshlanmagan." };
  if (m.tugash_at && now > m.tugash_at) return { xato: "Imtihon muddati tugagan." };
  const rows = db()
    .prepare("SELECT q.id, q.mavzu, q.qiyinchilik, q.matn, q.variantlar, q.manba_kod FROM mock_questions mq JOIN questions q ON q.id = mq.question_id WHERE mq.mock_id = ? ORDER BY mq.tartib")
    .all(mockId) as { id: number; mavzu: string; qiyinchilik: string | null; matn: string; variantlar: string; manba_kod: string | null }[];
  return {
    nomi: m.nomi, davomiylikDaqiqa: m.davomiylik_daqiqa,
    savollar: rows.map((r) => ({ id: r.id, mavzu: r.mavzu, qiyinchilik: r.qiyinchilik ?? "orta", matn: r.matn, variantlar: JSON.parse(r.variantlar) as string[], manba_kod: r.manba_kod })),
  };
}

export async function mockYuborish(data: {
  mockId: number;
  javoblar: { question_id: number; tanlangan: string | null; sekund: number }[];
  davomiylik: number;
}): Promise<MockNatija | { xato: string }> {
  const u = await joriyFoydalanuvchi();
  if (!u) return { xato: "Avval tizimga kiring." };
  const m = db().prepare("SELECT nomi FROM mock_exams WHERE id = ?").get(data.mockId) as { nomi: string } | undefined;

  const qids = data.javoblar.map((j) => j.question_id);
  const qmap = new Map<number, { matn: string; variantlar: string; togri: string; izoh: string; mavzu: string; manba_kod: string | null }>();
  if (qids.length) {
    const place = qids.map(() => "?").join(",");
    const rows = db().prepare(`SELECT id, matn, variantlar, togri, izoh, mavzu, manba_kod FROM questions WHERE id IN (${place})`).all(...qids) as { id: number; matn: string; variantlar: string; togri: string; izoh: string; mavzu: string; manba_kod: string | null }[];
    for (const r of rows) qmap.set(r.id, r);
  }

  let togri = 0;
  const natijalar: NatijaSavol[] = data.javoblar.map((j) => {
    const q = qmap.get(j.question_id);
    const ok = !!q && j.tanlangan === q.togri;
    if (ok) togri++;
    return {
      question_id: j.question_id, matn: q?.matn ?? "", variantlar: q ? (JSON.parse(q.variantlar) as string[]) : [],
      mavzu: q?.mavzu ?? "", manba_kod: q?.manba_kod ?? null, tanlangan: j.tanlangan,
      togriJavob: q?.togri ?? "", togri: ok, izoh: q?.izoh ?? "", sekund: j.sekund,
    };
  });

  const jami = data.javoblar.length;
  const ball = Math.round((togri / Math.max(1, jami)) * 100);
  const info = db()
    .prepare("INSERT INTO attempts (user_id, turi, mock_id, nomi, jami, togri, ball, davomiylik, created_at) VALUES (?,?,?,?,?,?,?,?,?)")
    .run(u.id, "mock", data.mockId, m?.nomi ?? "Sinov", jami, togri, ball, data.davomiylik, Date.now());
  const aid = Number(info.lastInsertRowid);
  const ins = db().prepare("INSERT INTO attempt_answers (attempt_id, question_id, tanlangan, togri, sekund) VALUES (?,?,?,?,?)");
  for (const n of natijalar) ins.run(aid, n.question_id, n.tanlangan, n.togri ? 1 : 0, n.sekund);

  return { attemptId: aid, ball, togri, jami, davomiylik: data.davomiylik, natijalar };
}

// ═══════════════ TARIX (history) ═══════════════

export interface TarixItem {
  id: number; turi: string; nomi: string; ball: number; togri: number; jami: number; davomiylik: number; sana: number;
}
export interface TarixDetal extends TarixItem { natijalar: NatijaSavol[]; }

export async function tarix(): Promise<TarixItem[]> {
  const u = await joriyFoydalanuvchi();
  if (!u) return [];
  const rows = db()
    .prepare("SELECT id, turi, nomi, ball, togri, jami, davomiylik, created_at FROM attempts WHERE user_id = ? ORDER BY id DESC LIMIT 100")
    .all(u.id) as { id: number; turi: string; nomi: string | null; ball: number; togri: number; jami: number; davomiylik: number; created_at: number }[];
  return rows.map((r) => ({ id: r.id, turi: r.turi, nomi: r.nomi ?? "Mashq", ball: r.ball, togri: r.togri, jami: r.jami, davomiylik: r.davomiylik, sana: r.created_at }));
}

export async function tarixDetal(attemptId: number): Promise<TarixDetal | null> {
  const u = await joriyFoydalanuvchi();
  if (!u) return null;
  const a = db().prepare("SELECT * FROM attempts WHERE id = ? AND user_id = ?").get(attemptId, u.id) as
    | { id: number; turi: string; nomi: string | null; ball: number; togri: number; jami: number; davomiylik: number; created_at: number }
    | undefined;
  if (!a) return null;
  const rows = db()
    .prepare("SELECT aa.question_id, aa.tanlangan, aa.togri, aa.sekund, q.matn, q.variantlar, q.togri togriJavob, q.izoh, q.mavzu, q.manba_kod FROM attempt_answers aa JOIN questions q ON q.id = aa.question_id WHERE aa.attempt_id = ? ORDER BY aa.id")
    .all(attemptId) as { question_id: number; tanlangan: string | null; togri: number; sekund: number; matn: string; variantlar: string; togriJavob: string; izoh: string; mavzu: string; manba_kod: string | null }[];
  const natijalar: NatijaSavol[] = rows.map((r) => ({
    question_id: r.question_id, matn: r.matn, variantlar: JSON.parse(r.variantlar) as string[],
    mavzu: r.mavzu, manba_kod: r.manba_kod, tanlangan: r.tanlangan, togriJavob: r.togriJavob,
    togri: !!r.togri, izoh: r.izoh ?? "", sekund: r.sekund,
  }));
  return { id: a.id, turi: a.turi, nomi: a.nomi ?? "Mashq", ball: a.ball, togri: a.togri, jami: a.jami, davomiylik: a.davomiylik, sana: a.created_at, natijalar };
}
