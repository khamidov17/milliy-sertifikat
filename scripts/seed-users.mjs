// FAQAT DEV uchun demo foydalanuvchilar. Ishlab chiqarishda ISHGA TUSHIRMANG.
// Parollar env'dan olinadi — statik parol yo'q:
//   DEMO_STUDENT_PASSWORD=... DEMO_ADMIN_PASSWORD=... node --env-file=.env.local scripts/seed-users.mjs
//
// Prod muhitida to'xtatiladi (NODE_ENV=production).

import { createClient } from "@supabase/supabase-js";

if (process.env.NODE_ENV === "production" || process.env.ALLOW_SEED_USERS !== "1") {
  console.error("Xavfsizlik: bu skript faqat dev uchun. Ishga tushirish uchun: ALLOW_SEED_USERS=1 ... (prod'da umuman ishlatmang).");
  process.exit(1);
}

const studentPw = process.env.DEMO_STUDENT_PASSWORD;
const adminPw = process.env.DEMO_ADMIN_PASSWORD;
if (!studentPw || !adminPw || studentPw.length < 8 || adminPw.length < 8) {
  console.error("DEMO_STUDENT_PASSWORD va DEMO_ADMIN_PASSWORD (>=8 belgi) env o'zgaruvchilarini bering.");
  process.exit(1);
}

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const demolar = [
  { email: "dilnoza@milliy.uz", parol: studentPw, ism: "Dilnoza", familiya: "Karimova", username: "dilnoza", rol: "student" },
  { email: "admin@milliy.uz", parol: adminPw, ism: "Alisher", familiya: "Rustamov", username: "admin", rol: "admin" },
];

for (const d of demolar) {
  const { data, error } = await sb.auth.admin.createUser({
    email: d.email,
    password: d.parol,
    email_confirm: true,
    user_metadata: { ism: d.ism, familiya: d.familiya, username: d.username },
  });
  if (error) {
    console.log(`${d.username}: ${error.message}`);
    continue;
  }
  // rol'ni profilda o'rnatamiz (trigger profilni yaratadi)
  await sb.from("profiles").update({ rol: d.rol, username: d.username }).eq("id", data.user.id);
  console.log(`${d.username} yaratildi (${d.rol}) — ${data.user.id}`);
}
console.log("Tayyor ✓");
