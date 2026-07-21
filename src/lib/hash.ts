import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

// Parolni scrypt bilan xeshlaymiz. Format: "<salt>:<hash>" (ikkalasi hex).
export function parolXesh(parol: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(parol, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function parolTekshir(parol: string, saqlangan: string): boolean {
  const [salt, hash] = saqlangan.split(":");
  if (!salt || !hash) return false;
  const urinish = scryptSync(parol, salt, 64);
  const asl = Buffer.from(hash, "hex");
  return urinish.length === asl.length && timingSafeEqual(urinish, asl);
}
