import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { parolXesh } from "./hash";

// ─────────────────────────────────────────────────────────────
// Zero-dependency backend: node:sqlite (Node 22.5+ da o'rnatilgan).
// Kelajakda Postgres/Supabase ga o'tishda faqat shu qatlam almashadi.
// ─────────────────────────────────────────────────────────────

type MathSavol = {
  mavzu: string;
  qiyinchilik: "oson" | "orta" | "qiyin";
  matn: string;
  variantlar: string[]; // [A,B,C,D]
  togri: "A" | "B" | "C" | "D";
  izoh: string;
};

const g = globalThis as unknown as { __milliyDb?: DatabaseSync };

function ochish(): DatabaseSync {
  const dir = path.join(process.cwd(), ".data");
  mkdirSync(dir, { recursive: true });
  const db = new DatabaseSync(path.join(dir, "milliy.db"));
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ism TEXT NOT NULL,
      familiya TEXT NOT NULL DEFAULT '',
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      parol TEXT NOT NULL,
      rol TEXT NOT NULL DEFAULT 'student',
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fan TEXT NOT NULL DEFAULT 'matematika',
      mavzu TEXT NOT NULL,
      qiyinchilik TEXT NOT NULL,
      matn TEXT NOT NULL,
      variantlar TEXT NOT NULL,
      togri TEXT NOT NULL,
      izoh TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      rejim TEXT NOT NULL,
      mavzu TEXT,
      jami INTEGER NOT NULL,
      togri INTEGER NOT NULL,
      ball INTEGER NOT NULL,
      davomiylik INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
  seed(db);
  return db;
}

export function db(): DatabaseSync {
  if (!g.__milliyDb) g.__milliyDb = ochish();
  return g.__milliyDb;
}

function seed(d: DatabaseSync) {
  const soni = (d.prepare("SELECT COUNT(*) c FROM questions").get() as { c: number }).c;
  if (soni === 0) {
    const ins = d.prepare(
      "INSERT INTO questions (mavzu, qiyinchilik, matn, variantlar, togri, izoh) VALUES (?,?,?,?,?,?)"
    );
    for (const q of MATH_BANK) {
      ins.run(q.mavzu, q.qiyinchilik, q.matn, JSON.stringify(q.variantlar), q.togri, q.izoh);
    }
  }

  const uSoni = (d.prepare("SELECT COUNT(*) c FROM users").get() as { c: number }).c;
  if (uSoni === 0) {
    const ins = d.prepare(
      "INSERT INTO users (ism, familiya, username, email, parol, rol, created_at) VALUES (?,?,?,?,?,?,?)"
    );
    const now = Date.now();
    // Demo hisoblar (login sahifasida ko'rsatiladi)
    ins.run("Dilnoza", "Karimova", "dilnoza", "dilnoza@milliy.uz", parolXesh("parol123"), "student", now);
    ins.run("Alisher", "Rustamov", "admin", "admin@milliy.uz", parolXesh("parol123"), "admin", now);
  }
}

