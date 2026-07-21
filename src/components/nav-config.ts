// Nav elementlari server -> client (AppShell) chegarasidan o'tadi.
// Lucide komponentlari (funksiya) RSC chegarasidan o'tolmaydi, shuning uchun
// bu yerda faqat ikon KALITI (string) saqlanadi. AppShell uni komponentga
// aylantiradi (icon-map.tsx).

export type IconKey =
  | "dashboard" | "practice" | "target" | "trophy" | "user"
  | "question" | "grad" | "book" | "users" | "card"
  | "chart" | "settings" | "history";

export interface NavElement {
  nomi: string;
  href: string;
  icon: IconKey;
}

export const studentNav: NavElement[] = [
  { nomi: "Boshqaruv paneli", href: "/dashboard", icon: "dashboard" },
  { nomi: "Mashq", href: "/practice", icon: "practice" },
  { nomi: "Sinov imtihonlari", href: "/mock-exams", icon: "target" },
  { nomi: "Tarix", href: "/history", icon: "history" },
  { nomi: "Reyting", href: "/leaderboard", icon: "trophy" },
  { nomi: "Profil", href: "/profile", icon: "user" },
];

// Teacher — asosiy bo'limlar
export const teacherNav: NavElement[] = [
  { nomi: "Boshqaruv paneli", href: "/admin/dashboard", icon: "dashboard" },
  { nomi: "Savollar", href: "/admin/questions", icon: "question" },
  { nomi: "Sinov imtihonlari", href: "/admin/mock-exams", icon: "target" },
  { nomi: "O'quvchilar", href: "/admin/students", icon: "grad" },
  { nomi: "Profil", href: "/admin/profile", icon: "user" },
];

// Admin — teacher bo'limlari + qo'shimcha boshqaruv
export const adminNav: NavElement[] = [
  { nomi: "Boshqaruv paneli", href: "/admin/dashboard", icon: "dashboard" },
  { nomi: "Savollar", href: "/admin/questions", icon: "question" },
  { nomi: "Sinov imtihonlari", href: "/admin/mock-exams", icon: "target" },
  { nomi: "O'quvchilar", href: "/admin/students", icon: "grad" },
  { nomi: "Fanlar", href: "/admin/subjects", icon: "book" },
  { nomi: "O'qituvchilar", href: "/admin/teachers", icon: "users" },
  { nomi: "To'lovlar", href: "/admin/payments", icon: "card" },
  { nomi: "Hisobotlar", href: "/admin/reports", icon: "chart" },
  { nomi: "Sozlamalar", href: "/admin/settings", icon: "settings" },
];
