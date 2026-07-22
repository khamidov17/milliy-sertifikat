import "server-only";
import { supabaseAdmin } from "./supabase/admin";
import { joriyFoydalanuvchi } from "./auth";

export interface OxirgiUrinish { nomi: string; ball: number; togri: number; jami: number; }
export interface FoydalanuvchiStat {
  urinishlar: number; jamiSavol: number; jamiTogri: number; jamiVaqt: number; oxirgi?: OxirgiUrinish;
}

// BITTA so'rov bilan: yig'indi + oxirgi urinish. (Supabase RTT qimmat — round-trip'ni
// minimallashtiramiz.) <=1000 urinish uchun aniq; undan ko'p bo'lsa RPC (stats-rpc.sql) tavsiya.
export async function foydalanuvchiStat(): Promise<FoydalanuvchiStat> {
  const stat: FoydalanuvchiStat = { urinishlar: 0, jamiSavol: 0, jamiTogri: 0, jamiVaqt: 0 };
  const u = await joriyFoydalanuvchi(); // cache() — takroriy getUser yo'q
  if (!u) return stat;

  const admin = supabaseAdmin();
  const { data } = await admin
    .from("attempts")
    .select("turi,nomi,ball,togri,jami,davomiylik")
    .eq("user_id", u.id)
    .order("id", { ascending: false })
    .limit(1000);

  const rows = data ?? [];
  stat.urinishlar = rows.length;
  stat.jamiSavol = rows.reduce((s, r) => s + (r.jami ?? 0), 0);
  stat.jamiTogri = rows.reduce((s, r) => s + (r.togri ?? 0), 0);
  stat.jamiVaqt = rows.reduce((s, r) => s + (r.davomiylik ?? 0), 0);
  const last = rows[0];
  if (last) {
    stat.oxirgi = { nomi: last.nomi ?? (last.turi === "kurs" ? "Kurs sinovi" : "Mashq"), ball: last.ball, togri: last.togri, jami: last.jami };
  }
  return stat;
}
