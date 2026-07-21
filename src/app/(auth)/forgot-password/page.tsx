"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Mail, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parolTiklashSorov, type AuthHolat } from "@/lib/actions";

function Yubor() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Tiklash havolasini yuborish
    </Button>
  );
}

export default function ForgotPasswordPage() {
  const [holat, action] = useActionState<AuthHolat, FormData>(parolTiklashSorov, {});
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Parolni tiklash</h1>
        <p className="text-sm text-muted">Email manzilingizni kiriting — tiklash havolasini yuboramiz.</p>
      </div>

      <form action={action} className="space-y-4">
        {holat.xato && (
          <div className="flex items-center gap-2 rounded-xl border border-danger/20 bg-danger/8 px-3.5 py-2.5 text-sm text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" /> {holat.xato}
          </div>
        )}
        {holat.xabar && (
          <div className="flex items-center gap-2 rounded-xl border border-success/20 bg-success/8 px-3.5 py-2.5 text-sm text-success">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> {holat.xabar}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email manzil</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input id="email" name="email" type="email" placeholder="siz@example.uz" className="pl-10" required />
          </div>
        </div>
        <Yubor />
      </form>

      <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover">
        <ArrowLeft className="h-4 w-4" /> Kirishga qaytish
      </Link>
    </div>
  );
}