// ── Matematika savollar banki (o'zbek tilida) ──
const MATH_BANK: MathSavol[] = [
  // Algebra
  { mavzu: "Algebra", qiyinchilik: "oson", matn: "2x + 6 = 14 tenglamada x ni toping.", variantlar: ["3", "4", "5", "10"], togri: "B", izoh: "2x = 14 − 6 = 8, x = 4." },
  { mavzu: "Algebra", qiyinchilik: "orta", matn: "3x − 7 = 2x + 5 bo'lsa, x ni toping.", variantlar: ["10", "12", "−12", "2"], togri: "B", izoh: "3x − 2x = 5 + 7, x = 12." },
  { mavzu: "Algebra", qiyinchilik: "orta", matn: "x² − 5x + 6 = 0 tenglamaning ildizlari yig'indisi qancha?", variantlar: ["5", "6", "−5", "1"], togri: "A", izoh: "Vyet teoremasi: ildizlar yig'indisi = 5." },
  { mavzu: "Algebra", qiyinchilik: "qiyin", matn: "a + b = 7 va ab = 12 bo'lsa, a² + b² qancha?", variantlar: ["25", "37", "49", "13"], togri: "A", izoh: "a² + b² = (a+b)² − 2ab = 49 − 24 = 25." },
  // Geometriya
  { mavzu: "Geometriya", qiyinchilik: "oson", matn: "Tomonlari 6 sm va 8 sm bo'lgan to'g'ri to'rtburchak yuzi?", variantlar: ["14 sm²", "28 sm²", "48 sm²", "24 sm²"], togri: "C", izoh: "Yuza = 6 × 8 = 48 sm²." },
  { mavzu: "Geometriya", qiyinchilik: "orta", matn: "Katetlari 3 va 4 bo'lgan to'g'ri burchakli uchburchak gipotenuzasi?", variantlar: ["5", "6", "7", "25"], togri: "A", izoh: "Pifagor: √(3²+4²) = √25 = 5." },
  { mavzu: "Geometriya", qiyinchilik: "orta", matn: "Radiusi 5 sm bo'lgan doira yuzi (π ≈ 3,14)?", variantlar: ["31,4 sm²", "78,5 sm²", "15,7 sm²", "25 sm²"], togri: "B", izoh: "Yuza = πr² = 3,14 × 25 = 78,5 sm²." },
  { mavzu: "Geometriya", qiyinchilik: "qiyin", matn: "Uchburchak burchaklari 2:3:4 nisbatda. Eng katta burchak necha gradus?", variantlar: ["40°", "60°", "80°", "90°"], togri: "C", izoh: "2x+3x+4x = 180, x = 20. Eng katta = 4×20 = 80°." },
  // Funksiyalar
  { mavzu: "Funksiyalar", qiyinchilik: "oson", matn: "f(x) = 2x + 3 bo'lsa, f(4) qancha?", variantlar: ["8", "11", "14", "5"], togri: "B", izoh: "f(4) = 2×4 + 3 = 11." },
  { mavzu: "Funksiyalar", qiyinchilik: "orta", matn: "f(x) = x² − 1 bo'lsa, f(−3) qancha?", variantlar: ["8", "−8", "10", "−10"], togri: "A", izoh: "f(−3) = (−3)² − 1 = 9 − 1 = 8." },
  { mavzu: "Funksiyalar", qiyinchilik: "orta", matn: "y = 3x − 6 chiziqli funksiya OX o'qini qayerda kesadi?", variantlar: ["x = 2", "x = −2", "x = 6", "x = 0"], togri: "A", izoh: "y = 0: 3x − 6 = 0, x = 2." },
  { mavzu: "Funksiyalar", qiyinchilik: "qiyin", matn: "f(x) = x² + 2x funksiyaning eng kichik qiymati qancha?", variantlar: ["0", "−1", "1", "−2"], togri: "B", izoh: "Uchi: x = −1, f(−1) = 1 − 2 = −1." },
  // Ehtimollik
  { mavzu: "Ehtimollik", qiyinchilik: "oson", matn: "Tanga tashlanganda \"gerb\" tushish ehtimoli qancha?", variantlar: ["1", "1/2", "1/4", "0"], togri: "B", izoh: "Ikki teng imkoniyat, ehtimol = 1/2." },
  { mavzu: "Ehtimollik", qiyinchilik: "orta", matn: "6 yoqli soqqada juft son tushish ehtimoli?", variantlar: ["1/6", "1/3", "1/2", "2/3"], togri: "C", izoh: "Juft: 2,4,6 — 3 ta. 3/6 = 1/2." },
  { mavzu: "Ehtimollik", qiyinchilik: "orta", matn: "52 ta kartadan tasodifan bittasi olindi. Uning qizil bo'lish ehtimoli?", variantlar: ["1/4", "1/2", "1/13", "13/52"], togri: "B", izoh: "26 qizil karta, 26/52 = 1/2." },
  { mavzu: "Ehtimollik", qiyinchilik: "qiyin", matn: "Ikki soqqa tashlandi. Yig'indi 7 bo'lish ehtimoli?", variantlar: ["1/6", "1/12", "5/36", "1/9"], togri: "A", izoh: "7 beruvchi 6 juft bor, 6/36 = 1/6." },
  // Trigonometriya
  { mavzu: "Trigonometriya", qiyinchilik: "oson", matn: "sin(30°) qancha?", variantlar: ["0", "1/2", "√2/2", "1"], togri: "B", izoh: "sin(30°) = 0,5." },
  { mavzu: "Trigonometriya", qiyinchilik: "orta", matn: "sin(30°) + cos(60°) qancha?", variantlar: ["1", "0", "√3", "0,5"], togri: "A", izoh: "0,5 + 0,5 = 1." },
  { mavzu: "Trigonometriya", qiyinchilik: "orta", matn: "cos(0°) qiymati?", variantlar: ["0", "1", "−1", "1/2"], togri: "B", izoh: "cos(0°) = 1." },
  { mavzu: "Trigonometriya", qiyinchilik: "qiyin", matn: "tg(45°) × sin(90°) qancha?", variantlar: ["0", "1", "√2", "2"], togri: "B", izoh: "tg(45°) = 1, sin(90°) = 1, ko'paytma = 1." },
  // Analiz
  { mavzu: "Analiz", qiyinchilik: "oson", matn: "f(x) = x² hosilasi (f′) nimaga teng?", variantlar: ["x", "2x", "x²", "2"], togri: "B", izoh: "(x²)′ = 2x." },
  { mavzu: "Analiz", qiyinchilik: "orta", matn: "f(x) = 3x² + 2x hosilasini toping.", variantlar: ["6x + 2", "3x + 2", "6x", "5x"], togri: "A", izoh: "f′(x) = 6x + 2." },
  { mavzu: "Analiz", qiyinchilik: "orta", matn: "∫ 2x dx nimaga teng (o'zgarmassiz)?", variantlar: ["x²", "2x²", "x", "2"], togri: "A", izoh: "∫2x dx = x² + C." },
  { mavzu: "Analiz", qiyinchilik: "qiyin", matn: "f(x) = x³ − 3x funksiya x = 1 nuqtada o'suvchimi yoki kamayuvchimi?", variantlar: ["O'suvchi", "Kamayuvchi", "O'zgarmas", "Aniqlanmagan"], togri: "B", izoh: "f′(x)=3x²−3, f′(1)=0... f′(0.9)<0 → kamayuvchi soha." },
];
