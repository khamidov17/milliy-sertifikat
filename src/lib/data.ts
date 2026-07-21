import type {
  Fan, Mavzu, Savol, Foydalanuvchi, Reyting,
  SinovImtihon, Urinish, Faoliyat, Yutuq,
} from "./types";

// ────────────────────────────────────────────────────────────────────────────
// MA'LUMOT QATLAMI (seed)
// Har bir funksiya async — kelajakda Supabase adapteri shu interfeysni to'ldiradi.
// UI faqat shu funksiyalarga bog'liq, ma'lumot manbasiga emas.
// ────────────────────────────────────────────────────────────────────────────

export const fanlar: Fan[] = [
  { id: "mat", nomi: "Matematika", slug: "matematika", emoji: "📐", rang: "#8E2C3A", savollarSoni: 2140, tavsif: "Algebra, geometriya, analiz va ehtimollik" },
  { id: "fiz", nomi: "Fizika", slug: "fizika", emoji: "⚛️", rang: "#2E5A88", savollarSoni: 1680, tavsif: "Mexanika, elektr, optika va termodinamika" },
  { id: "kim", nomi: "Kimyo", slug: "kimyo", emoji: "🧪", rang: "#2E7D32", savollarSoni: 1420, tavsif: "Anorganik, organik va analitik kimyo" },
  { id: "bio", nomi: "Biologiya", slug: "biologiya", emoji: "🧬", rang: "#6A4C93", savollarSoni: 1560, tavsif: "Botanika, zoologiya, anatomiya va genetika" },
  { id: "tar", nomi: "Tarix", slug: "tarix", emoji: "🏛️", rang: "#B45309", savollarSoni: 1290, tavsif: "O'zbekiston va jahon tarixi" },
  { id: "ona", nomi: "Ona tili", slug: "ona-tili", emoji: "📖", rang: "#C2410C", savollarSoni: 1750, tavsif: "Fonetika, morfologiya, sintaksis va imlo" },
  { id: "ing", nomi: "Ingliz tili", slug: "ingliz-tili", emoji: "🌐", rang: "#0F766E", savollarSoni: 1980, tavsif: "Grammatika, lug'at, o'qish va tinglash" },
];

const mavzularXom: Record<string, { nomi: string; soni: number; ozl: number }[]> = {
  mat: [
    { nomi: "Algebra", soni: 420, ozl: 78 },
    { nomi: "Geometriya", soni: 380, ozl: 54 },
    { nomi: "Funksiyalar", soni: 340, ozl: 61 },
    { nomi: "Ehtimollik", soni: 280, ozl: 42 },
    { nomi: "Trigonometriya", soni: 360, ozl: 47 },
    { nomi: "Analiz", soni: 360, ozl: 38 },
  ],
  fiz: [
    { nomi: "Mexanika", soni: 420, ozl: 66 },
    { nomi: "Elektr va magnetizm", soni: 360, ozl: 51 },
    { nomi: "Optika", soni: 300, ozl: 58 },
    { nomi: "Termodinamika", soni: 300, ozl: 44 },
    { nomi: "Atom fizikasi", soni: 300, ozl: 39 },
  ],
  kim: [
    { nomi: "Anorganik kimyo", soni: 380, ozl: 62 },
    { nomi: "Organik kimyo", soni: 420, ozl: 49 },
    { nomi: "Analitik kimyo", soni: 300, ozl: 55 },
    { nomi: "Fizik kimyo", soni: 320, ozl: 41 },
  ],
  bio: [
    { nomi: "Botanika", soni: 380, ozl: 71 },
    { nomi: "Zoologiya", soni: 400, ozl: 63 },
    { nomi: "Anatomiya", soni: 420, ozl: 57 },
    { nomi: "Genetika", soni: 360, ozl: 45 },
  ],
  tar: [
    { nomi: "Qadimgi dunyo", soni: 300, ozl: 68 },
    { nomi: "O'rta asrlar", soni: 320, ozl: 60 },
    { nomi: "O'zbekiston tarixi", soni: 380, ozl: 72 },
    { nomi: "Yangi va eng yangi tarix", soni: 290, ozl: 53 },
  ],
  ona: [
    { nomi: "Fonetika", soni: 380, ozl: 74 },
    { nomi: "Morfologiya", soni: 460, ozl: 66 },
    { nomi: "Sintaksis", soni: 440, ozl: 59 },
    { nomi: "Imlo va tinish belgilari", soni: 470, ozl: 63 },
  ],
  ing: [
    { nomi: "Grammar", soni: 520, ozl: 69 },
    { nomi: "Vocabulary", soni: 480, ozl: 72 },
    { nomi: "Reading", soni: 490, ozl: 64 },
    { nomi: "Listening", soni: 490, ozl: 51 },
  ],
};

