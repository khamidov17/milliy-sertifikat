import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase/server";

export interface AppUser {
  id: string;
  ism: string;
  familiya: string;
  username: string | null;
  email: string | null;
  rol: "student" | "teacher" | "admin";
}

// cache() — bitta so'rov (render) davomida faqat BIR MARTA bajariladi.
// Shunday qilib layout + page + stats getUser+profile'ni takror chaqirmaydi
// (har biri Supabase'ga alohida tarmoq so'rovi edi — sekinlik sababi).
export const joriyFoydalanuvchi = cache(async (): Promise<AppUser | null> => {
  const sb = await supabaseServer();
  // HAMMASI JWT ichida (LOKAL o'qiladi — DB round-trip YO'Q):
  //  - ism/familiya/username → user_metadata (signUp'da yoziladi)
  //  - rol → app_metadata (default "student"; admin/teacher uchun aniq o'rnatiladi)
  // Middleware sessiyani getUser bilan tekshiradi, shuning uchun getSession ishonchli.
  const { data: { session } } = await sb.auth.getSession();
  const user = session?.user;
  if (!user) return null;
  const m = (user.user_metadata ?? {}) as { ism?: string; familiya?: string; username?: string };
  const rol = ((user.app_metadata as { rol?: string })?.rol as AppUser["rol"]) ?? "student";
  return {
    id: user.id,
    email: user.email ?? null,
    ism: m.ism ?? "",
    familiya: m.familiya ?? "",
    username: m.username ?? null,
    rol,
  };
});

// Himoyalangan sahifalar uchun. Sessiya bo'lmasa /login ga yo'naltiradi.
export async function foydalanuvchiTalab(rol?: "admin"): Promise<AppUser> {
  const u = await joriyFoydalanuvchi();
  if (!u) redirect("/login");
  if (rol === "admin" && u.rol !== "admin" && u.rol !== "teacher") redirect("/dashboard");
  return u;
}
