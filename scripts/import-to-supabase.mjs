// data/*.json savollarini + seed mock imtihonlarini Supabase'ga yuklaydi.
// Javoblar allaqachon merge-answers.mjs orqali to'ldirilgan bo'lishi kerak.
//
// Ishga tushirish:
//   node --env-file=.env.local scripts/import-to-supabase.mjs
// Talab: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (.env.local da)

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL yoki SUPABASE_SERVICE_ROLE_KEY yo'q.");
  console.error("Ishga tushiring: node --env-file=.env.local scripts/import-to-supabase.mjs");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

// ── Savollarni yuklash ──
const dir = "data";
const savollar = [];
for (const f of readdirSync(dir)) {
  if (!f.endsWith(".json")) continue;
  const parsed = JSON.parse(readFileSync(path.join(dir, f), "utf8"));
  if (Array.isArray(parsed)) savollar.push(...parsed);
}

const { count: qCount } = await sb.from("questions").select("*", { count: "exact", head: true });
if (qCount && qCount > 0) {
  console.log(`questions'da allaqachon ${qCount} ta savol bor — import o'tkazib yuborildi.`);
} else {
  const rows = savollar
    .filter((q) => q.matn && Array.isArray(q.variantlar) && q.togri)
    .map((q) => ({
      manba_kod: q.manba_kod ?? null, fan: q.fan ?? "matematika", bob: q.bob ?? null,
      mavzu: q.mavzu, qiyinchilik: q.qiyinchilik ?? null, matn: q.matn, rasm: q.rasm ?? null,
      variantlar: q.variantlar, togri: q.togri, izoh: q.izoh ?? "",
    }));
  // partiyalar bilan (5000+ savol uchun)
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await sb.from("questions").insert(rows.slice(i, i + 500));
    if (error) throw error;
  }
  console.log(`Import qilindi: ${rows.length} ta savol`);
}

// ── Seed mock imtihonlar ──
const { count: mCount } = await sb.from("mock_exams").select("*", { count: "exact", head: true });
if (mCount && mCount > 0) {
  console.log(`mock_exams'da allaqachon ${mCount} ta imtihon bor — o'tkazib yuborildi.`);
} else {
  const idlar = async (mavzu) => {
    const { data } = await sb.from("questions").select("id").eq("mavzu", mavzu).order("id");
    return (data ?? []).map((r) => r.id);
  };
  const yarat = async (nomi, tavsif, turi, daqiqa, boshlanish, tugash, qids) => {
    const { data, error } = await sb.from("mock_exams")
      .insert({ nomi, tavsif, turi, davomiylik_daqiqa: daqiqa, boshlanish_at: boshlanish, tugash_at: tugash, active: true })
      .select("id").single();
    if (error) throw error;
    const links = qids.map((qid, i) => ({ mock_id: data.id, question_id: qid, tartib: i + 1 }));
    if (links.length) { const { error: e2 } = await sb.from("mock_questions").insert(links); if (e2) throw e2; }
  };
  const now = Date.now();
  const boshl = await idlar("Boshlang'ich hisoblashlar");
  const oxir = await idlar("Oxirgi raqam");
  await yarat("Boshlang'ich hisoblashlar — Mini sinov", "Natural sonlar bo'yicha tezkor sinov", "mini", 12, null, null, boshl);
  await yarat("Oxirgi raqam — Mini sinov", "Darajalar oxirgi raqami bo'yicha sinov", "mini", 10, null, null, oxir);
  await yarat("Natural sonlar — To'liq sinov", "Barcha mavzular bo'yicha to'liq imtihon", "toliq", 30,
    new Date(now + 7 * 86400000).toISOString(), new Date(now + 37 * 86400000).toISOString(), [...boshl, ...oxir]);
  console.log("Mock imtihonlar yaratildi: 3");
}

console.log("Tayyor ✓");
