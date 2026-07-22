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
  // getClaims() — JWT imzosini LOKAL tekshiradi (ES256 JWKS, keshlanadi).
  // Tarmoq so'rovi YO'Q, lekin XAVFSIZ (imzo tekshiriladi). Hammasi JWT ichida:
  //  ism/familiya/username → user_metadata; rol → app_metadata.
  const { data } = await sb.auth.getClaims();
  const c = data?.claims as
    | { sub?: string; email?: string; user_metadata?: { ism?: string; familiya?: string; username?: string }; app_metadata?: { rol?: string } }
    | undefined;
  if (!c?.sub) return null;
  const m = c.user_metadata ?? {};
  return {
    id: c.sub,
    email: c.email ?? null,
    ism: m.ism ?? "",
    familiya: m.familiya ?? "",
    username: m.username ?? null,
    rol: (c.app_metadata?.rol as AppUser["rol"]) ?? "student",
  };
});

// Himoyalangan sahifalar uchun. Sessiya bo'lmasa /login ga yo'naltiradi.
export async function foydalanuvchiTalab(rol?: "admin"): Promise<AppUser> {
  const u = await joriyFoydalanuvchi();
  if (!u) redirect("/login");
  if (rol === "admin" && u.rol !== "admin" && u.rol !== "teacher") redirect("/dashboard");
  return u;
}
