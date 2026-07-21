"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check, X, ChevronLeft, ChevronRight, AlarmClock, Bookmark, BookmarkCheck,
  Send, Loader2, PartyPopper, Clock, Home, RotateCcw, ClipboardList, Minus, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MathText } from "@/components/math-text";
import { mockYuborish, type MockSavol, type MockNatija } from "@/lib/actions";
import { vaqtQisqa, vaqtMatn } from "@/lib/utils";
import { cn } from "@/lib/utils";

const BELGILAR = ["A", "B", "C", "D", "E"] as const;

function Ekran({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="mx-auto min-h-full w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-10">{children}</div>
    </div>
  );
}

interface Props {
  mockId: number;
  nomi: string;
  davomiylikDaqiqa: number;
  savollar: MockSavol[];
  onChiqish: () => void;
}

export function MockRunner({ mockId, nomi, davomiylikDaqiqa, savollar, onChiqish }: Props) {
  const [indeks, setIndeks] = React.useState(0);
  const [javoblar, setJavoblar] = React.useState<Record<number, string>>({});
  const [flags, setFlags] = React.useState<Set<number>>(new Set());
  const [sekund, setSekund] = React.useState(0);
  const [yuborilmoqda, setYuborilmoqda] = React.useState(false);
  const [natija, setNatija] = React.useState<MockNatija | null>(null);
  const [tasdiq, setTasdiq] = React.useState(false); // yakunlashni tasdiqlash

  const vaqtlar = React.useRef<Record<number, number>>({});
  const qStart = React.useRef(0);
  const yuborildi = React.useRef(false);

  const limit = davomiylikDaqiqa * 60;
  const qolgan = Math.max(0, limit - sekund);
  const savol = savollar[indeks];
  const berilganSoni = Object.keys(javoblar).length;

  React.useEffect(() => {
    if (natija) return;
    const t = setInterval(() => setSekund((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [natija]);

  React.useEffect(() => {
    if (qolgan === 0 && !natija && !yuborildi.current) yubor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qolgan]);

  function flush() {
    const qid = savollar[indeks].id;
    vaqtlar.current[qid] = (vaqtlar.current[qid] ?? 0) + (sekund - qStart.current);
    qStart.current = sekund;
  }

  function borish(i: number) {
    if (i === indeks || i < 0 || i >= savollar.length) return;
    flush();
    setIndeks(i);
  }

  function belgila(belgi: string) {
    setJavoblar((p) => ({ ...p, [savol.id]: belgi }));
  }

  function flag() {
    setFlags((p) => {
      const n = new Set(p);
      n.has(savol.id) ? n.delete(savol.id) : n.add(savol.id);
      return n;
    });
  }

  async function yubor() {
    if (yuborildi.current) return;
    yuborildi.current = true;
    flush();
    setYuborilmoqda(true);
    const payload = savollar.map((s) => ({
      question_id: s.id,
      tanlangan: javoblar[s.id] ?? null,
      sekund: vaqtlar.current[s.id] ?? 0,
    }));
    const r = await mockYuborish({ mockId, javoblar: payload, davomiylik: sekund });
    setYuborilmoqda(false);
    if ("xato" in r) {
      yuborildi.current = false;
      alert(r.xato);
      return;
    }
    setNatija(r);
  }

  // ── NATIJA + TAHLIL ──
  if (natija) {
    const javobsiz = natija.natijalar.filter((n) => n.tanlangan == null).length;
    return (
      <Ekran>
        <div className="mx-auto mb-8 max-w-lg animate-scale-in text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <PartyPopper className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Imtihon yakunlandi!</h2>
          <p className="mt-2 text-muted">{nomi}</p>
          <Card className="mt-6 text-left">
            <CardContent className="grid grid-cols-3 divide-x divide-border p-0">
              <div className="p-5 text-center"><p className="text-3xl font-bold text-primary">{natija.ball}%</p><p className="mt-1 text-xs text-muted">Natija</p></div>
              <div className="p-5 text-center"><p className="text-3xl font-bold text-success">{natija.togri}</p><p className="mt-1 text-xs text-muted">To'g'ri</p></div>
              <div className="p-5 text-center"><p className="text-3xl font-bold text-danger">{natija.jami - natija.togri - javobsiz}</p><p className="mt-1 text-xs text-muted">Xato</p></div>
            </CardContent>
          </Card>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted">
            <Clock className="h-4 w-4" /> {vaqtMatn(natija.davomiylik)}
          </div>
          <div className="mt-2 flex items-center justify-center gap-2 text-xs font-medium text-muted">
            <ClipboardList className="h-4 w-4" /> Quyida har bir savol tahlili
          </div>
        </div>

        <div className="space-y-4">
          {natija.natijalar.map((n, i) => {
            const holat = n.tanlangan == null ? "javobsiz" : n.togri ? "togri" : "xato";
            return (
              <Card key={n.question_id}>
                <CardContent className="space-y-4 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-muted">Savol {i + 1}{n.manba_kod ? ` · DTM ${n.manba_kod}` : ""}</span>
                    {holat === "togri" && <Badge variant="success"><Check className="h-3 w-3" /> To'g'ri</Badge>}
                    {holat === "xato" && <Badge variant="danger"><X className="h-3 w-3" /> Xato</Badge>}
                    {holat === "javobsiz" && <Badge variant="neutral"><Minus className="h-3 w-3" /> Javobsiz</Badge>}
                  </div>
                  <div className="text-[15px] font-medium leading-relaxed text-foreground"><MathText>{n.matn}</MathText></div>
                  <div className="space-y-2">
                    {n.variantlar.map((matn, vi) => {
                      const belgi = BELGILAR[vi];
                      const togriMi = belgi === n.togriJavob;
                      const tanladi = n.tanlangan === belgi;
                      return (
                        <div key={belgi} className={cn(
                          "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm",
                          togriMi && "border-success bg-success/8",
                          tanladi && !togriMi && "border-danger bg-danger/8",
                          !togriMi && !tanladi && "border-border",
                        )}>
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
                  {n.izoh && <div className="rounded-lg border border-border bg-[#FBF6EC] p-3 text-sm text-muted"><MathText>{n.izoh}</MathText></div>}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button onClick={onChiqish} variant="secondary" size="lg" className="flex-1"><RotateCcw className="h-4 w-4" /> Imtihonlar ro'yxati</Button>
          <Button asChild size="lg" className="flex-1"><Link href="/history"><ClipboardList className="h-4 w-4" /> Tarixim</Link></Button>
        </div>
      </Ekran>
    );
  }

  // ── IMTIHON JARAYONI ──
  const belgilangan = flags.has(savol.id);
  return (
    <Ekran>
      {/* Yuqori panel */}
      <div className="mb-5 flex items-center justify-between">
        <button onClick={onChiqish} className="flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Chiqish
        </button>
        <p className="truncate px-3 text-center text-sm font-semibold text-foreground">{nomi}</p>
        <div className={cn(
          "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold shadow-soft",
          qolgan < 60 ? "border-danger/30 bg-danger/8 text-danger" : qolgan < 180 ? "border-warning/30 bg-warning/8 text-warning" : "border-border bg-card text-foreground",
        )}>
          <AlarmClock className="h-4 w-4" /> {vaqtQisqa(qolgan)}
        </div>
      </div>

      {/* Savol */}
      <Card>
        <CardContent className="space-y-6 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">Savol {indeks + 1} / {savollar.length}</span>
            <button onClick={flag} className={cn("flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors", belgilangan ? "bg-primary/10 text-primary" : "text-muted hover:bg-[#F1E9D8]")}>
              {belgilangan ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              {belgilangan ? "Belgilangan" : "Ko'rib chiqish uchun belgilash"}
            </button>
          </div>

          <h2 className="text-lg font-semibold leading-relaxed text-foreground text-balance"><MathText>{savol.matn}</MathText></h2>

          <div className="space-y-3">
            {savol.variantlar.map((matn, i) => {
              const belgi = BELGILAR[i];
              const tanlanganMi = javoblar[savol.id] === belgi;
              return (
                <button
                  key={belgi}
                  onClick={() => belgila(belgi)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-200",
                    tanlanganMi ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-card hover:border-accent hover:bg-[#FBF6EC]",
                  )}
                >
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold", tanlanganMi ? "bg-primary text-white" : "bg-[#F1E9D8] text-muted")}>{belgi}</span>
                  <span className="flex-1"><MathText>{matn}</MathText></span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Oldingi / keyingi */}
      <div className="mt-4 flex items-center justify-between">
        <Button variant="secondary" size="default" disabled={indeks === 0} onClick={() => borish(indeks - 1)}>
          <ChevronLeft className="h-4 w-4" /> Oldingi
        </Button>
        {indeks + 1 < savollar.length ? (
          <Button size="default" onClick={() => borish(indeks + 1)}>Keyingi <ChevronRight className="h-4 w-4" /></Button>
        ) : (
          <Button size="default" onClick={() => setTasdiq(true)}>Yakunlash <Send className="h-4 w-4" /></Button>
        )}
      </div>

      {/* Navigator palitrasi (pastda) */}
      <div className="mt-8 rounded-xl border border-border bg-card p-4 shadow-soft">
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
          <span className="flex items-center gap-1.5"><span className="flex h-4 w-4 items-center justify-center rounded border border-primary text-primary"><MapPin className="h-2.5 w-2.5" /></span> Joriy</span>
          <span className="flex items-center gap-1.5"><span className="h-4 w-4 rounded bg-primary" /> Javob berilgan</span>
          <span className="flex items-center gap-1.5"><span className="h-4 w-4 rounded border-2 border-dashed border-border" /> Javobsiz</span>
          <span className="flex items-center gap-1.5"><BookmarkCheck className="h-3.5 w-3.5 text-primary" /> Belgilangan</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {savollar.map((s, i) => {
            const berilgan = javoblar[s.id] != null;
            const bayroq = flags.has(s.id);
            const cur = i === indeks;
            return (
              <button
                key={s.id}
                onClick={() => borish(i)}
                className={cn(
                  "relative flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-colors",
                  cur ? "border-2 border-primary text-primary ring-2 ring-primary/20" : berilgan ? "bg-primary text-white hover:bg-primary-hover" : "border-2 border-dashed border-border text-muted hover:border-accent",
                )}
              >
                {i + 1}
                {bayroq && <BookmarkCheck className={cn("absolute -right-1.5 -top-1.5 h-3.5 w-3.5", berilgan ? "text-accent" : "text-primary")} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Yakunlash tasdig'i */}
      {tasdiq && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-sm" onClick={() => setTasdiq(false)}>
          <Card className="w-full max-w-sm animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <CardContent className="space-y-4 p-6">
              <h3 className="text-lg font-semibold text-foreground">Imtihonni yakunlaysizmi?</h3>
              <p className="text-sm text-muted">
                {berilganSoni}/{savollar.length} savolga javob berdingiz.
                {berilganSoni < savollar.length && ` ${savollar.length - berilganSoni} ta savol javobsiz qoladi.`}
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setTasdiq(false)}>Bekor qilish</Button>
                <Button className="flex-1" disabled={yuborilmoqda} onClick={yubor}>
                  {yuborilmoqda ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Yakunlash
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Ekran>
  );
}
