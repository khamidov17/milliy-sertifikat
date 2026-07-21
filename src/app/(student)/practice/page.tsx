"use client";

import * as React from "react";
import { Play, Loader2, BookOpen, Trophy, Clock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { PracticeSession } from "@/components/practice/practice-session";
import { savollarOl, type KlientSavol } from "@/lib/actions";
import { MATH_MAVZULAR, QIYINCHILIKLAR, SAVOL_SONLARI, KURS_SINOVI } from "@/lib/math";
import { cn } from "@/lib/utils";

type Rejim = "mavzu" | "kurs";

export default function PracticePage() {
  const [rejim, setRejim] = React.useState<Rejim>("mavzu");
  const [mavzu, setMavzu] = React.useState<string>(MATH_MAVZULAR[0]);
  const [qiyinchilik, setQiyinchilik] = React.useState<string>("aralash");
  const [soni, setSoni] = React.useState<number>(10);

  const [yuklanmoqda, setYuklanmoqda] = React.useState(false);
  const [savollar, setSavollar] = React.useState<KlientSavol[] | null>(null);

  async function boshla() {
    setYuklanmoqda(true);
    const params =
      rejim === "kurs"
        ? { rejim: "kurs" as const, soni: KURS_SINOVI.savollarSoni }
        : { rejim: "mavzu" as const, mavzu, qiyinchilik, soni };
    const s = await savollarOl(params);
    setSavollar(s);
    setYuklanmoqda(false);
  }

  if (savollar && savollar.length > 0) {
    return (
      <PracticeSession
        savollar={savollar}
        rejim={rejim}
        sarlavha={rejim === "kurs" ? "Kurs sinovi" : mavzu}
        mavzu={rejim === "kurs" ? undefined : mavzu}
        limitSekund={rejim === "kurs" ? KURS_SINOVI.daqiqa * 60 : undefined}
        onQaytish={() => setSavollar(null)}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-in space-y-8">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">Mashq</h1>
        <p className="text-[15px] text-muted">Mashq turini tanlang va boshlang. Hozircha — Matematika 📐</p>
      </div>

      {/* Rejim tanlash */}
      <div className="grid gap-4 sm:grid-cols-2">
        <button onClick={() => setRejim("mavzu")} className="text-left">
          <Card className={cn("h-full transition-all duration-200 hover:shadow-soft-lg", rejim === "mavzu" && "ring-2 ring-primary")}>
            <CardContent className="space-y-2 p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary"><BookOpen className="h-5 w-5" /></span>
                {rejim === "mavzu" && <Badge>Tanlangan</Badge>}
              </div>
              <h3 className="font-semibold text-foreground">Mavzu bo'yicha mashq</h3>
              <p className="text-xs leading-relaxed text-muted">Bitta mavzuni tanlab, o'z tezligingizda mashq qiling.</p>
            </CardContent>
          </Card>
        </button>

        <button onClick={() => setRejim("kurs")} className="text-left">
          <Card className={cn("h-full transition-all duration-200 hover:shadow-soft-lg", rejim === "kurs" && "ring-2 ring-primary")}>
            <CardContent className="space-y-2 p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary"><Trophy className="h-5 w-5" /></span>
                {rejim === "kurs" ? <Badge>Tanlangan</Badge> : <Badge variant="accent"><Sparkles className="h-3 w-3" /> Yangi</Badge>}
              </div>
              <h3 className="font-semibold text-foreground">Kurs sinovi</h3>
              <p className="text-xs leading-relaxed text-muted">
                Barcha mavzulardan aralash {KURS_SINOVI.savollarSoni} savol, {KURS_SINOVI.daqiqa} daqiqa taymer bilan.
              </p>
            </CardContent>
          </Card>
        </button>
      </div>

      {/* Sozlamalar */}
      <Card>
        <CardContent className="space-y-5 p-6">
          {rejim === "mavzu" ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Mavzu</Label>
                <Select value={mavzu} onChange={(e) => setMavzu(e.target.value)}>
                  {MATH_MAVZULAR.map((m) => <option key={m} value={m}>{m}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Qiyinchilik</Label>
                <Select value={qiyinchilik} onChange={(e) => setQiyinchilik(e.target.value)}>
                  {QIYINCHILIKLAR.map((q) => <option key={q.key} value={q.key}>{q.nomi}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Savollar soni</Label>
                <Select value={soni} onChange={(e) => setSoni(Number(e.target.value))}>
                  {SAVOL_SONLARI.map((n) => <option key={n} value={n}>{n} ta</option>)}
                </Select>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-[#FBF6EC] p-4 text-sm text-muted">
              <span className="flex items-center gap-1.5 font-medium text-foreground"><Trophy className="h-4 w-4 text-primary" /> Kurs sinovi</span>
              <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {KURS_SINOVI.savollarSoni} savol</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {KURS_SINOVI.daqiqa} daqiqa</span>
              <span>· Barcha mavzular · Aralash daraja</span>
            </div>
          )}

          <Button size="lg" className="w-full" onClick={boshla} disabled={yuklanmoqda}>
            {yuklanmoqda ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {rejim === "kurs" ? "Kurs sinovini boshlash" : "Mashqni boshlash"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
