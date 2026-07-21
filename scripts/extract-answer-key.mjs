// Javob kalitini PDF matn qatlamidan ajratib oladi (vision emas — ishonchli).
// Har bir sahifa 2 ustunli; ustunlarni alohida kesib olamiz (interleaving yo'q).
// Chiqish: data/answer-key.json = { [year]: { [axborotnoma]: { [qnum]: "A".."E" } } }
//
// Ishga tushirish:  node scripts/extract-answer-key.mjs
// PDF: ~/Desktop/Matematika.1996_2003.pdf (repoga kiritilmaydi)

import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const PDF = process.env.PDF_PATH || path.join(os.homedir(), "Desktop", "Matematika.1996_2003.pdf");
const PAGES = [300, 301, 302, 303, 304, 305, 306, 307];

function colText(page, x, w) {
  return execFileSync(
    "pdftotext",
    ["-layout", "-f", String(page), "-l", String(page), "-x", String(x), "-y", "0", "-W", String(w), "-H", "900", PDF, "-"],
    { encoding: "utf8" }
  );
}

const key = {};
let year = null;
let axb = null;

function feed(line) {
  const ym = line.match(/(\d{4})\s*yil\s*-\s*Matematika/);
  if (ym) { year = +ym[1]; key[year] ??= {}; return; }

  const am = line.match(/(\d+)\s*-\s*axborotnoma/);
  if (am) { axb = +am[1]; if (year != null) key[year][axb] ??= {}; return; }

  if (year == null || axb == null) return;
  const toks = line.trim().split(/\s+/).filter(Boolean);
  if (!toks.length || !/^\d+$/.test(toks[0])) return;

  const row = +toks[0];
  const letters = toks.slice(1).filter((t) => /^[A-E]$/.test(t));
  if (!letters.length) return; // sarlavha "0 1 2..." yoki sahifa raqami

  const start = row === 0 ? 1 : 0; // 0-qatorda 0-ustun bo'sh (savol 0 yo'q)
  letters.forEach((L, i) => { key[year][axb][row * 10 + start + i] = L; });
}

for (const page of PAGES) {
  year = null; axb = null; // har sahifa yangi yil
  const left = colText(page, 0, 295);
  const right = colText(page, 295, 305);
  for (const l of (left + "\n" + right).split("\n")) feed(l);
}

const out = path.join(process.cwd(), "data", "answer-key.json");
writeFileSync(out, JSON.stringify(key, null, 0) + "\n");

// Xulosa
let jami = 0;
for (const y of Object.keys(key)) for (const a of Object.keys(key[y])) jami += Object.keys(key[y][a]).length;
console.log("Yillar:", Object.keys(key).join(", "));
for (const y of Object.keys(key).sort()) {
  const axbs = Object.keys(key[y]).map(Number).sort((a, b) => a - b);
  const cnt = axbs.map((a) => `${a}:${Object.keys(key[y][a]).length}`).join(" ");
  console.log(`  ${y} — axborotnoma:javob → ${cnt}`);
}
console.log("JAMI javob:", jami, "→", out);
