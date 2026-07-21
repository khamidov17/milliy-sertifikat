"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Lock, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parolYangilash, type AuthHolat } from "@/lib/actions";

function Yubor() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Parolni yangilash
    </Button>
  );
}

export default function ResetPasswordPage() {
  const [holat, action] = useActionState<AuthHolat, FormData>(parolYangilash, {});

  React.useEffect(() => {
    if (holat.ok && holat.next) window.location.assign(holat.next);
  }, [holat]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Yangi parol</h1>
        <p className="text-sm text-muted">Hisobingiz uchun yangi parol o'rnating.</p>
      </div>

      <form action={action} className="space-y-4">
        {holat.xato && (
          <div className="flex items-center gap-2 rounded-xl border border-danger/20 bg-danger/8 px-3.5 py-2.5 text-sm text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" /> {holat.xato}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="parol">Yangi parol</Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input id="parol" name="parol" type="password" placeholder="Kamida 6 ta belgi" className="pl-10" required autoComplete="new-password" />
          </div>
        </div>
        <Yubor />
      </form>
    </div>
  );
}
