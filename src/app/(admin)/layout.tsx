import { AppShell } from "@/components/app-shell";
import { adminNav } from "@/components/nav-config";
import { foydalanuvchiTalab } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const u = await foydalanuvchiTalab("admin");
  return (
    <AppShell
      nav={adminNav}
      rolBadge={u.rol === "admin" ? "Administrator" : "O'qituvchi"}
      user={{ ism: u.ism, familiya: u.familiya, rolLabel: u.rol === "admin" ? "Administrator" : "O'qituvchi" }}
    >
      {children}
    </AppShell>
  );
}
