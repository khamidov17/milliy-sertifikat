// Hozircha faqat MATEMATIKA fani. Boshqa fanlar keyingi bosqichda qo'shiladi.

export const MATEMATIKA = { key: "matematika", nomi: "Matematika", emoji: "📐" };

// PDF (DTM 1996-2003) ning haqiqiy bo'lim tuzilmasi asosida.
// Hozircha "Natural va butun sonlar" bobining namunaviy mavzulari yuklandi;
// to'liq ajratib olishdan keyin ro'yxat kengaytiriladi.
export const MATH_MAVZULAR = [
  "Boshlang'ich hisoblashlar",
  "Oxirgi raqam",
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
  savollarSoni: 12,
  daqiqa: 15,
};