export const mavzular: Mavzu[] = Object.entries(mavzularXom).flatMap(([fanId, list]) =>
  list.map((m, i) => ({
    id: `${fanId}-${i}`,
    fanId,
    nomi: m.nomi,
    slug: m.nomi.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    savollarSoni: m.soni,
    ozlashtirish: m.ozl,
  }))
);

// Namuna savollar (o'zbek tilida) — mashq pleyeri uchun.
export const savollar: Savol[] = [
  {
    id: "s1", fanId: "mat", mavzuId: "mat-0", qiyinchilik: "orta",
    matn: "Agar 3x − 7 = 2x + 5 bo'lsa, x ning qiymatini toping.",
    variantlar: [
      { belgi: "A", matn: "10" }, { belgi: "B", matn: "12" },
      { belgi: "C", matn: "−12" }, { belgi: "D", matn: "2" },
    ],
    togriJavob: "B",
    izoh: "3x − 2x = 5 + 7 → x = 12. Ikkala tomondan 2x ni ayiramiz va 7 ni o'ng tomonga o'tkazamiz.",
    teglar: ["chiziqli tenglama", "algebra"], manba: "Milliy sertifikat, 2024", holat: "chop_etilgan",
  },
  {
    id: "s2", fanId: "mat", mavzuId: "mat-1", qiyinchilik: "oson",
    matn: "To'g'ri to'rtburchakning tomonlari 6 sm va 8 sm. Uning yuzini toping.",
    variantlar: [
      { belgi: "A", matn: "14 sm²" }, { belgi: "B", matn: "28 sm²" },
      { belgi: "C", matn: "48 sm²" }, { belgi: "D", matn: "24 sm²" },
    ],
    togriJavob: "C",
    izoh: "Yuza = uzunlik × en = 6 × 8 = 48 sm².",
    teglar: ["yuza", "geometriya"], holat: "chop_etilgan",
  },
  {
    id: "s3", fanId: "mat", mavzuId: "mat-4", qiyinchilik: "qiyin",
    matn: "sin(30°) + cos(60°) ifodaning qiymatini toping.",
    variantlar: [
      { belgi: "A", matn: "1" }, { belgi: "B", matn: "0" },
      { belgi: "C", matn: "√3" }, { belgi: "D", matn: "0,5" },
    ],
    togriJavob: "A",
    izoh: "sin(30°) = 0,5 va cos(60°) = 0,5. Yig'indisi = 0,5 + 0,5 = 1.",
    teglar: ["trigonometriya", "burchaklar"], holat: "chop_etilgan",
  },
  {
    id: "s4", fanId: "fiz", mavzuId: "fiz-0", qiyinchilik: "orta",
    matn: "Tinch holatdagi jism 2 m/s² tezlanish bilan 5 soniya harakatlanadi. Uning tezligi qancha bo'ladi?",
    variantlar: [
      { belgi: "A", matn: "2,5 m/s" }, { belgi: "B", matn: "7 m/s" },
      { belgi: "C", matn: "10 m/s" }, { belgi: "D", matn: "25 m/s" },
    ],
    togriJavob: "C",
    izoh: "v = v₀ + at = 0 + 2 × 5 = 10 m/s.",
    teglar: ["kinematika", "tezlanish"], holat: "chop_etilgan",
  },
  {
    id: "s5", fanId: "kim", mavzuId: "kim-0", qiyinchilik: "oson",
    matn: "Suvning kimyoviy formulasi qaysi?",
    variantlar: [
      { belgi: "A", matn: "CO₂" }, { belgi: "B", matn: "H₂O" },
      { belgi: "C", matn: "O₂" }, { belgi: "D", matn: "NaCl" },
    ],
    togriJavob: "B",
    izoh: "Suv ikki vodorod (H) va bitta kislorod (O) atomidan iborat — H₂O.",
    teglar: ["formulalar", "birikmalar"], holat: "chop_etilgan",
  },
  {
    id: "s6", fanId: "bio", mavzuId: "bio-0", qiyinchilik: "orta",
    matn: "O'simliklarda fotosintez jarayoni asosan qaysi organoidda sodir bo'ladi?",
    variantlar: [
      { belgi: "A", matn: "Mitoxondriya" }, { belgi: "B", matn: "Yadro" },
      { belgi: "C", matn: "Xloroplast" }, { belgi: "D", matn: "Ribosoma" },
    ],
    togriJavob: "C",
    izoh: "Fotosintez xloroplastlarda, xlorofill pigmenti yordamida amalga oshadi.",
    teglar: ["hujayra", "fotosintez"], holat: "chop_etilgan",
  },
  {
    id: "s7", fanId: "tar", mavzuId: "tar-2", qiyinchilik: "orta",
    matn: "Amir Temur davlatining poytaxti qaysi shahar bo'lgan?",
    variantlar: [
      { belgi: "A", matn: "Buxoro" }, { belgi: "B", matn: "Samarqand" },
      { belgi: "C", matn: "Xiva" }, { belgi: "D", matn: "Toshkent" },
    ],
    togriJavob: "B",
    izoh: "Amir Temur (1370–1405) o'z saltanatining poytaxti qilib Samarqandni tanlagan.",
    teglar: ["temuriylar", "o'zbekiston tarixi"], holat: "chop_etilgan",
  },
  {
    id: "s8", fanId: "ona", mavzuId: "ona-1", qiyinchilik: "oson",
    matn: "\"Kitob\" so'zida nechta bo'g'in bor?",
    variantlar: [
      { belgi: "A", matn: "1" }, { belgi: "B", matn: "2" },
      { belgi: "C", matn: "3" }, { belgi: "D", matn: "4" },
    ],
    togriJavob: "B",
    izoh: "Ki-tob — ikki bo'g'indan iborat.",
    teglar: ["bo'g'in", "fonetika"], holat: "chop_etilgan",
  },
  {
    id: "s9", fanId: "ing", mavzuId: "ing-0", qiyinchilik: "orta",
    matn: "Choose the correct form: \"She ___ to school every day.\"",
    variantlar: [
      { belgi: "A", matn: "go" }, { belgi: "B", matn: "goes" },
      { belgi: "C", matn: "going" }, { belgi: "D", matn: "gone" },
    ],
    togriJavob: "B",
    izoh: "Present Simple, uchinchi shaxs birlik (she) uchun fe'lga -es qo'shiladi: goes.",
    teglar: ["grammar", "present simple"], holat: "chop_etilgan",
  },
  {
    id: "s10", fanId: "mat", mavzuId: "mat-3", qiyinchilik: "qiyin",
    matn: "Bir zarda 6 yoqli o'yin soqqasi tashlanadi. Juft son tushish ehtimoli qancha?",
    variantlar: [
      { belgi: "A", matn: "1/6" }, { belgi: "B", matn: "1/3" },
      { belgi: "C", matn: "1/2" }, { belgi: "D", matn: "2/3" },
    ],
    togriJavob: "C",
    izoh: "Juft sonlar: 2, 4, 6 — jami 3 ta. Ehtimol = 3/6 = 1/2.",
    teglar: ["ehtimollik", "klassik ta'rif"], holat: "chop_etilgan",
  },
];

