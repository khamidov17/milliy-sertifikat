"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Mail, Lock, User, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TelegramButton } from "@/components/telegram-button";
import { royxatdanOtish, type AuthHolat } from "@/lib/actions";

function Yuborish() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Ro'yxatdan o'tish
    </Button>
  );
}

export default function RegisterPage() {
  const [holat, action] = useActionState<AuthHolat, FormData>(royxatdanOtish, {});

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

      <form action={action} className="space-y-4">
        {holat.xato && (
          <div className="flex items-center gap-2 rounded-xl border border-danger/20 bg-danger/8 px-3.5 py-2.5 text-sm text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" /> {holat.xato}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="ism">Ism</Label>
            <Input id="ism" name="ism" placeholder="Dilnoza" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="familiya">Familiya</Label>
            <Input id="familiya" name="familiya" placeholder="Karimova" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Foydalanuvchi nomi</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input id="username" name="username" placeholder="dilnoza_k" className="pl-10" required autoComplete="username" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email manzil (ixtiyoriy)</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input id="email" name="email" type="email" placeholder="siz@example.uz" className="pl-10" autoComplete="email" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="parol">Parol</Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input id="parol" name="parol" type="password" placeholder="Kamida 6 ta belgi" className="pl-10" required autoComplete="new-password" />
          </div>
        </div>

        <Yuborish />
      </form>

      <p className="text-center text-sm text-muted">
        Hisobingiz bormi?{" "}
        <Link href="/login" className="font-semibold text-primary hover:text-primary-hover">Kirish</Link>
      </p>
    </div>
  );
}
