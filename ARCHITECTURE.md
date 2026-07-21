# Arxitektura va miqyoslash (100k+ bir vaqtdagi foydalanuvchi)

Bu hujjat platformani milliy miqyosga (100k+ bir vaqtda faol o'quvchi, imtihon
kunlarida pik yuklama) chidamli qilish rejasini bayon qiladi. Rostini aytganda:

> **Hozirgi `node:sqlite` faqat development uchun.** SQLite — bitta node, bitta
> yozuvchi, fayl asosidagi baza. 100k concurrent uni ko'tara olmaydi. Ishlab
> chiqarishda **PostgreSQL** ishlatiladi.

Kod buni hisobga olib yozilgan: barcha so'rovlar `src/lib/db.ts` va server
action'lar orqali o'tadi (adapter). SQLite → Postgres almashganda **UI va
biznes-logika o'zgarmaydi**, faqat drayver almashadi.

## Nega SQLite yetmaydi

- Bitta yozuvchi (global write lock) — imtihon topshirish pikida yozuvlar navbatga tushadi.
- Bitta fayl, bitta mashina — horizontal scale yo'q, replikatsiya yo'q.
- App server bilan bir joyda — stateless server'lar bo'lolmaydi.

## Ishlab chiqarish topologiyasi

```
                       ┌── CDN (statik + rasm/KaTeX assets, keshlangan) ──┐
   Foydalanuvchi ──► LB / Edge ──► Next.js app (N ta stateless instans, autoscale)
                                        │            │
                                        │            ├──► Redis (sessiya, reyting keshi, rate-limit)
                                        │            │
                                        └──► PgBouncer ──► PostgreSQL (primary)
                                                              │
                                                              └──► Read-replica'lar (reyting, tarix, savol o'qish)
```

### 1. Ma'lumotlar bazasi — PostgreSQL
- **Primary** yozuv uchun, **read-replica'lar** o'qish uchun (reyting, tarix, savollarni olish o'qishga og'ir).
- **PgBouncer** (transaction pooling) — 100k mijoz ↔ ~yuzlab DB ulanishi. Bu bo'lmasa Postgres ulanishlardan bo'g'iladi.
- Indekslar allaqachon kiritilgan (`src/lib/db.ts` da Postgres'ga ko'chadi):
  `attempts(user_id, created_at)`, `attempt_answers(attempt_id)`,
  `mock_questions(mock_id, tartib)`, `sessions(expires_at)`, `questions(mavzu)`.
- Yirik jadvallar (`attempts`, `attempt_answers`) vaqt bo'yicha **partition**.

### 2. App qatlami — stateless
- Next.js instans'lari holatni saqlamaydi → istalgancha ko'paytirish mumkin (K8s HPA / autoscale).
- Sessiya cookie'da token; server tomon tekshiruvi Redis'da keshlanadi (har so'rovda DB emas).

### 3. Kesh — Redis
- **Sessiya** qidiruvi (DB o'rniga), **reyting** (Top-100, 30-60s TTL), **rate-limiting** (login/submit).
- Savol banki asosan **o'zgarmas** → agressiv keshlanadi (yoki app xotirasida).

### 4. CDN va assets
- Statik build, rasm (savol diagrammalari), KaTeX shriftlari — CDN'dan.
- Savol rasmlari uchun **object storage** (S3/R2) + CDN, DB'da emas.

### 5. Imtihon-kuni pik yuklamasi
- Imtihon boshlanishi (masalan 100k o'quvchi bir daqiqada start bosadi) — eng og'ir moment.
- Yechim: savollarni **oldindan keshlash**, submit'ni **navbat**ga qo'yish imkoniyati (idempotent),
  auto-scale'ni oldindan iliqlash (pre-warm).

## Xavfsizlik (miqyosda ham)
- **Baholash serverda** — mock imtihon javoblari klientga yuborilmaydi (`mockSavollari`
  `togri`/`izoh`ni qaytarmaydi; `mockYuborish` serverda hisoblaydi). Foydalanuvchi
  devtools orqali javobni ko'ra olmaydi.
- Parollar **scrypt**, sessiya **httpOnly cookie**, RLS (Postgres Row-Level Security) rejalashtirilgan.
- Rate-limiting login/submit uchun (Redis).

## Ko'chirish qadamlari (SQLite → Postgres)
1. `src/lib/db.ts` ni `pg` (yoki Drizzle/Prisma) drayveriga o'tkazish — bir xil interfeys.
2. Sxemani Postgres'ga (SERIAL→IDENTITY, INTEGER epoch→BIGINT yoki timestamptz).
3. PgBouncer + read-replica ulash.
4. Redis (sessiya + reyting + rate-limit).
5. Object storage + CDN (rasmlar, assets).
6. Load test (k6/Gatling) — 100k virtual foydalanuvchi bilan pik simulyatsiyasi.

Muhimi: **biznes-logika va UI shu bosqichlarda o'zgarmaydi** — adapter pattern shuning uchun.
