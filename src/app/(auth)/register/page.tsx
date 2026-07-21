"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, AtSign, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TelegramButton } from "@/components/telegram-button";

export default function RegisterPage() {
  const router = useRouter();
  const [yuklanmoqda, setYuklanmoqda] = React.useState(false);

  function jonatish(e: React.FormEvent) {
    e.preventDefault();
    setYuklanmoqda(true);
    setTimeout(() => router.push("/dashboard"), 800);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Hisob yarating</h1>
        <p className="text-sm text-muted">Bir necha daqiqada ro'yxatdan o'tib, mashqni boshlang.</p>
      </div>

      <TelegramButton />

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted">yoki</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={jonatish} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="ism">Ism</Label>
            <Input id="ism" placeholder="Dilnoza" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="familiya">Familiya</Label>
            <Input id="familiya" placeholder="Karimova" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Foydalanuvchi nomi</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input id="username" placeholder="dilnoza_k" className="pl-10" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email manzil</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input id="email" type="email" placeholder="siz@example.uz" className="pl-10" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="parol">Parol</Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input id="parol" type="password" placeholder="Kamida 8 ta belgi" className="pl-10" required />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={yuklanmoqda}>
          {yuklanmoqda && <Loader2 className="h-4 w-4 animate-spin" />}
          Ro'yxatdan o'tish
        </Button>

        <p className="text-center text-xs leading-relaxed text-muted">
          Ro'yxatdan o'tish orqali siz{" "}
          <Link href="#" className="text-primary hover:underline">Foydalanish shartlari</Link> va{" "}
          <Link href="#" className="text-primary hover:underline">Maxfiylik siyosati</Link>ga rozilik bildirasiz.
        </p>
      </form>

      <p className="text-center text-sm text-muted">
        Hisobingiz bormi?{" "}
        <Link href="/login" className="font-semibold text-primary hover:text-primary-hover">
          Kirish
        </Link>
      </p>
    </div>
  );
}
