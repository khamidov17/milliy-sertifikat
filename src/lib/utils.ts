import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSana(date: Date): string {
  const oylar = [
    "yanvar", "fevral", "mart", "aprel", "may", "iyun",
    "iyul", "avgust", "sentyabr", "oktyabr", "noyabr", "dekabr",
  ];
  return `${date.getDate()}-${oylar[date.getMonth()]}, ${date.getFullYear()}`;
}

export function pluralSoat(n: number): string {
  return `${n} soat`;
}

// Soniyani "mm:ss" ko'rinishida (taymer va har bir savol vaqti uchun).
export function vaqtQisqa(sekund: number): string {
  const m = Math.floor(sekund / 60);
  const s = sekund % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Soniyani o'qishga qulay o'zbekcha matn ("2 soat 15 daqiqa").
export function vaqtMatn(sekund: number): string {
  if (sekund <= 0) return "0 daqiqa";
  const soat = Math.floor(sekund / 3600);
  const daqiqa = Math.floor((sekund % 3600) / 60);
  const son = sekund % 60;
  if (soat > 0) return daqiqa > 0 ? `${soat} soat ${daqiqa} daqiqa` : `${soat} soat`;
  if (daqiqa > 0) return `${daqiqa} daqiqa`;
  return `${son} soniya`;
}