export const joriyFoydalanuvchi: Foydalanuvchi = {
  id: "u1", ism: "Dilnoza", familiya: "Karimova", username: "dilnoza_k",
  email: "dilnoza@example.uz", rol: "student", daraja: 14, ballar: 12840,
  seriya: 23, region: "Toshkent", obuna: "premium",
};

export const reyting: Reyting[] = [
  { orin: 1, foydalanuvchi: { id: "r1", ism: "Javohir", familiya: "Toshev", username: "javohir_t", region: "Samarqand" }, ballar: 18420, yechilgan: 3210, ozgarish: 0 },
  { orin: 2, foydalanuvchi: { id: "r2", ism: "Malika", familiya: "Yusupova", username: "malika_y", region: "Toshkent" }, ballar: 17890, yechilgan: 3080, ozgarish: 2 },
  { orin: 3, foydalanuvchi: { id: "r3", ism: "Sardor", familiya: "Aliyev", username: "sardor_a", region: "Farg'ona" }, ballar: 16750, yechilgan: 2940, ozgarish: -1 },
  { orin: 4, foydalanuvchi: { id: "r4", ism: "Nilufar", familiya: "Rahimova", username: "nilufar_r", region: "Buxoro" }, ballar: 15200, yechilgan: 2710, ozgarish: 1 },
  { orin: 5, foydalanuvchi: { id: "u1", ism: "Dilnoza", familiya: "Karimova", username: "dilnoza_k", region: "Toshkent" }, ballar: 12840, yechilgan: 2350, ozgarish: 3 },
  { orin: 6, foydalanuvchi: { id: "r6", ism: "Bekzod", familiya: "Umarov", username: "bekzod_u", region: "Andijon" }, ballar: 12100, yechilgan: 2180, ozgarish: -2 },
  { orin: 7, foydalanuvchi: { id: "r7", ism: "Zarina", familiya: "Sobirova", username: "zarina_s", region: "Namangan" }, ballar: 11540, yechilgan: 2050, ozgarish: 0 },
  { orin: 8, foydalanuvchi: { id: "r8", ism: "Oybek", familiya: "Nazarov", username: "oybek_n", region: "Qashqadaryo" }, ballar: 10980, yechilgan: 1970, ozgarish: 4 },
  { orin: 9, foydalanuvchi: { id: "r9", ism: "Feruza", familiya: "Ergasheva", username: "feruza_e", region: "Xorazm" }, ballar: 10420, yechilgan: 1860, ozgarish: -1 },
  { orin: 10, foydalanuvchi: { id: "r10", ism: "Jasur", familiya: "Qodirov", username: "jasur_q", region: "Surxondaryo" }, ballar: 9980, yechilgan: 1790, ozgarish: 1 },
];

