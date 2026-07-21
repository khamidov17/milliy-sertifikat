import Link from "next/link";
import {
  Flame, CalendarClock, Target, ArrowRight, Trophy, TrendingDown,
  Sparkles, CheckCircle2, PlayCircle, Award, Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  joriyFoydalanuvchi, mavzular, fanlar, urinishlar, faoliyat,
  imtihongachaKunlar, BUGUNGI_MAQSAD,
} from "@/lib/data";

const faoliyatIkon = {
  mashq: Zap,
  imtihon: Target,
  yutuq: Award,
  seriya: Flame,
} as const;

export default function DashboardPage() {
  const u = joriyFoydalanuvchi;
  const kunlar = imtihongachaKunlar();
  const oxirgi = urinishlar[0];
  const maqsadFoiz = Math.round((BUGUNGI_MAQSAD.bajarildi / BUGUNGI_MAQSAD.jami) * 100);

  const zaifMavzular = [...mavzular]
    .sort((a, b) => a.ozlashtirish - b.ozlashtirish)
    .slice(0, 4)
    .map((m) => ({ ...m, fan: fanlar.find((f) => f.id === m.fanId)! }));

  return (
    <div className="animate-fade-in space-y-6">
      {/* Sarlavha */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-muted">Assalomu alaykum 👋</p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">
          Xush kelibsiz, {u.ism}!
        </h1>
      </div>

      {/* Yuqori qator — asosiy ko'rsatkichlar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Imtihon countdown */}
        <Card className="overflow-hidden bg-primary text-white shadow-soft-lg">
          <CardContent className="flex items-center justify-between p-5">
            <div className="space-y-1">
              <p className="flex items-center gap-1.5 text-xs font-medium text-white/70">
                <CalendarClock className="h-4 w-4" /> Imtihongacha
              </p>
              <p className="text-3xl font-bold">{kunlar} kun</p>
              <p className="text-xs text-white/70">15-sentabr, 2026</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <CalendarClock className="h-7 w-7" />
            </div>
          </CardContent>
        </Card>

        {/* Streak */}
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div className="space-y-1">
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
                <Flame className="h-4 w-4 text-warning" /> Joriy seriya
              </p>
              <p className="text-3xl font-bold text-foreground">{u.seriya} kun</p>
              <p className="text-xs text-success">Zo'r natija, davom eting!</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10">
              <Flame className="h-7 w-7 text-warning" />
            </div>
          </CardContent>
        </Card>

        {/* Today's goal */}
        <Card>
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
                <Target className="h-4 w-4 text-primary" /> Bugungi maqsad
              </p>
              <span className="text-xs font-semibold text-foreground">
                {BUGUNGI_MAQSAD.bajarildi}/{BUGUNGI_MAQSAD.jami}
              </span>
            </div>
            <Progress value={maqsadFoiz} />
            <p className="text-xs text-muted">
              Yana {BUGUNGI_MAQSAD.jami - BUGUNGI_MAQSAD.bajarildi} ta savol yeching va maqsadga eriching.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* O'rta qism */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Continue practice — katta CTA */}
        <Card className="lg:col-span-2">
          <CardContent className="flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Badge variant="accent">
                <Sparkles className="h-3 w-3" /> Tavsiya etiladi
              </Badge>
              <h3 className="text-lg font-semibold text-foreground">Mashqni davom ettiring</h3>
              <p className="max-w-md text-sm text-muted">
                Oxirgi marta <span className="font-medium text-foreground">Algebra</span> mavzusini
                mashq qilgansiz. To'xtagan joyingizdan davom eting yoki yangi mavzu tanlang.
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0">
              <Link href="/practice">
                <PlayCircle className="h-4 w-4" /> Davom ettirish
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Last mock score */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-primary" /> Oxirgi sinov natijasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-primary">{oxirgi.ball}%</span>
              <span className="mb-1 text-sm text-muted">
                {oxirgi.togri}/{oxirgi.jami} to'g'ri
              </span>
            </div>
            <Progress value={oxirgi.ball} />
            <div className="flex items-center justify-between text-xs text-muted">
              <span className="truncate">{oxirgi.imtihonNomi}</span>
            </div>
            <Button asChild variant="secondary" size="sm" className="w-full">
              <Link href="/mock-exams">Barcha urinishlar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pastki qism */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weak topics */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingDown className="h-4 w-4 text-danger" /> Zaif mavzular
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/practice">Mashq qilish</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {zaifMavzular.map((m) => (
              <div key={m.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <span>{m.fan.emoji}</span> {m.nomi}
                    <span className="text-xs font-normal text-muted">· {m.fan.nomi}</span>
                  </span>
                  <span className="text-xs font-semibold text-danger">{m.ozlashtirish}%</span>
                </div>
                <Progress
                  value={m.ozlashtirish}
                  indicatorClassName={m.ozlashtirish < 45 ? "bg-danger" : "bg-warning"}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-primary" /> So'nggi faoliyat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {faoliyat.map((f) => {
              const Icon = faoliyatIkon[f.turi];
              return (
                <div key={f.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[#F1E9D8]/60">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{f.matn}</p>
                    <p className="text-xs text-muted">{f.vaqt}</p>
                  </div>
                  {f.ball != null && (
                    <Badge variant={f.turi === "imtihon" ? "success" : "neutral"}>
                      {f.turi === "imtihon" ? `${f.ball}%` : `+${f.ball}`}
                    </Badge>
                  )}
                  {f.turi === "yutuq" && <CheckCircle2 className="h-4 w-4 text-success" />}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
