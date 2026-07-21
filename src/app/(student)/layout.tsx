import { AppShell } from "@/components/app-shell";
import { studentNav } from "@/components/nav-config";
import { foydalanuvchiTalab } from "@/lib/auth";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const u = await foydalanuvchiTalab();
  return (
    <AppShell
      nav={studentNav}
      user={{ ism: u.ism, familiya: u.familiya, rolLabel: "O'quvchi" }}
    >
      {children}
    </AppShell>
  );
}