export const sinovImtihonlar: SinovImtihon[] = [
  { id: "m1", nomi: "Matematika — Mini sinov", turi: "mini", fan: "Matematika", savollarSoni: 15, davomiylikDaqiqa: 30, tavsif: "Qisqa formatdagi tezkor baholash", premium: false },
  { id: "m2", nomi: "Fizika — Mini sinov", turi: "mini", fan: "Fizika", savollarSoni: 15, davomiylikDaqiqa: 30, tavsif: "Asosiy mavzular bo'yicha nazorat", premium: false },
  { id: "m3", nomi: "Ona tili — Mini sinov", turi: "mini", fan: "Ona tili", savollarSoni: 15, davomiylikDaqiqa: 25, tavsif: "Imlo va grammatika sinovi", premium: false },
  { id: "f1", nomi: "Milliy sertifikat — To'liq sinov", turi: "toliq", savollarSoni: 45, davomiylikDaqiqa: 90, tavsif: "Rasmiy imtihon formatidagi to'liq simulyatsiya", premium: true },
  { id: "f2", nomi: "Blok fanlari — To'liq sinov", turi: "toliq", savollarSoni: 60, davomiylikDaqiqa: 120, tavsif: "Ixtisoslik fanlari bo'yicha to'liq imtihon", premium: true },
];

