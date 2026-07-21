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
  const bosh: FoydalanuvchiStat = { urinishlar: 0, jamiSavol: 0, jamiTogri: 0, jamiVaqt: 0 };
  if (!user) return bosh;

  const admin = supabaseAdmin();
  const { data } = await admin
    .from("attempts")
    .select("turi,nomi,ball,togri,jami,davomiylik")
    .eq("user_id", user.id)
    .order("id", { ascending: false })
    .limit(1000);

  const rows = data ?? [];
  const stat: FoydalanuvchiStat = {
    urinishlar: rows.length,
    jamiSavol: rows.reduce((a, r) => a + (r.jami ?? 0), 0),
    jamiTogri: rows.reduce((a, r) => a + (r.togri ?? 0), 0),
    jamiVaqt: rows.reduce((a, r) => a + (r.davomiylik ?? 0), 0),
  };
  const last = rows[0];
  if (last) stat.oxirgi = { nomi: last.nomi ?? (last.turi === "kurs" ? "Kurs sinovi" : "Mashq"), ball: last.ball, togri: last.togri, jami: last.jami };
  return stat;
}
