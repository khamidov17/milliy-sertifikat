"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase/server";
import { supabaseAdmin } from "./supabase/admin";
import { mijozKaliti, tekshirLimit } from "./ratelimit";

export interface AuthHolat {
  xato?: string;
  xabar?: string;
  ok?: boolean;
  next?: string;
}

function aralashtir<T>(a: T[]): T[] {
  const c = [...a];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

// ═══════════════ AUTH (Supabase Auth) ═══════════════

export async function royxatdanOtish(_prev: AuthHolat, form: FormData): Promise<AuthHolat> {
  if (!tekshirLimit("signup:" + (await mijozKaliti()), 5, 60_000))
    return { xato: "Juda ko'p urinish. Bir oz kuting." };

  const ism = String(form.get("ism") ?? "").trim();
  const familiya = String(form.get("familiya") ?? "").trim();
  const username = String(form.get("username") ?? "").trim().toLowerCase();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const parol = String(form.get("parol") ?? "");

  if (!ism || !username || !email || !parol) return { xato: "Barcha majburiy maydonlarni to'ldiring." };
  if (username.length < 3 || username.length > 30 || !/^[a-z0-9_]+$/.test(username))
    return { xato: "Foydalanuvchi nomi 3-30 ta harf/raqam/_ bo'lsin." };
  if (parol.length < 6) return { xato: "Parol kamida 6 ta belgi bo'lsin." };

  const admin = supabaseAdmin();
  const { data: bor } = await admin.from("profiles").select("id").eq("username", username).maybeSingle();
  if (bor) return { xato: "Bu foydalanuvchi nomi band." };

  const sb = await supabaseServer();
  const { data, error } = await sb.auth.signUp({
    email,
    password: parol,
    options: { data: { ism, familiya, username } },
  });
  if (error) {
    // Email enumeratsiyasini oldini olish uchun umumiy xabar
    return { xabar: "Ro'yxatdan o'tish so'rovi qabul qilindi. Emailingizni tekshiring." };
  }
  if (data.session) return { ok: true, next: "/dashboard" };
  return { xabar: "Ro'yxatdan o'tdingiz. Emailingizni tasdiqlang, so'ng tizimga kiring." };
}

export async function kirish(_prev: AuthHolat, form: FormData): Promise<AuthHolat> {
  if (!tekshirLimit("login:" + (await mijozKaliti()), 10, 60_000))
    return { xato: "Juda ko'p urinish. Bir oz kuting." };

  const idf = String(form.get("idf") ?? "").trim().toLowerCase();
  const parol = String(form.get("parol") ?? "");
  if (!idf || !parol) return { xato: "Ma'lumotlarni kiriting." };

  let email = idf;
  if (!idf.includes("@")) {
    const admin = supabaseAdmin();
    const { data: p } = await admin.from("profiles").select("id").eq("username", idf).maybeSingle();
    if (!p) return { xato: "Login yoki parol noto'g'ri." };
    const { data: u } = await admin.auth.admin.getUserById(p.id);
    if (!u?.user?.email) return { xato: "Login yoki parol noto'g'ri." };
    email = u.user.email;
  }

  const sb = await supabaseServer();
  const { data, error } = await sb.auth.signInWithPassword({ email, password: parol });
  if (error || !data.user) return { xato: "Login yoki parol noto'g'ri." };

  const admin = supabaseAdmin();
  const { data: p } = await admin.from("profiles").select("rol").eq("id", data.user.id).single();
  const next = p?.rol === "admin" || p?.rol === "teacher" ? "/admin/dashboard" : "/dashboard";
  return { ok: true, next };
}

export async function chiqish() {
  const sb = await supabaseServer();
  await sb.auth.signOut();
  redirect("/login");
}

// Parolni tiklash — email yuborish
export async function parolTiklashSorov(_prev: AuthHolat, form: FormData): Promise<AuthHolat> {
  if (!tekshirLimit("reset:" + (await mijozKaliti()), 5, 60_000))
    return { xato: "Juda ko'p urinish. Bir oz kuting." };
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!email) return { xato: "Email kiriting." };
  const sb = await supabaseServer();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  await sb.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback?next=/reset-password` });
  // Enumeratsiyani oldini olish uchun har doim bir xil javob
  return { xabar: "Agar bu email ro'yxatda bo'lsa, tiklash havolasi yuborildi." };
}

// Yangi parol o'rnatish (reset havolasidan keyin)
export async function parolYangilash(_prev: AuthHolat, form: FormData): Promise<AuthHolat> {
  const parol = String(form.get("parol") ?? "");
  if (parol.length < 6) return { xato: "Parol kamida 6 ta belgi bo'lsin." };
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { xato: "Havola yaroqsiz yoki muddati tugagan." };
  const { error } = await sb.auth.updateUser({ password: parol });
  if (error) return { xato: "Parolni yangilab bo'lmadi." };
  return { ok: true, next: "/dashboard" };
}

// ═══════════════ MASHQ (practice — SERVERDA baholanadi) ═══════════════

// togri/izoh MIJOZGA YUBORILMAYDI.
export interface KlientSavol {
  id: number; bob: string | null; mavzu: string; manba_kod: string | null;
  qiyinchilik: string; matn: string; variantlar: string[];
}

const SEL_XAVFSIZ = "id,bob,mavzu,manba_kod,qiyinchilik,matn,variantlar";

export async function savollarOl(params: {
  rejim: "mavzu" | "kurs"; mavzu?: string; qiyinchilik?: string; soni: number;
}): Promise<KlientSavol[]> {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];
  const soni = Math.min(Math.max(1, Number(params.soni) || 10), 50); // cheklov

  const admin = supabaseAdmin();
  let rows: KlientSavol[] = [];
  if (params.rejim === "kurs") {
    const { data } = await admin.from("questions").select(SEL_XAVFSIZ).limit(500);
    rows = aralashtir((data ?? []) as KlientSavol[]).slice(0, soni);
  } else {
    let q = admin.from("questions").select(SEL_XAVFSIZ).eq("mavzu", params.mavzu ?? "");
    if (params.qiyinchilik && params.qiyinchilik !== "aralash") q = q.eq("qiyinchilik", params.qiyinchilik);
    let { data } = await q.limit(500);
    if ((!data || data.length === 0) && params.qiyinchilik && params.qiyinchilik !== "aralash") {
      data = (await admin.from("questions").select(SEL_XAVFSIZ).eq("mavzu", params.mavzu ?? "").limit(500)).data;
    }
    rows = aralashtir((data ?? []) as KlientSavol[]).slice(0, soni);
  }
  return rows.map((r) => ({ ...r, qiyinchilik: r.qiyinchilik ?? "orta" }));
}

// Bitta savol javobini serverda tekshiradi (javob faqat shu savol uchun ochiladi).
export interface JavobNatija { togri: boolean; togriJavob: string; izoh: string; }
export async function javobTekshir(questionId: number, tanlangan: string): Promise<JavobNatija | null> {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const admin = supabaseAdmin();
  const { data: q } = await admin.from("questions").select("togri,izoh").eq("id", questionId).single();
  if (!q) return null;
  return { togri: tanlangan === q.togri, togriJavob: q.togri, izoh: q.izoh ?? "" };
}

// Urinishni SERVERDA baholab saqlaydi (klient balli/togri ishonchsiz).
export async function urinishSaqlash(data: {
  turi: string; mock_id?: number | null;
  davomiylik: number; javoblar: { question_id: number; tanlangan: string | null; sekund: number }[];
}) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  if (!tekshirLimit("save:" + user.id, 40, 60_000)) return;

  const turi = data.turi === "kurs" ? "kurs" : "mavzu"; // whitelist
  const javoblar = (Array.isArray(data.javoblar) ? data.javoblar : []).slice(0, 200);
  const qids = javoblar.map((j) => j.question_id);
  if (!qids.length) return;

  const admin = supabaseAdmin();
  const { data: qs } = await admin.from("questions").select("id,togri,mavzu").in("id", qids);
  const map = new Map((qs ?? []).map((q) => [q.id, { togri: q.togri, mavzu: q.mavzu }]));

  let togri = 0;
  const rows = javoblar.map((j) => {
    const q = map.get(j.question_id);
    const ok = !!q && q.togri === j.tanlangan;
    if (ok) togri++;
    return { question_id: j.question_id, tanlangan: j.tanlangan, togri: ok, sekund: Math.max(0, Math.min(36000, Number(j.sekund) || 0)) };
  });
  const jami = javoblar.length;
  const ball = Math.round((togri / Math.max(1, jami)) * 100);
  const nomi = turi === "kurs" ? "Kurs sinovi" : (map.get(qids[0])?.mavzu ?? "Mashq"); // serverdan

  const { data: att } = await admin.from("attempts").insert({
    user_id: user.id, turi, mock_id: data.mock_id ?? null, nomi,
    jami, togri, ball, davomiylik: Math.max(0, Math.min(86400, Number(data.davomiylik) || 0)),
  }).select("id").single();
  if (att) {
    const ins = rows.map((r) => ({ attempt_id: att.id, ...r }));
    if (ins.length) await admin.from("attempt_answers").insert(ins);
  }
}

// ═══════════════ SINOV IMTIHONLARI (mock — SERVERDA baholanadi) ═══════════════

export interface MockRoyxatItem {
  id: number; nomi: string; tavsif: string; turi: string; davomiylikDaqiqa: number; savollarSoni: number;
  holat: "ochiq" | "kelgusi" | "yopilgan"; boshlanish: number | null; tugash: number | null;
}
export interface MockSavol { id: number; mavzu: string; qiyinchilik: string; matn: string; variantlar: string[]; manba_kod: string | null; }
export interface MockBoshlash { nomi: string; davomiylikDaqiqa: number; savollar: MockSavol[]; }
export interface NatijaSavol {
  question_id: number; matn: string; variantlar: string[]; mavzu: string; manba_kod: string | null;
  tanlangan: string | null; togriJavob: string; togri: boolean; izoh: string; sekund: number;
}
export interface MockNatija { attemptId: number; ball: number; togri: number; jami: number; davomiylik: number; natijalar: NatijaSavol[]; }

export async function mockRoyxat(): Promise<MockRoyxatItem[]> {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];
  const admin = supabaseAdmin();
  const now = Date.now();
  const { data } = await admin
    .from("mock_exams")
    .select("id,nomi,tavsif,turi,davomiylik_daqiqa,boshlanish_at,tugash_at, mock_questions(count)")
    .eq("active", true)
    .order("id");
  return (data ?? []).map((r) => {
    const b = r.boshlanish_at ? new Date(r.boshlanish_at).getTime() : null;
    const t = r.tugash_at ? new Date(r.tugash_at).getTime() : null;
    let holat: "ochiq" | "kelgusi" | "yopilgan" = "ochiq";
    if (b && now < b) holat = "kelgusi";
    else if (t && now > t) holat = "yopilgan";
    const cnt = Array.isArray(r.mock_questions) && r.mock_questions[0] ? (r.mock_questions[0] as { count: number }).count : 0;
    return {
      id: r.id, nomi: r.nomi, tavsif: r.tavsif ?? "", turi: r.turi,
      davomiylikDaqiqa: r.davomiylik_daqiqa, savollarSoni: cnt, holat, boshlanish: b, tugash: t,
    };
  });
}

export async function mockSavollari(mockId: number): Promise<MockBoshlash | { xato: string }> {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { xato: "Avval tizimga kiring." };
  const admin = supabaseAdmin();
  const { data: m } = await admin.from("mock_exams").select("*").eq("id", mockId).eq("active", true).single();
  if (!m) return { xato: "Imtihon topilmadi." };
  const now = Date.now();
  if (m.boshlanish_at && now < new Date(m.boshlanish_at).getTime()) return { xato: "Imtihon hali boshlanmagan." };
  if (m.tugash_at && now > new Date(m.tugash_at).getTime()) return { xato: "Imtihon muddati tugagan." };
  const { data } = await admin
    .from("mock_questions")
    .select("tartib, questions(id,mavzu,qiyinchilik,matn,variantlar,manba_kod)")
    .eq("mock_id", mockId)
    .order("tartib");
  const savollar: MockSavol[] = (data ?? []).map((r) => {
    const q = r.questions as unknown as { id: number; mavzu: string; qiyinchilik: string | null; matn: string; variantlar: string[]; manba_kod: string | null };
    return { id: q.id, mavzu: q.mavzu, qiyinchilik: q.qiyinchilik ?? "orta", matn: q.matn, variantlar: q.variantlar, manba_kod: q.manba_kod };
  });
  return { nomi: m.nomi, davomiylikDaqiqa: m.davomiylik_daqiqa, savollar };
}

export async function mockYuborish(data: {
  mockId: number; javoblar: { question_id: number; tanlangan: string | null; sekund: number }[]; davomiylik: number;
}): Promise<MockNatija | { xato: string }> {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { xato: "Avval tizimga kiring." };
  if (!tekshirLimit("mock:" + user.id, 20, 60_000)) return { xato: "Juda ko'p urinish. Bir oz kuting." };

  const admin = supabaseAdmin();
  const { data: m } = await admin.from("mock_exams").select("nomi,boshlanish_at,tugash_at").eq("id", data.mockId).single();
  if (!m) return { xato: "Imtihon topilmadi." };
  const now = Date.now();
  if (m.boshlanish_at && now < new Date(m.boshlanish_at).getTime()) return { xato: "Imtihon hali boshlanmagan." };
  if (m.tugash_at && now > new Date(m.tugash_at).getTime()) return { xato: "Imtihon muddati tugagan." };

  // FAQAT shu imtihonga tegishli savollar (IDOR / answer-oracle himoyasi)
  const { data: mq } = await admin.from("mock_questions").select("question_id").eq("mock_id", data.mockId);
  const ruxsat = new Set((mq ?? []).map((r) => r.question_id));
  const javoblar = (Array.isArray(data.javoblar) ? data.javoblar : []).filter((j) => ruxsat.has(j.question_id));
  const qids = javoblar.map((j) => j.question_id);

  const { data: qs } = qids.length
    ? await admin.from("questions").select("id,matn,variantlar,togri,izoh,mavzu,manba_kod").in("id", qids)
    : { data: [] };
  const qmap = new Map<number, { matn: string; variantlar: string[]; togri: string; izoh: string; mavzu: string; manba_kod: string | null }>();
  for (const q of qs ?? []) qmap.set((q as { id: number }).id, q as { id: number } & { matn: string; variantlar: string[]; togri: string; izoh: string; mavzu: string; manba_kod: string | null });

  let togri = 0;
  const natijalar: NatijaSavol[] = javoblar.map((j) => {
    const q = qmap.get(j.question_id);
    const ok = !!q && j.tanlangan === q.togri;
    if (ok) togri++;
    return {
      question_id: j.question_id, matn: q?.matn ?? "", variantlar: q?.variantlar ?? [],
      mavzu: q?.mavzu ?? "", manba_kod: q?.manba_kod ?? null, tanlangan: j.tanlangan,
      togriJavob: q?.togri ?? "", togri: ok, izoh: q?.izoh ?? "", sekund: Math.max(0, Math.min(36000, Number(j.sekund) || 0)),
    };
  });

  const jami = natijalar.length;
  const ball = Math.round((togri / Math.max(1, jami)) * 100);
  const { data: att } = await admin.from("attempts").insert({
    user_id: user.id, turi: "mock", mock_id: data.mockId, nomi: m.nomi,
    jami, togri, ball, davomiylik: Math.max(0, Math.min(86400, Number(data.davomiylik) || 0)),
  }).select("id").single();
  if (att) {
    const rows = natijalar.map((n) => ({ attempt_id: att.id, question_id: n.question_id, tanlangan: n.tanlangan, togri: n.togri, sekund: n.sekund }));
    if (rows.length) await admin.from("attempt_answers").insert(rows);
  }
  return { attemptId: att?.id ?? 0, ball, togri, jami, davomiylik: data.davomiylik, natijalar };
}

// ═══════════════ TARIX (history) ═══════════════

export interface TarixItem { id: number; turi: string; nomi: string; ball: number; togri: number; jami: number; davomiylik: number; sana: number; }
export interface TarixDetal extends TarixItem { natijalar: NatijaSavol[]; }

export async function tarix(): Promise<TarixItem[]> {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];
  const admin = supabaseAdmin();
  const { data } = await admin
    .from("attempts")
    .select("id,turi,nomi,ball,togri,jami,davomiylik,created_at")
    .eq("user_id", user.id)
    .order("id", { ascending: false })
    .limit(100);
  return (data ?? []).map((r) => ({
    id: r.id, turi: r.turi, nomi: r.nomi ?? "Mashq", ball: r.ball, togri: r.togri,
    jami: r.jami, davomiylik: r.davomiylik, sana: new Date(r.created_at).getTime(),
  }));
}

export async function tarixDetal(attemptId: number): Promise<TarixDetal | null> {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const admin = supabaseAdmin();
  const { data: a } = await admin.from("attempts").select("*").eq("id", attemptId).eq("user_id", user.id).single();
  if (!a) return null;
  const { data: rows } = await admin
    .from("attempt_answers")
    .select("question_id,tanlangan,togri,sekund, questions(matn,variantlar,togri,izoh,mavzu,manba_kod)")
    .eq("attempt_id", attemptId)
    .order("id");
  const natijalar: NatijaSavol[] = (rows ?? []).map((r) => {
    const q = r.questions as unknown as { matn: string; variantlar: string[]; togri: string; izoh: string; mavzu: string; manba_kod: string | null };
    return {
      question_id: r.question_id, matn: q?.matn ?? "", variantlar: q?.variantlar ?? [],
      mavzu: q?.mavzu ?? "", manba_kod: q?.manba_kod ?? null, tanlangan: r.tanlangan,
      togriJavob: q?.togri ?? "", togri: r.togri, izoh: q?.izoh ?? "", sekund: r.sekund,
    };
  });
  return {
    id: a.id, turi: a.turi, nomi: a.nomi ?? "Mashq", ball: a.ball, togri: a.togri,
    jami: a.jami, davomiylik: a.davomiylik, sana: new Date(a.created_at).getTime(), natijalar,
  };
}
