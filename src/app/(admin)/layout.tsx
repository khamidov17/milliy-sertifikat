import { AppShell } from "@/components/app-shell";
import { adminNav } from "@/components/nav-config";

// Demo: admin roli bilan kiramiz. Real ilovada rol sessiyadan olinadi
// va nav (teacherNav / adminNav) shunga qarab tanlanadi.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      nav={adminNav}
      rolBadge="Administrator"
      user={{ ism: "Alisher", familiya: "Rustamov", rolLabel: "Administrator" }}
    >
      {children}
    </AppShell>
  );
}
