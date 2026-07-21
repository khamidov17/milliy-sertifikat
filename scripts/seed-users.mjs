// Demo foydalanuvchilarni Supabase Auth'da yaratadi (email tasdiqlangan holda).
// Ishga tushirish: node --env-file=.env.local scripts/seed-users.mjs

import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const demolar = [
  { email: "dilnoza@milliy.uz", parol: "parol123", ism: "Dilnoza", familiya: "Karimova", username: "dilnoza", rol: "student" },
  { email: "admin@milliy.uz", parol: "parol123", ism: "Alisher", familiya: "Rustamov", username: "admin", rol: "admin" },
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
