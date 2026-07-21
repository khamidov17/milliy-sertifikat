import { AppShell } from "@/components/app-shell";
import { studentNav } from "@/components/nav-config";
import { joriyFoydalanuvchi } from "@/lib/data";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const u = joriyFoydalanuvchi;
  return (
    <AppShell
      nav={studentNav}
      user={{
        ism: u.ism,
        familiya: u.familiya,
        rolLabel: u.obuna === "premium" ? "Premium a'zo" : "O'quvchi",
      }}
    >
      {children}
    </AppShell>
  );
}
