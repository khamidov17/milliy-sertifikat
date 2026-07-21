"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { User, Lock, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TelegramButton } from "@/components/telegram-button";
import { kirish, type AuthHolat } from "@/lib/actions";

function Yuborish() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Kirish
    </Button>
  );
}

export default function LoginPage() {
  const [holat, action] = useActionState<AuthHolat, FormData>(kirish, {});

  React.useEffect(() => {
    // Hard navigatsiya — yangi sessiya cookie'sini kafolatli yuboradi.
    if (holat.ok && holat.next) window.location.assign(holat.next);
  }, [holat]);

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

      <form action={action} className="space-y-4">
        {holat.xato && (
          <div className="flex items-center gap-2 rounded-xl border border-danger/20 bg-danger/8 px-3.5 py-2.5 text-sm text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" /> {holat.xato}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="idf">Foydalanuvchi nomi yoki email</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input id="idf" name="idf" placeholder="dilnoza" className="pl-10" required autoComplete="username" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="parol">Parol</Label>
            <Link href="#" className="text-xs font-medium text-primary hover:text-primary-hover">Parolni unutdingizmi?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input id="parol" name="parol" type="password" placeholder="••••••••" className="pl-10" required autoComplete="current-password" />
          </div>
        </div>

        <Yuborish />
      </form>

      <div className="rounded-xl border border-border bg-[#FBF6EC] px-4 py-3 text-xs text-muted">
        <p className="mb-1 font-semibold text-foreground">Demo hisoblar</p>
        <p>O'quvchi: <span className="font-medium text-foreground">dilnoza / parol123</span></p>
        <p>Admin: <span className="font-medium text-foreground">admin / parol123</span></p>
      </div>

      <p className="text-center text-sm text-muted">
        Hisobingiz yo'qmi?{" "}
        <Link href="/register" className="font-semibold text-primary hover:text-primary-hover">Ro'yxatdan o'ting</Link>
      </p>
    </div>
  );
}
