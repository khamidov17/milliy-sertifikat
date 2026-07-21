import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { parolXesh } from "./hash";

// ─────────────────────────────────────────────────────────────
// Ma'lumot qatlami. Hozir: node:sqlite (dev). Ishlab chiqarishda Postgres.
// Barcha so'rovlar shu qatlam orqali — adapter almashsa, UI o'zgarmaydi.
// Miqyoslash rejasi: ARCHITECTURE.md.
// ─────────────────────────────────────────────────────────────

interface XomSavol {
  manba_kod?: string;
  fan?: string;
  bob?: string;
  mavzu: string;
  qiyinchilik?: string;
  matn: string;
  rasm?: string | null;
  variantlar: string[];
  togri: string;
  izoh?: string;
}

const g = globalThis as unknown as { __milliyDb?: DatabaseSync };

function ochish(): DatabaseSync {
  const dir = path.join(process.cwd(), ".data");
  mkdirSync(dir, { recursive: true });
  const db = new DatabaseSync(path.join(dir, "milliy.db"));
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
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
      manba_kod TEXT,
      fan TEXT NOT NULL DEFAULT 'matematika',
      bob TEXT,
      mavzu TEXT NOT NULL,
      qiyinchilik TEXT,
      matn TEXT NOT NULL,
      rasm TEXT,
      variantlar TEXT NOT NULL,
      togri TEXT NOT NULL,
      izoh TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS mock_exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nomi TEXT NOT NULL,
      tavsif TEXT DEFAULT '',
      turi TEXT NOT NULL DEFAULT 'mini',
      davomiylik_daqiqa INTEGER NOT NULL,
      boshlanish_at INTEGER,
      tugash_at INTEGER,
      created_by INTEGER,
      active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS mock_questions (
      mock_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      tartib INTEGER NOT NULL,
      PRIMARY KEY (mock_id, question_id)
    );
    CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      turi TEXT NOT NULL,
      mock_id INTEGER,
      nomi TEXT,
      jami INTEGER NOT NULL,
      togri INTEGER NOT NULL,
      ball INTEGER NOT NULL,
      davomiylik INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS attempt_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attempt_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      tanlangan TEXT,
      togri INTEGER NOT NULL,
      sekund INTEGER NOT NULL DEFAULT 0
    );
    -- Miqyos uchun indekslar (100k+ foydalanuvchi)
    CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempts(user_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_answers_attempt ON attempt_answers(attempt_id);
    CREATE INDEX IF NOT EXISTS idx_mockq_mock ON mock_questions(mock_id, tartib);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_questions_mavzu ON questions(mavzu);
  `);
  seed(db);
  return db;
}

export function db(): DatabaseSync {
  if (!g.__milliyDb) g.__milliyDb = ochish();
  return g.__milliyDb;
}

function xomSavollarniYukla(): XomSavol[] {
  const dir = path.join(process.cwd(), "data");
  if (!existsSync(dir)) return [];
  const natija: XomSavol[] = [];
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".json")) continue;
    try {
      const parsed = JSON.parse(readFileSync(path.join(dir, f), "utf8"));
      if (Array.isArray(parsed)) natija.push(...parsed);
    } catch {
      /* yaroqsiz fayl */
    }
  }
  return natija;
}

function seed(d: DatabaseSync) {
  const now = Date.now();

  // Savollar
  const soni = (d.prepare("SELECT COUNT(*) c FROM questions").get() as { c: number }).c;
  if (soni === 0) {
    const ins = d.prepare(
      "INSERT INTO questions (manba_kod, fan, bob, mavzu, qiyinchilik, matn, rasm, variantlar, togri, izoh) VALUES (?,?,?,?,?,?,?,?,?,?)"
    );
    for (const q of xomSavollarniYukla()) {
      if (!q.matn || !Array.isArray(q.variantlar) || !q.togri) continue;
      ins.run(q.manba_kod ?? null, q.fan ?? "matematika", q.bob ?? null, q.mavzu, q.qiyinchilik ?? null, q.matn, q.rasm ?? null, JSON.stringify(q.variantlar), q.togri, q.izoh ?? "");
    }
  }

  // Foydalanuvchilar (demo)
  const uSoni = (d.prepare("SELECT COUNT(*) c FROM users").get() as { c: number }).c;
  if (uSoni === 0) {
    const ins = d.prepare("INSERT INTO users (ism, familiya, username, email, parol, rol, created_at) VALUES (?,?,?,?,?,?,?)");
    ins.run("Dilnoza", "Karimova", "dilnoza", "dilnoza@milliy.uz", parolXesh("parol123"), "student", now);
    ins.run("Alisher", "Rustamov", "admin", "admin@milliy.uz", parolXesh("parol123"), "admin", now);
  }

  // Sinov imtihonlari (mock) — yaratuvchi vaqt va mavjudlik oynasini belgilaydi
  const mSoni = (d.prepare("SELECT COUNT(*) c FROM mock_exams").get() as { c: number }).c;
  if (mSoni === 0) {
    const idlar = (mavzu: string) =>
      (d.prepare("SELECT id FROM questions WHERE mavzu = ? ORDER BY id").all(mavzu) as { id: number }[]).map((r) => r.id);

    const yarat = (
      nomi: string, tavsif: string, turi: string, daqiqa: number,
      boshlanish: number | null, tugash: number | null, qIdlar: number[]
    ) => {
      const info = d
        .prepare("INSERT INTO mock_exams (nomi, tavsif, turi, davomiylik_daqiqa, boshlanish_at, tugash_at, created_by, active, created_at) VALUES (?,?,?,?,?,?,?,1,?)")
        .run(nomi, tavsif, turi, daqiqa, boshlanish, tugash, 2, now);
      const mid = Number(info.lastInsertRowid);
      const link = d.prepare("INSERT INTO mock_questions (mock_id, question_id, tartib) VALUES (?,?,?)");
      qIdlar.forEach((qid, i) => link.run(mid, qid, i + 1));
    };

    yarat("Boshlang'ich hisoblashlar — Mini sinov", "Natural sonlar bo'yicha tezkor sinov", "mini", 12, null, null, idlar("Boshlang'ich hisoblashlar"));
    yarat("Oxirgi raqam — Mini sinov", "Darajalar oxirgi raqami bo'yicha sinov", "mini", 10, null, null, idlar("Oxirgi raqam"));
    // Kelgusida ochiladigan imtihon (mavjudlik oynasi namunasi)
    yarat("Natural sonlar — To'liq sinov", "Barcha mavzular bo'yicha to'liq imtihon", "toliq", 30, now + 7 * 86400000, now + 37 * 86400000, [...idlar("Boshlang'ich hisoblashlar"), ...idlar("Oxirgi raqam")]);
  }
}
