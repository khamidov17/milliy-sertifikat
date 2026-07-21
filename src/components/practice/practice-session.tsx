"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check, X, ArrowRight, ChevronLeft, Flag, Clock,
  RotateCcw, Home, PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Savol } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  savollar: Savol[];
  soralganSoni: number;
  fanNomi: string;
  mavzuNomi: string;
  onQaytish: () => void;
}

export function PracticeSession({ savollar, soralganSoni, fanNomi, mavzuNomi, onQaytish }: Props) {
  // Seed savollarni takrorlab so'ralgan songacha yetkazamiz (demo).
  const royxat = React.useMemo(() => {
    const r: Savol[] = [];
    for (let i = 0; i < soralganSoni; i++) r.push(savollar[i % savollar.length]);
    return r;
  }, [savollar, soralganSoni]);

  const [indeks, setIndeks] = React.useState(0);
  const [tanlangan, setTanlangan] = React.useState<string | null>(null);
  const [tekshirildi, setTekshirildi] = React.useState(false);
  const [togriSoni, setTogriSoni] = React.useState(0);
  const [tugadi, setTugadi] = React.useState(false);
  const [sekund, setSekund] = React.useState(0);

  React.useEffect(() => {
    if (tugadi) return;
    const t = setInterval(() => setSekund((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [tugadi]);

  const savol = royxat[indeks];
  const foiz = Math.round((indeks / royxat.length) * 100);
  const vaqt = `${String(Math.floor(sekund / 60)).padStart(2, "0")}:${String(sekund % 60).padStart(2, "0")}`;

  function tekshir() {
    if (!tanlangan) return;
    setTekshirildi(true);
    if (tanlangan === savol.togriJavob) setTogriSoni((n) => n + 1);
  }

  function keyingi() {
    if (indeks + 1 >= royxat.length) {
      setTugadi(true);
      return;
    }
    setIndeks((i) => i + 1);
    setTanlangan(null);
    setTekshirildi(false);
  }

  if (tugadi) {
    const ball = Math.round((togriSoni / royxat.length) * 100);
    return (
      <div className="mx-auto max-w-lg animate-scale-in py-6 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <PartyPopper className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Mashq yakunlandi!</h2>
        <p className="mt-2 text-muted">
          {fanNomi} · {mavzuNomi}
        </p>

        <Card className="mt-8 text-left">
          <CardContent className="grid grid-cols-3 divide-x divide-border p-0">
            <div className="p-5 text-center">
              <p className="text-3xl font-bold text-primary">{ball}%</p>
              <p className="mt-1 text-xs text-muted">Natija</p>
            </div>
            <div className="p-5 text-center">
              <p className="text-3xl font-bold text-success">{togriSoni}</p>
              <p className="mt-1 text-xs text-muted">To'g'ri</p>
            </div>
            <div className="p-5 text-center">
              <p className="text-3xl font-bold text-danger">{royxat.length - togriSoni}</p>
              <p className="mt-1 text-xs text-muted">Xato</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted">
          <Clock className="h-4 w-4" /> Sarflangan vaqt: {vaqt}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={onQaytish} variant="secondary" size="lg" className="flex-1">
            <RotateCcw className="h-4 w-4" /> Yana mashq qilish
          </Button>
          <Button asChild size="lg" className="flex-1">
            <Link href="/dashboard">
              <Home className="h-4 w-4" /> Boshqaruv paneli
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      {/* Yuqori panel */}
      <div className="mb-6 flex items-center justify-between">
        <button onClick={onQaytish} className="flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Chiqish
        </button>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground shadow-soft">
          <Clock className="h-4 w-4 text-muted" /> {vaqt}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-muted">
          <span>Savol {indeks + 1} / {royxat.length}</span>
          <span>{fanNomi} · {mavzuNomi}</span>
        </div>
        <Progress value={foiz} />
      </div>

      {/* Savol kartasi */}
      <Card>
        <CardContent className="space-y-6 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Badge variant={savol.qiyinchilik === "qiyin" ? "danger" : savol.qiyinchilik === "orta" ? "warning" : "success"}>
              {savol.qiyinchilik === "oson" ? "Oson" : savol.qiyinchilik === "orta" ? "O'rta" : "Qiyin"}
            </Badge>
          </div>

          <h2 className="text-lg font-semibold leading-relaxed text-foreground text-balance">
            {savol.matn}
          </h2>

          <div className="space-y-3">
            {savol.variantlar.map((v) => {
              const tanlanganMi = tanlangan === v.belgi;
              const togriMi = v.belgi === savol.togriJavob;
              const holat = tekshirildi
                ? togriMi
                  ? "togri"
                  : tanlanganMi
                    ? "xato"
                    : "odatiy"
                : tanlanganMi
                  ? "tanlangan"
                  : "odatiy";

              return (
                <button
                  key={v.belgi}
                  disabled={tekshirildi}
                  onClick={() => setTanlangan(v.belgi)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-200",
                    holat === "odatiy" && "border-border bg-card hover:border-accent hover:bg-[#FBF6EC]",
                    holat === "tanlangan" && "border-primary bg-primary/5 ring-1 ring-primary/20",
                    holat === "togri" && "border-success bg-success/8 text-success",
                    holat === "xato" && "border-danger bg-danger/8 text-danger",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                      holat === "odatiy" && "bg-[#F1E9D8] text-muted",
                      holat === "tanlangan" && "bg-primary text-white",
                      holat === "togri" && "bg-success text-white",
                      holat === "xato" && "bg-danger text-white",
                    )}
                  >
                    {holat === "togri" ? <Check className="h-4 w-4" /> : holat === "xato" ? <X className="h-4 w-4" /> : v.belgi}
                  </span>
                  <span className="flex-1">{v.matn}</span>
                </button>
              );
            })}
          </div>

          {/* Izoh */}
          {tekshirildi && (
            <div className="animate-fade-in rounded-xl border border-border bg-[#FBF6EC] p-4">
              <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <Flag className="h-4 w-4 text-primary" /> Izoh
              </p>
              <p className="text-sm leading-relaxed text-muted">{savol.izoh}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Amallar */}
      <div className="mt-6 flex justify-end">
        {!tekshirildi ? (
          <Button size="lg" onClick={tekshir} disabled={!tanlangan}>
            Javobni tekshirish
          </Button>
        ) : (
          <Button size="lg" onClick={keyingi}>
            {indeks + 1 >= royxat.length ? "Yakunlash" : "Keyingi savol"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
