# Milliy Sertifikat — Imtihonga tayyorgarlik platformasi

O'zbekiston **Milliy sertifikat** imtihonlariga tayyorgarlik ko'rish uchun premium
amaliyot platformasi. Bu kurs sayti emas — bu o'quvchilar **minglab savol yechadigan**,
sinov imtihonlaridan o'tadigan va o'z natijalarini kuzatadigan ekotizim.

Butun interfeys **o'zbek tilida**. Dizayn Milliy sertifikat qog'oziga ilhomlangan
iliq, premium palitrada — och rejim, aniq tipografika, yumshoq soyalar.

---

## Texnologiyalar

| Qatlam | Tanlov | Sabab |
|--------|--------|-------|
| Framework | **Next.js 15** (App Router, RSC) | Tez navigatsiya, kichik bundle, server komponentlar |
| Til | **TypeScript** | Tip xavfsizligi |
| Stil | **TailwindCSS 3** | Dizayn tokenlari, tezkor UI |
| UI | **shadcn/ui uslubidagi** primitivlar | Yengil, moslashuvchan komponentlar |
| Ikonlar | **Lucide** | Toza, minimal |

**Tezlik:** sahifalarning aksariyati server komponent sifatida statik render qilinadi
(first-load JS ~103 kB). Interaktiv oqimlargina (mashq pleyeri, savol muharriri) klient
komponent.

**Xavfsizlik va ma'lumot:** butun ma'lumot qatlami `src/lib/data.ts` dagi async
funksiyalar orqasida (adapter namunasi). Backend ulanganda faqat shu adapter
almashtiriladi — UI o'zgarmaydi. Rejalashtirilgan backend: **Supabase**
(Postgres + Row-Level Security + Auth, Telegram login bilan).

---

## Ishga tushirish

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # ishlab chiqarish uchun build
npm run start    # build qilingan versiyani ishga tushirish
```

Kirish nuqtasi `/` — demo uchun to'g'ridan-to'g'ri `/dashboard` ga yo'naltiradi.

---

## Loyiha tuzilmasi

```
src/
├─ app/
│  ├─ (auth)/            → login, register (Telegram, email, username)
│  ├─ (student)/         → dashboard, practice, mock-exams, leaderboard, profile
│  └─ (admin)/           → rol asosidagi teacher/admin panel
│     └─ admin/
│        ├─ dashboard, questions, questions/new (savol muharriri)
│        ├─ mock-exams, students, subjects, teachers
│        └─ payments, reports, settings, profile
├─ components/
│  ├─ ui/                → button, card, input, badge, progress, tabs, avatar…
│  ├─ app-shell.tsx      → responsive sidebar + mobil menyu (klient)
│  ├─ practice/          → savol pleyeri
│  └─ nav-config.ts      → rol asosidagi navigatsiya
└─ lib/
   ├─ types.ts           → domen modellari
   └─ data.ts            → o'zbek tilidagi seed kontent + async aksessorlar
```

---

## Asosiy imkoniyatlar

**O'quvchi tomoni**
- Boshqaruv paneli — imtihon countdown, seriya, bugungi maqsad, zaif mavzular, faoliyat
- Mashq oqimi — Fan → Mavzu → Qiyinchilik → Savollar soni → jonli savol pleyeri (izoh bilan)
- Sinov imtihonlari — Mini / To'liq mock, o'tgan urinishlar
- Reyting — haftalik / oylik / umumiy, podium
- Profil — obuna, yutuqlar, sozlamalar

**Teacher / Admin (yagona panel, rol asosida)**
- Savollar banki + **jonli ko'rinishli savol muharriri**
- O'quvchilar, o'qituvchilar, fanlar, to'lovlar, hisobotlar, tizim sozlamalari

---

## Dizayn palitrasi

| Rol | HEX |
|-----|-----|
| Fon | `#F8F4EA` |
| Kartalar | `#FFFDF8` |
| Asosiy | `#8E2C3A` |
| Aksent | `#D9C29C` |
| Chegara | `#E8DDC7` |
| Matn | `#2F2A26` |

Burchak radiusi `14px`, yumshoq soyalar.

---

## Yo'l xaritasi

Batafsil bosqichlar uchun [ROADMAP.md](./ROADMAP.md) ga qarang.
Ushbu sessiyada to'liq UI + ekotizim poydevori qurildi; keyingi bosqich —
Supabase backend, real auth va Telegram integratsiyasi.
