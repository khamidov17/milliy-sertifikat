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
