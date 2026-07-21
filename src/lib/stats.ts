import "server-only";
import { db } from "./db";

export interface OxirgiUrinish {
  nomi: string;
  ball: number;
  togri: number;
  jami: number;
}

export interface FoydalanuvchiStat {
  urinishlar: number;
  jamiSavol: number;
  jamiTogri: number;
  jamiVaqt: number; // soniya — umumiy sarflangan vaqt
  oxirgi?: OxirgiUrinish;
}

export function foydalanuvchiStat(userId: number): FoydalanuvchiStat {
  const agg = db()
    .prepare(
      `SELECT COUNT(*) urinishlar,
              COALESCE(SUM(jami),0) jamiSavol,
              COALESCE(SUM(togri),0) jamiTogri,
              COALESCE(SUM(davomiylik),0) jamiVaqt
       FROM attempts WHERE user_id = ?`
    )
    .get(userId) as { urinishlar: number; jamiSavol: number; jamiTogri: number; jamiVaqt: number };

  const last = db()
    .prepare(
      "SELECT rejim, mavzu, ball, togri, jami FROM attempts WHERE user_id = ? ORDER BY id DESC LIMIT 1"
    )
    .get(userId) as { rejim: string; mavzu: string | null; ball: number; togri: number; jami: number } | undefined;

  return {
    urinishlar: agg.urinishlar,
    jamiSavol: agg.jamiSavol,
    jamiTogri: agg.jamiTogri,
    jamiVaqt: agg.jamiVaqt,
    oxirgi: last
      ? { nomi: last.mavzu ?? (last.rejim === "kurs" ? "Kurs sinovi" : "Mashq"), ball: last.ball, togri: last.togri, jami: last.jami }
      : undefined,
  };
}
