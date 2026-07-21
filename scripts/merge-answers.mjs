// Savol JSON fayliga rasmiy javob kalitidan `togri` ni to'ldiradi (manba_kod bo'yicha).
// Ishlatish:  node scripts/merge-answers.mjs data/some-questions.json
// Kalit: data/answer-key.json (extract-answer-key.mjs dan).
//
// Har bir savolda manba_kod "YY-NN-QQ" bo'lishi kerak. Mos kelmagan savollar
// hisobotда ko'rsatiladi va togri "" (qoralama) qoladi.

import { readFileSync, writeFileSync } from "node:fs";

const file = process.argv[2];
if (!file) { console.error("Foydalanish: node scripts/merge-answers.mjs <questions.json>"); process.exit(1); }

const key = JSON.parse(readFileSync("data/answer-key.json", "utf8"));
const savollar = JSON.parse(readFileSync(file, "utf8"));

const yil = (yy) => (yy >= 90 ? 1900 + yy : 2000 + yy);
export function javobTop(manbaKod) {
  const m = String(manbaKod || "").match(/^(\d+)-(\d+)-(\d+)$/);
  if (!m) return null;
  const [, yy, ax, q] = m.map(Number);
  return key[yil(yy)]?.[ax]?.[q] ?? null;
}

let toldi = 0, tekshir = 0, mos = 0, moskelmadi = 0;
const muammolar = [];

for (const s of savollar) {
  const k = javobTop(s.manba_kod);
  if (k == null) { moskelmadi++; muammolar.push(`${s.manba_kod}: kalitda yo'q`); continue; }
  if (s.togri && s.togri !== "") {
    tekshir++;
    if (s.togri === k) mos++;
    else muammolar.push(`${s.manba_kod}: mavjud=${s.togri} kalit=${k} (ALMASHTIRILDI)`);
    s.togri = k; // rasmiy kalit ustun turadi
  } else {
    s.togri = k;
    toldi++;
  }
}

writeFileSync(file, JSON.stringify(savollar, null, 2) + "\n");

console.log(`Fayl: ${file}`);
console.log(`  To'ldirildi (bo'sh edi): ${toldi}`);
console.log(`  Tekshirildi (mavjud): ${tekshir}  → mos: ${mos}`);
console.log(`  Kalitda topilmadi: ${moskelmadi}`);
if (muammolar.length) { console.log("  Diqqat:"); muammolar.slice(0, 20).forEach((p) => console.log("   -", p)); }
