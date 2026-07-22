import "server-only";
import { supabaseServer } from "./supabase/server";
import { supabaseAdmin } from "./supabase/admin";

export interface OxirgiUrinish { nomi: string; ball: number; togri: number; jami: number; }
export interface FoydalanuvchiStat {
  urinishlar: number; jamiSavol: number; jamiTogri: number; jamiVaqt: number; oxirgi?: OxirgiUrinish;
}

export async function foydalanuvchiStat(): Promise<FoydalanuvchiStat> {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  const stat: FoydalanuvchiStat = { urinishlar: 0, jamiSavol: 0, jamiTogri: 0, jamiVaqt: 0 };
  if (!user) return stat;

  // BARCHA urinishlar bo'yicha aniq yig'indi — Postgres aggregate (arzon, cheklovsiz).
  const { data: agg, error } = await sb.rpc("foydalanuvchi_stat").single();
  if (!error && agg) {
    const a = agg as { urinishlar: number; jami_savol: number; jami_togri: number; jami_vaqt: number };
    stat.urinishlar = Number(a.urinishlar) || 0;
    stat.jamiSavol = Number(a.jami_savol) || 0;
    stat.jamiTogri = Number(a.jami_togri) || 0;
    stat.jamiVaqt = Number(a.jami_vaqt) || 0;
  } else {
    // Zaxira: RPC hali yaratilmagan bo'lsa — oxirgi 1000 urinish bo'yicha JS yig'indi.
    const admin = supabaseAdmin();
    const { data } = await admin
      .from("attempts").select("jami,togri,davomiylik")
      .eq("user_id", user.id).order("id", { ascending: false }).limit(1000);
    const rows = data ?? [];
    stat.urinishlar = rows.length;
    stat.jamiSavol = rows.reduce((s, r) => s + (r.jami ?? 0), 0);
    stat.jamiTogri = rows.reduce((s, r) => s + (r.togri ?? 0), 0);
    stat.jamiVaqt = rows.reduce((s, r) => s + (r.davomiylik ?? 0), 0);
  }

  // Oxirgi urinish
  const admin = supabaseAdmin();
  const { data: last } = await admin
    .from("attempts").select("turi,nomi,ball,togri,jami")
    .eq("user_id", user.id).order("id", { ascending: false }).limit(1).maybeSingle();
  if (last) {
    stat.oxirgi = { nomi: last.nomi ?? (last.turi === "kurs" ? "Kurs sinovi" : "Mashq"), ball: last.ball, togri: last.togri, jami: last.jami };
  }

  return stat;
}
