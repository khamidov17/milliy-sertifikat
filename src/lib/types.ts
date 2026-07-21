// Domain modellari — barcha ma'lumot qatlami shu tiplar ustida quriladi.
// Backend (Supabase) ulanganda faqat adapter almashtiriladi, UI o'zgarmaydi.

export type Qiyinchilik = "oson" | "orta" | "qiyin" | "aralash";

export type Rol = "student" | "teacher" | "admin";

export interface Fan {
  id: string;
  nomi: string;
  slug: string;
  emoji: string;
  rang: string; // accent uchun HEX
  savollarSoni: number;
  tavsif: string;
}

export interface Mavzu {
  id: string;
  fanId: string;
  nomi: string;
  slug: string;
  savollarSoni: number;
  ozlashtirish: number; // 0-100, o'quvchining mavzuni o'zlashtirish darajasi
}

export interface Variant {
  belgi: "A" | "B" | "C" | "D";
  matn: string;
}

export interface Savol {
  id: string;
  fanId: string;
  mavzuId: string;
  qiyinchilik: Exclude<Qiyinchilik, "aralash">;
  matn: string;
  rasmUrl?: string;
  variantlar: Variant[];
  togriJavob: "A" | "B" | "C" | "D";
  izoh: string;
  teglar: string[];
  manba?: string;
  holat: "qoralama" | "chop_etilgan";
}

export interface Foydalanuvchi {
  id: string;
  ism: string;
  familiya: string;
  username: string;
  email: string;
  avatar?: string;
  rol: Rol;
  daraja: number;
  ballar: number;
  seriya: number; // streak
  region: string;
  obuna: "bepul" | "premium" | "pro";
}

export interface Reyting {
  orin: number;
  foydalanuvchi: Pick<Foydalanuvchi, "id" | "ism" | "familiya" | "username" | "avatar" | "region">;
  ballar: number;
  yechilgan: number;
  ozgarish: number; // o'rin o'zgarishi
}

export interface SinovImtihon {
  id: string;
  nomi: string;
  turi: "mini" | "toliq";
  fan?: string;
  savollarSoni: number;
  davomiylikDaqiqa: number;
  tavsif: string;
  premium: boolean;
}

export interface Urinish {
  id: string;
  imtihonNomi: string;
  sana: string;
  ball: number; // 0-100
  jami: number;
  togri: number;
  davomiylik: string;
}

export interface Faoliyat {
  id: string;
  turi: "mashq" | "imtihon" | "yutuq" | "seriya";
  matn: string;
  vaqt: string;
  ball?: number;
}

export interface Yutuq {
  id: string;
  nomi: string;
  tavsif: string;
  emoji: string;
  qolganDaraja: boolean; // qo'lga kiritilganmi
}
