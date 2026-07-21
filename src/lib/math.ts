// Hozircha faqat MATEMATIKA fani. Boshqa fanlar keyingi bosqichda qo'shiladi.

export const MATEMATIKA = { key: "matematika", nomi: "Matematika", emoji: "📐" };

export const MATH_MAVZULAR = [
  "Algebra",
  "Geometriya",
  "Funksiyalar",
  "Ehtimollik",
  "Trigonometriya",
  "Analiz",
] as const;

export type MathMavzu = (typeof MATH_MAVZULAR)[number];

export const QIYINCHILIKLAR = [
  { key: "oson", nomi: "Oson" },
  { key: "orta", nomi: "O'rta" },
  { key: "qiyin", nomi: "Qiyin" },
  { key: "aralash", nomi: "Aralash" },
] as const;

export const SAVOL_SONLARI = [5, 10, 20, 30] as const;

// Kurs sinovi (Khan Academy uslubidagi) — barcha mavzulardan aralash, taymerli.
export const KURS_SINOVI = {
  savollarSoni: 20,
  daqiqa: 25,
};
