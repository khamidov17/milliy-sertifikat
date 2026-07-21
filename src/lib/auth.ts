import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "node:crypto";
import { db } from "./db";

export const SESSION_COOKIE = "milliy_session";
const OMR = 30 * 24 * 60 * 60 * 1000; // 30 kun

export interface AppUser {
  id: number;
  ism: string;
  familiya: string;
  username: string;
  email: string | null;
  rol: "student" | "teacher" | "admin";
}

export async function sessiyaYaratish(userId: number) {
  const token = randomBytes(32).toString("hex");
  const expires = Date.now() + OMR;
  db().prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?,?,?)").run(token, userId, expires);
  const c = await cookies();
  c.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: OMR / 1000,
  });
}

export async function joriyFoydalanuvchi(): Promise<AppUser | null> {
  const c = await cookies();
  const token = c.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const row = db()
    .prepare(
      `SELECT u.id, u.ism, u.familiya, u.username, u.email, u.rol, s.expires_at
       FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?`
    )
    .get(token) as (AppUser & { expires_at: number }) | undefined;
  if (!row) return null;
  if (row.expires_at < Date.now()) {
    db().prepare("DELETE FROM sessions WHERE token = ?").run(token);
    return null;
  }
  const { expires_at, ...user } = row;
  void expires_at;
  return user;
}

export async function sessiyaTugatish() {
  const c = await cookies();
  const token = c.get(SESSION_COOKIE)?.value;
  if (token) db().prepare("DELETE FROM sessions WHERE token = ?").run(token);
  c.delete(SESSION_COOKIE);
}

// Himoyalangan sahifalar uchun. Sessiya bo'lmasa /login ga yo'naltiradi.
export async function foydalanuvchiTalab(rol?: "admin"): Promise<AppUser> {
  const u = await joriyFoydalanuvchi();
  if (!u) redirect("/login");
  if (rol === "admin" && u.rol !== "admin" && u.rol !== "teacher") redirect("/dashboard");
  return u;
}
