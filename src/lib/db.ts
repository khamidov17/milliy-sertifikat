import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { parolXesh } from "./hash";

// ─────────────────────────────────────────────────────────────
// Zero-dependency backend: node:sqlite (Node 22.5+ da o'rnatilgan).
// Savollar `data/*.json` fayllaridan yuklanadi (kontent quvuri) — PDF dan
// ajratib olingan savollar shu papkaga tushadi, kod o'zgarmaydi.
// ─────────────────────────────────────────────────────────────

interface XomSavol {
  manba_kod?: string;
  fan?: string;
  bob?: string;
  mavzu: string;
  qiyinchilik?: string;
  matn: string;
  rasm?: string | null;
  variantlar: string[]; // 4-5 ta (A-E)
  togri: string; // A-E
  izoh?: string;
}

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

// data/ papkasidagi barcha *.json savol fayllarini o'qiydi.
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
      // yaroqsiz fayl — o'tkazib yuboriladi
    }
  }
  return natija;
}

function seed(d: DatabaseSync) {
  const soni = (d.prepare("SELECT COUNT(*) c FROM questions").get() as { c: number }).c;
  if (soni === 0) {
    const savollar = xomSavollarniYukla();
    const ins = d.prepare(
      "INSERT INTO questions (manba_kod, fan, bob, mavzu, qiyinchilik, matn, rasm, variantlar, togri, izoh) VALUES (?,?,?,?,?,?,?,?,?,?)"
    );
    for (const q of savollar) {
      if (!q.matn || !Array.isArray(q.variantlar) || !q.togri) continue;
      ins.run(
        q.manba_kod ?? null,
        q.fan ?? "matematika",
        q.bob ?? null,
        q.mavzu,
        q.qiyinchilik ?? null,
        q.matn,
        q.rasm ?? null,
        JSON.stringify(q.variantlar),
        q.togri,
        q.izoh ?? ""
      );
    }
  }

  const uSoni = (d.prepare("SELECT COUNT(*) c FROM users").get() as { c: number }).c;
  if (uSoni === 0) {
    const ins = d.prepare(
      "INSERT INTO users (ism, familiya, username, email, parol, rol, created_at) VALUES (?,?,?,?,?,?,?)"
    );
    const now = Date.now();
    ins.run("Dilnoza", "Karimova", "dilnoza", "dilnoza@milliy.uz", parolXesh("parol123"), "student", now);
    ins.run("Alisher", "Rustamov", "admin", "admin@milliy.uz", parolXesh("parol123"), "admin", now);
  }
}
