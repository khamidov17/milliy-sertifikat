"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check, X, ArrowRight, ChevronLeft, Clock, RotateCcw, Home,
  PartyPopper, AlarmClock, ClipboardList, Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { urinishSaqlash, type KlientSavol } from "@/lib/actions";
import { MathText } from "@/components/math-text";
import { vaqtQisqa, vaqtMatn } from "@/lib/utils";
import { cn } from "@/lib/utils";

const BELGILAR = ["A", "B", "C", "D", "E"] as const;

// Fullscreen konteyner — sidebar ko'rinmaydi (fokus rejimi).
// Modul darajasida — har renderda qayta mount bo'lmasligi uchun.
function Ekran({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="mx-auto min-h-full w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-10">{children}</div>
    </div>
  );
}

interface Natija {
  tanlangan: string | null;
  togri: boolean;
  sekund: number;
}

interface Props {
  savollar: KlientSavol[];
  sarlavha: string;
  rejim: "mavzu" | "kurs";
  mavzu?: string;
  limitSekund?: number; // berilsa — sanab kamayuvchi taymer
  onQaytish: () => void;
}

export function PracticeSession({ savollar, sarlavha, rejim, mavzu, limitSekund, onQaytish }: Props) {
  const [indeks, setIndeks] = React.useState(0);
  const [tanlangan, setTanlangan] = React.useState<string | null>(null);
  const [tekshirildi, setTekshirildi] = React.useState(false);
  const [togriSoni, setTogriSoni] = React.useState(0);
  const [tugadi, setTugadi] = React.useState(false);
  const [korish, setKorish] = React.useState(false); // tahlil (review) rejimi
  const [sekund, setSekund] = React.useState(0);
  const [natijalar, setNatijalar] = React.useState<(Natija | null)[]>(() => savollar.map(() => null));
  const natRef = React.useRef<(Natija | null)[]>(savollar.map(() => null));
  const qStart = React.useRef(0);
  const saqlandi = React.useRef(false);

  const savol = savollar[indeks];
  const foiz = Math.round((indeks / savollar.length) * 100);
  const qolgan = limitSekund != null ? Math.max(0, limitSekund - sekund) : null;

  React.useEffect(() => {
    if (tugadi) return;
    const t = setInterval(() => setSekund((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [tugadi]);

  React.useEffect(() => {
    if (qolgan === 0 && !tugadi) yakunla();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qolgan]);

  // delta — shu savolga ketgan vaqt (soniya). Ref o'zgarishidan OLDIN hisoblab
  // beriladi, aks holda setNatijalar updateri kechroq ishlab, qStart yangilangan
  // qiymatini o'qib, 0 chiqarardi.
  function yozib(idx: number, delta: number) {
    if (natRef.current[idx]) return;
    natRef.current[idx] = { tanlangan, togri: tanlangan === savollar[idx].togri, sekund: delta };
    setNatijalar([...natRef.current]);
  }

  function yakunla() {
    yozib(indeks, sekund - qStart.current);
    setTugadi(true);
    if (!saqlandi.current) {
      saqlandi.current = true;
      const javoblar = savollar.map((s, i) => ({
        question_id: s.id,
        tanlangan: natRef.current[i]?.tanlangan ?? null,
        togri: natRef.current[i]?.togri ?? false,
        sekund: natRef.current[i]?.sekund ?? 0,
      }));
      urinishSaqlash({
        turi: rejim,
        nomi: rejim === "kurs" ? "Kurs sinovi" : mavzu ?? "Mashq",
        jami: savollar.length,
        togri: togriSoni,
        davomiylik: sekund,
        javoblar,
      });
    }
  }

  function tekshir() {
    if (!tanlangan) return;
    setTekshirildi(true);
    if (tanlangan === savol.togri) setTogriSoni((n) => n + 1);
  }

  function keyingi() {
    yozib(indeks, sekund - qStart.current);
    qStart.current = sekund;
    if (indeks + 1 >= savollar.length) return yakunla();
    setIndeks((i) => i + 1);
    setTanlangan(null);
    setTekshirildi(false);
  }

  // ── TAHLIL (review) ──
  if (korish) {
    return (
      <Ekran>
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => setKorish(false)} className="flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> Natijaga qaytish
          </button>
          <span className="text-sm font-semibold text-foreground">Tahlil</span>
        </div>

        <div className="space-y-4">
          {savollar.map((s, i) => {
            const n = natijalar[i];
            const holat = !n || n.tanlangan == null ? "javobsiz" : n.togri ? "togri" : "xato";
            return (
              <Card key={s.id}>
                <CardContent className="space-y-4 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-muted">Savol {i + 1}</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-muted"><Clock className="h-3.5 w-3.5" /> {vaqtQisqa(n?.sekund ?? 0)}</span>
                      {holat === "togri" && <Badge variant="success"><Check className="h-3 w-3" /> To'g'ri</Badge>}
                      {holat === "xato" && <Badge variant="danger"><X className="h-3 w-3" /> Xato</Badge>}
                      {holat === "javobsiz" && <Badge variant="neutral"><Minus className="h-3 w-3" /> Javobsiz</Badge>}
                    </div>
                  </div>

                  <div className="text-[15px] font-medium leading-relaxed text-foreground">
                    <MathText>{s.matn}</MathText>
                  </div>

                  <div className="space-y-2">
                    {s.variantlar.map((matn, vi) => {
                      const belgi = BELGILAR[vi];
                      const togriMi = belgi === s.togri;
                      const tanladi = n?.tanlangan === belgi;
                      return (
                        <div
                          key={belgi}
                          className={cn(
                            "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm",
                            togriMi && "border-success bg-success/8",
                            tanladi && !togriMi && "border-danger bg-danger/8",
                            !togriMi && !tanladi && "border-border",
                          )}
                        >
                          <span className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold",
                            togriMi ? "bg-success text-white" : tanladi ? "bg-danger text-white" : "bg-[#F1E9D8] text-muted",
                          )}>
                            {togriMi ? <Check className="h-3.5 w-3.5" /> : tanladi ? <X className="h-3.5 w-3.5" /> : belgi}
                          </span>
                          <span className="flex-1"><MathText>{matn}</MathText></span>
                          {tanladi && <span className="text-[11px] font-medium text-muted">Sizning javob</span>}
                        </div>
                      );
                    })}
                  </div>

                  {s.izoh && (
                    <div className="rounded-lg border border-border bg-[#FBF6EC] p-3 text-sm text-muted">
                      <MathText>{s.izoh}</MathText>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => setKorish(false)} variant="secondary" size="lg" className="flex-1">Natijaga qaytish</Button>
          <Button onClick={onQaytish} size="lg" className="flex-1"><RotateCcw className="h-4 w-4" /> Yana mashq</Button>
        </div>
      </Ekran>
    );
  }

  // ── NATIJA ──
  if (tugadi) {
    const ball = Math.round((togriSoni / savollar.length) * 100);
    const javobsiz = natijalar.filter((n) => !n || n.tanlangan == null).length;
    return (
      <Ekran>
        <div className="mx-auto max-w-lg animate-scale-in py-6 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <PartyPopper className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Yakunlandi!</h2>
          <p className="mt-2 text-muted">Matematika · {sarlavha}</p>

          <Card className="mt-8 text-left">
            <CardContent className="grid grid-cols-3 divide-x divide-border p-0">
              <div className="p-5 text-center"><p className="text-3xl font-bold text-primary">{ball}%</p><p className="mt-1 text-xs text-muted">Natija</p></div>
              <div className="p-5 text-center"><p className="text-3xl font-bold text-success">{togriSoni}</p><p className="mt-1 text-xs text-muted">To'g'ri</p></div>
              <div className="p-5 text-center"><p className="text-3xl font-bold text-danger">{savollar.length - togriSoni - javobsiz}</p><p className="mt-1 text-xs text-muted">Xato</p></div>
            </CardContent>
          </Card>

          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {vaqtMatn(sekund)}</span>
            <span>·</span>
            <span>O'rtacha {vaqtQisqa(Math.round(sekund / savollar.length))} / savol</span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={onQaytish} variant="secondary" size="lg" className="flex-1"><RotateCcw className="h-4 w-4" /> Yana mashq</Button>
            <Button onClick={() => setKorish(true)} size="lg" className="flex-1"><ClipboardList className="h-4 w-4" /> Javoblarni ko'rish</Button>
          </div>
          <Link href="/dashboard" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground">
            <Home className="h-4 w-4" /> Bosh sahifaga qaytish
          </Link>
        </div>
      </Ekran>
    );
  }

  // ── SAVOL ──
  return (
    <Ekran>
      <div className="mb-6 flex items-center justify-between">
        <button onClick={onQaytish} className="flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Chiqish
        </button>
        <div className={cn(
          "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold shadow-soft",
          qolgan != null && qolgan < 60 ? "border-danger/30 bg-danger/8 text-danger" : "border-border bg-card text-foreground",
        )}>
          {qolgan != null ? <AlarmClock className="h-4 w-4" /> : <Clock className="h-4 w-4 text-muted" />}
          {qolgan != null ? vaqtQisqa(qolgan) : vaqtQisqa(sekund)}
        </div>
      </div>

      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-muted">
          <span>Savol {indeks + 1} / {savollar.length}</span>
          <span>{sarlavha}</span>
        </div>
        <Progress value={foiz} />
      </div>

      <Card>
        <CardContent className="space-y-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {rejim === "kurs" && <Badge variant="accent">{savol.mavzu}</Badge>}
            <Badge variant={savol.qiyinchilik === "qiyin" ? "danger" : savol.qiyinchilik === "orta" ? "warning" : "success"}>
              {savol.qiyinchilik === "oson" ? "Oson" : savol.qiyinchilik === "orta" ? "O'rta" : "Qiyin"}
            </Badge>
            {savol.manba_kod && <Badge variant="outline">DTM {savol.manba_kod}</Badge>}
          </div>

          <h2 className="text-lg font-semibold leading-relaxed text-foreground text-balance">
            <MathText>{savol.matn}</MathText>
          </h2>

          <div className="space-y-3">
            {savol.variantlar.map((matn, i) => {
              const belgi = BELGILAR[i];
              const tanlanganMi = tanlangan === belgi;
              const togriMi = belgi === savol.togri;
              const holat = tekshirildi
                ? togriMi ? "togri" : tanlanganMi ? "xato" : "odatiy"
                : tanlanganMi ? "tanlangan" : "odatiy";
              return (
                <button
                  key={belgi}
                  disabled={tekshirildi}
                  onClick={() => setTanlangan(belgi)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-200",
                    holat === "odatiy" && "border-border bg-card hover:border-accent hover:bg-[#FBF6EC]",
                    holat === "tanlangan" && "border-primary bg-primary/5 ring-1 ring-primary/20",
                    holat === "togri" && "border-success bg-success/8 text-success",
                    holat === "xato" && "border-danger bg-danger/8 text-danger",
                  )}
                >
                  <span className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                    holat === "odatiy" && "bg-[#F1E9D8] text-muted",
                    holat === "tanlangan" && "bg-primary text-white",
                    holat === "togri" && "bg-success text-white",
                    holat === "xato" && "bg-danger text-white",
                  )}>
                    {holat === "togri" ? <Check className="h-4 w-4" /> : holat === "xato" ? <X className="h-4 w-4" /> : belgi}
                  </span>
                  <span className="flex-1"><MathText>{matn}</MathText></span>
                </button>
              );
            })}
          </div>

          {tekshirildi && savol.izoh && (
            <div className="animate-fade-in rounded-xl border border-border bg-[#FBF6EC] p-4">
              <p className="mb-1 text-sm font-semibold text-foreground">Izoh</p>
              <div className="text-sm leading-relaxed text-muted"><MathText>{savol.izoh}</MathText></div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Savollar navigatori — javob berilganda rangli bo'ladi */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
        {savollar.map((_, i) => {
          const berilgan = !!natijalar[i];
          const cur = i === indeks;
          return (
            <span
              key={i}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition-colors",
                cur ? "border-primary text-primary ring-2 ring-primary/30" : berilgan ? "border-primary bg-primary text-white" : "border-border text-muted",
              )}
            >
              {i + 1}
            </span>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        {!tekshirildi ? (
          <Button size="lg" onClick={tekshir} disabled={!tanlangan}>Javobni tekshirish</Button>
        ) : (
          <Button size="lg" onClick={keyingi}>
            {indeks + 1 >= savollar.length ? "Yakunlash" : "Keyingi savol"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Ekran>
  );
}
