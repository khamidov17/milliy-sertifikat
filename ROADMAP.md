# Yo'l xaritasi — Milliy Sertifikat ekotizimi

Ekotizim bosqichma-bosqich quriladi. Har bir bosqich mustaqil yetkaziladi.

## ✅ Bosqich 1 — Poydevor + to'liq UI (bajarildi)

- Next.js 15 App Router, TypeScript, Tailwind, shadcn uslubidagi UI
- Dizayn tizimi (Milliy sertifikat palitrasi), to'liq o'zbek tili
- Auth sahifalari (email / username / Telegram — UI)
- O'quvchi tomoni: dashboard, mashq oqimi + pleyer, sinov imtihonlari, reyting, profil
- Teacher/Admin panel: dashboard, savollar, savol muharriri, o'quvchilar, fanlar,
  o'qituvchilar, to'lovlar, hisobotlar, sozlamalar
- Async ma'lumot qatlami (adapter namunasi) + o'zbek seed kontent

## 🔜 Bosqich 2 — Backend & Auth (Supabase)

- Postgres sxema: `users, subjects, topics, questions, options, attempts,
  mock_exams, submissions, payments`
- Row-Level Security (RLS) — rol asosidagi xavfsiz kirish
- Supabase Auth: email/parol, username, **Telegram OAuth**
- `src/lib/data.ts` adapterini Supabase klientiga almashtirish (UI o'zgarmaydi)
- Rasm yuklash (Supabase Storage) — savol rasmlari

## 🔜 Bosqich 3 — Baholash dvigateli

- Real savol servisi (filtrlar: fan, mavzu, qiyinchilik, son)
- Urinish yozuvi, ball hisoblash, mavzu bo'yicha o'zlashtirish (mastery)
- Rasmiy formatdagi mock imtihon — taymer, avtomatik topshirish, tahlil
- Adaptiv mashq (zaif mavzularga urg'u)

## 🔜 Bosqich 4 — O'sish halqasi

- Real vaqtdagi reyting (Supabase Realtime)
- Seriya, yutuqlar, referal tizimi
- **To'lovlar:** Payme / Click / Uzcard integratsiyasi, obuna darajalari
- **Telegram bot:** kunlik eslatma, tezkor mashq, natija bildirishnomalari

## 🔮 Keyingi bosqichlar

- Turborepo monorepo ga ajratish: `apps/web`, `apps/admin`, `apps/bot`,
  `packages/ui`, `packages/db` (kod qayta yozilmaydi)
- Mobil ilova (React Native / Expo)
- AI yordamida savol generatsiyasi va sifat nazorati
- O'qituvchilar bozori (marketplace)

## Ushbu sessiyada tanlangan arxitektura qarorlari

- **Yagona Next.js ilova**, rol asosidagi route guruhlar — eng tez qurish va
  bitta deploy. Keyinchalik monorepo ga ajratish mumkin.
- **RSC birinchi** — interaktiv oqimlargina klient. Kichik bundle, tez sahifalar.
- **Adapter orqali ma'lumot qatlami** — backend'ni UI ga tegmasdan ulash uchun.
- Next.js xavfsiz (patch qilingan) versiyaga yangilandi.