export const urinishlar: Urinish[] = [
  { id: "a1", imtihonNomi: "Matematika — Mini sinov", sana: "18-iyul, 2026", ball: 87, jami: 15, togri: 13, davomiylik: "22 daqiqa" },
  { id: "a2", imtihonNomi: "Milliy sertifikat — To'liq sinov", sana: "12-iyul, 2026", ball: 74, jami: 45, togri: 33, davomiylik: "81 daqiqa" },
  { id: "a3", imtihonNomi: "Fizika — Mini sinov", sana: "8-iyul, 2026", ball: 80, jami: 15, togri: 12, davomiylik: "27 daqiqa" },
  { id: "a4", imtihonNomi: "Ona tili — Mini sinov", sana: "3-iyul, 2026", ball: 93, jami: 15, togri: 14, davomiylik: "19 daqiqa" },
];

export const faoliyat: Faoliyat[] = [
  { id: "f1", turi: "mashq", matn: "Algebra bo'yicha 20 ta savol yechildi", vaqt: "2 soat oldin", ball: 18 },
  { id: "f2", turi: "imtihon", matn: "Matematika Mini sinovi yakunlandi", vaqt: "Kecha", ball: 87 },
  { id: "f3", turi: "yutuq", matn: "\"7 kunlik seriya\" yutug'i qo'lga kiritildi", vaqt: "2 kun oldin" },
  { id: "f4", turi: "seriya", matn: "23 kunlik mashq seriyasiga erishildi", vaqt: "Bugun" },
  { id: "f5", turi: "mashq", matn: "Geometriya bo'yicha 30 ta savol yechildi", vaqt: "3 kun oldin", ball: 24 },
];

export const yutuqlar: Yutuq[] = [
  { id: "y1", nomi: "Ilk qadam", tavsif: "Birinchi mashqni yakunlang", emoji: "🌱", qolganDaraja: true },
  { id: "y2", nomi: "7 kunlik seriya", tavsif: "Ketma-ket 7 kun mashq qiling", emoji: "🔥", qolganDaraja: true },
  { id: "y3", nomi: "Aniqlik ustasi", tavsif: "Bir sinovda 90%+ to'plang", emoji: "🎯", qolganDaraja: true },
  { id: "y4", nomi: "Marafon", tavsif: "1000 ta savol yeching", emoji: "🏃", qolganDaraja: true },
  { id: "y5", nomi: "Oltin daraja", tavsif: "Reytingda top 3 ga kiring", emoji: "🥇", qolganDaraja: false },
  { id: "y6", nomi: "Bilimdon", tavsif: "Barcha fanlardan 80%+ o'zlashtiring", emoji: "🧠", qolganDaraja: false },
];

// ── Ma'lumot qatlami aksessorlari (async — backend adapteri uchun tayyor) ──

export async function getFanlar(): Promise<Fan[]> {
  return fanlar;
}
export async function getFan(slug: string): Promise<Fan | undefined> {
  return fanlar.find((f) => f.slug === slug);
}
export async function getMavzular(fanId: string): Promise<Mavzu[]> {
  return mavzular.filter((m) => m.fanId === fanId);
}
export async function getSavollar(fanId?: string): Promise<Savol[]> {
  return fanId ? savollar.filter((s) => s.fanId === fanId) : savollar;
}
export async function getReyting(): Promise<Reyting[]> {
  return reyting;
}
export async function getJoriyFoydalanuvchi(): Promise<Foydalanuvchi> {
  return joriyFoydalanuvchi;
}

// Imtihonga qolgan kunlar (rasmiy sana namunasi)
export const IMTIHON_SANASI = new Date("2026-09-15T09:00:00");
export function imtihongachaKunlar(): number {
  const hozir = new Date("2026-07-21");
  return Math.max(0, Math.ceil((IMTIHON_SANASI.getTime() - hozir.getTime()) / 86400000));
}

export const BUGUNGI_MAQSAD = { bajarildi: 32, jami: 50 };
