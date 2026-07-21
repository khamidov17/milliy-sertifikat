# Supabase'ga o'tish — sozlash qadamlari

Bu hujjat Supabase loyihasini yaratish va ulash bosqichlarini bayon qiladi.
Kod tomonidagi migratsiya (db.ts → Postgres, auth → Supabase Auth) siz loyihani
yaratib, kalitlarni `.env.local` ga qo'ygandan keyin amalga oshiriladi.

## Narx (qisqacha)

- Savol bazasi juda kichik (bir necha MB) — deyarli bepul.
- **Boshlash: $0–25/oy.** Pro ($25/oy) 100k MAU auth, 8 GB DB, 250 GB trafikni o'z ichiga oladi.
- Katta xarajat faqat **bir vaqtda 100k concurrent** (imtihon kuni piki) da — bu vaqtincha,
  autoscale compute + read-replica bilan hal qilinadi.
- Kerak bo'lsa, adapter tufayli keyinchalik in-region Postgres'ga o'tish — drayver almashtirish.

## 1. Loyiha yarating (~3 daqiqa)

1. https://supabase.com → **New project**.
2. Nom: `milliy-sertifikat`. Kuchli DB parol tanlang (saqlab qo'ying).
3. **Region**: O'zbekistonga eng yaqin — `Central EU (Frankfurt)` yoki `South Asia (Mumbai)`.
   (Ma'lumot rezidentligi majburiy bo'lsa — Supabase o'rniga in-region self-host kerak bo'ladi, ayting.)
4. Loyiha yaratilishini kuting (~2 daqiqa).

## 2. Sxemani yarating

1. Chap menyu → **SQL Editor** → **New query**.
2. `supabase/schema.sql` faylining butun mazmunini nusxalab, ishga tushiring (**Run**).
3. Xatosiz bajarilsa — jadvallar, indekslar, RLS va profil-trigger tayyor.

## 3. Auth provayderlarini yoqing

1. **Authentication → Providers**:
   - **Email**: yoqilgan (parol bilan). Xohlasangiz "Confirm email" ni yoqing.
   - **Google** (ixtiyoriy): OAuth client qo'shing.
   - **Telegram**: Supabase'da tayyor provayder yo'q — buni **Edge Function** orqali
     (Telegram login hash'ini serverda tekshirib, foydalanuvchini yaratamiz) keyinroq qo'shamiz.
2. **Authentication → URL Configuration**: Site URL = `http://localhost:3000` (dev),
   keyinroq ishlab chiqarish domeni qo'shiladi.

## 4. Kalitlarni oling va `.env.local` ga qo'ying

1. **Project Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` (secret) → `SUPABASE_SERVICE_ROLE_KEY`  ⚠️ maxfiy, faqat server
2. **Project Settings → Database → Connection string → "Transaction"** (Supavisor, port 6543)
   → `DATABASE_URL` (savollarni import qilish skripti uchun).
3. `.env.example` ni `.env.local` ga nusxalang va shu qiymatlarni qo'ying.

```bash
cp .env.example .env.local
# .env.local ni tahrirlang
```

## 5. Menga xabar bering

`.env.local` to'ldirilгач, menga "tayyor" deng. Men:
- `db.ts` ni Postgres (Supabase) klientiga o'tkazaman (server actions o'zgarmaydi).
- Auth'ni Supabase Auth'ga ko'chiraman (@supabase/ssr).
- Savollar + javob kalitini Supabase'ga import qilaman (import skripti).
- Hammasini uchidan-uchiga test qilaman.

**Muhim:** hozircha lokal SQLite ishlashda davom etadi — Supabase tayyor bo'lganda almashtiramiz,
shuning uchun hech narsa buzilmaydi.
