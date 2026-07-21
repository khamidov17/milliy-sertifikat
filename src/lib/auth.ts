import "server-only";
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

export async function joriyFoydalanuvchi(): Promise<AppUser | null> {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data: p } = await sb
    .from("profiles")
    .select("ism, familiya, username, rol")
    .eq("id", user.id)
    .single();
  return {
    id: user.id,
    email: user.email ?? null,
    ism: p?.ism ?? "",
    familiya: p?.familiya ?? "",
    username: p?.username ?? null,
    rol: (p?.rol as AppUser["rol"]) ?? "student",
  };
}

// Himoyalangan sahifalar uchun. Sessiya bo'lmasa /login ga yo'naltiradi.
export async function foydalanuvchiTalab(rol?: "admin"): Promise<AppUser> {
  const u = await joriyFoydalanuvchi();
  if (!u) redirect("/login");
  if (rol === "admin" && u.rol !== "admin" && u.rol !== "teacher") redirect("/dashboard");
  return u;
}
