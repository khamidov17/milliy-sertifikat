import "server-only";
import { headers } from "next/headers";

// Oddiy xotira ichidagi (sliding window) rate-limiter.
// DIQQAT: ishlab chiqarishda ko'p instansiya bo'lgani uchun bu yetarli emas —
// Redis/Upstash kabi taqsimlangan limiter kerak. Bu — asosiy himoya (best-effort).

type Buchok = { vaqtlar: number[] };
const g = globalThis as unknown as { __rl?: Map<string, Buchok> };
const store: Map<string, Buchok> = (g.__rl ??= new Map<string, Buchok>());

export async function mijozKaliti(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  return ip;
}

// true = ruxsat, false = limit oshdi
export function tekshirLimit(kalit: string, maxSoni: number, oynaMs: number): boolean {
  const now = Date.now();
  const b = store.get(kalit) ?? { vaqtlar: [] };
  b.vaqtlar = b.vaqtlar.filter((t) => now - t < oynaMs);
  if (b.vaqtlar.length >= maxSoni) {
    store.set(kalit, b);
    return false;
  }
  b.vaqtlar.push(now);
  store.set(kalit, b);
  return true;
}
