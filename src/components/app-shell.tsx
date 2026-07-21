"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, LogOut, LayoutDashboard, PencilLine, Target, Trophy, User,
  FileQuestion, GraduationCap, BookOpen, Users, CreditCard, BarChart3,
  Settings, type LucideIcon,
} from "lucide-react";
import { Logo } from "./logo";
import { Avatar } from "./ui/avatar";
import { type NavElement, type IconKey } from "./nav-config";
import { cn } from "@/lib/utils";

const ICONS: Record<IconKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  practice: PencilLine,
  target: Target,
  trophy: Trophy,
  user: User,
  question: FileQuestion,
  grad: GraduationCap,
  book: BookOpen,
  users: Users,
  card: CreditCard,
  chart: BarChart3,
  settings: Settings,
};

interface AppShellProps {
  nav: NavElement[];
  children: React.ReactNode;
  user: { ism: string; familiya: string; rolLabel: string; obuna?: string };
  rolBadge?: string;
}

export function AppShell({ nav, children, user, rolBadge }: AppShellProps) {
  const pathname = usePathname();
  const [ochiq, setOchiq] = React.useState(false);

  React.useEffect(() => {
    setOchiq(false);
  }, [pathname]);

  const active = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const SidebarInner = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>

      {rolBadge && (
        <div className="px-5 pb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
            {rolBadge}
          </span>
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {nav.map((item) => {
          const Icon = ICONS[item.icon];
          const on = active(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                on
                  ? "bg-primary text-white shadow-soft"
                  : "text-muted hover:bg-[#F1E9D8] hover:text-foreground"
              )}
            >
              <Icon className={cn("h-[18px] w-[18px] shrink-0", on ? "text-white" : "text-muted group-hover:text-primary")} />
              <span>{item.nomi}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <Avatar ism={`${user.ism} ${user.familiya}`} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {user.ism} {user.familiya}
            </p>
            <p className="truncate text-xs text-muted">{user.rolLabel}</p>
          </div>
          <Link href="/login" className="rounded-lg p-1.5 text-muted transition-colors hover:bg-[#F1E9D8] hover:text-danger" aria-label="Chiqish">
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
        <p className="px-3 text-[11px] font-medium text-muted/70">Versiya 1.0.0</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-card/60 backdrop-blur-sm lg:block">
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {ochiq && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-fade-in" onClick={() => setOchiq(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-border bg-card shadow-soft-lg animate-scale-in">
            <button
              onClick={() => setOchiq(false)}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-muted hover:bg-[#F1E9D8]"
              aria-label="Yopish"
            >
              <X className="h-5 w-5" />
            </button>
            {SidebarInner}
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setOchiq(true)}
            className="rounded-xl p-2 text-foreground hover:bg-[#F1E9D8]"
            aria-label="Menyu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Logo />
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">{title}</h1>
        {subtitle && <p className="text-[15px] text-muted">{subtitle}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}
