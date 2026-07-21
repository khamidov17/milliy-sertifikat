"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, AtSign, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TelegramButton } from "@/components/telegram-button";
import { cn } from "@/lib/utils";

type Usul = "email" | "username";

export default function LoginPage() {
  const router = useRouter();
  const [usul, setUsul] = React.useState<Usul>("email");
  const [yuklanmoqda, setYuklanmoqda] = React.useState(false);

  function jonatish(e: React.FormEvent) {
    e.preventDefault();
    setYuklanmoqda(true);
    // Demo: backend ulanmagan, boshqaruv paneliga o'tamiz.
    setTimeout(() => router.push("/dashboard"), 700);
  }

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Xush kelibsiz</h1>
        <p className="text-sm text-muted">Hisobingizga kiring va mashqni davom ettiring.</p>
      </div>

      <TelegramButton />

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted">yoki</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Usul tanlash */}
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-card p-1">
        {(["email", "username"] as Usul[]).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setUsul(u)}
            className={cn(
              "rounded-lg py-2 text-sm font-medium transition-all duration-200",
              usul === u ? "bg-primary text-white shadow-soft" : "text-muted hover:text-foreground"
            )}
          >
            {u === "email" ? "Email" : "Foydalanuvchi nomi"}
          </button>
        ))}
      </div>

      <form onSubmit={jonatish} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="idf">{usul === "email" ? "Email manzil" : "Foydalanuvchi nomi"}</Label>
          <div className="relative">
            {usul === "email" ? (
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            ) : (
              <AtSign className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            )}
            <Input
              id="idf"
              type={usul === "email" ? "email" : "text"}
              placeholder={usul === "email" ? "siz@example.uz" : "foydalanuvchi_nomi"}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="parol">Parol</Label>
            <Link href="#" className="text-xs font-medium text-primary hover:text-primary-hover">
              Parolni unutdingizmi?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input id="parol" type="password" placeholder="••••••••" className="pl-10" required />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={yuklanmoqda}>
          {yuklanmoqda && <Loader2 className="h-4 w-4 animate-spin" />}
          Kirish
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        Hisobingiz yo'qmi?{" "}
        <Link href="/register" className="font-semibold text-primary hover:text-primary-hover">
          Ro'yxatdan o'ting
        </Link>
      </p>
    </div>
  );
}
