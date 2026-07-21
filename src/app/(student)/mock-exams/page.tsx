import Link from "next/link";
import {
  Target, Clock, FileText, Crown, Play, History,
  CheckCircle2, ArrowRight, Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sinovImtihonlar, urinishlar } from "@/lib/data";

export default function MockExamsPage() {
  const mini = sinovImtihonlar.filter((s) => s.turi === "mini");
  const toliq = sinovImtihonlar.filter((s) => s.turi === "toliq");
  const ortacha = Math.round(urinishlar.reduce((a, u) => a + u.ball, 0) / urinishlar.length);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">Sinov imtihonlari</h1>
        <p className="text-[15px] text-muted">Rasmiy imtihon formatidagi simulyatsiyalar bilan o'zingizni sinab ko'ring.</p>
      </div>

      {/* Xulosa ko'rsatkichlari */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary"><History className="h-5 w-5" /></div>
          <div><p className="text-2xl font-bold text-foreground">{urinishlar.length}</p><p className="text-xs text-muted">Jami urinishlar</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success"><Zap className="h-5 w-5" /></div>
          <div><p className="text-2xl font-bold text-foreground">{ortacha}%</p><p className="text-xs text-muted">O'rtacha natija</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10 text-warning"><Target className="h-5 w-5" /></div>
          <div><p className="text-2xl font-bold text-foreground">{Math.max(...urinishlar.map((u) => u.ball))}%</p><p className="text-xs text-muted">Eng yaxshi natija</p></div>
        </CardContent></Card>
      </div>

      {/* Mini Mock */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Mini sinov</h2>
          <Badge variant="neutral">Tezkor</Badge>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {mini.map((s) => (
            <Card key={s.id} className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1E9D8] text-primary"><FileText className="h-5 w-5" /></span>
                  {!s.premium && <Badge variant="success">Bepul</Badge>}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{s.nomi}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{s.tavsif}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {s.savollarSoni} savol</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {s.davomiylikDaqiqa} daqiqa</span>
                </div>
                <Button className="w-full" size="sm"><Play className="h-4 w-4" /> Imtihonni boshlash</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Full Mock */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">To'liq sinov</h2>
          <Badge variant="accent"><Crown className="h-3 w-3" /> Premium</Badge>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {toliq.map((s) => (
            <Card key={s.id} className="relative overflow-hidden transition-all duration-200 hover:shadow-soft-lg">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[60px] bg-primary/5" />
              <CardContent className="relative space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-soft"><Target className="h-6 w-6" /></span>
                  <Badge variant="accent"><Crown className="h-3 w-3" /> Premium</Badge>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{s.nomi}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{s.tavsif}</p>
                </div>
                <div className="flex items-center gap-5 text-sm text-muted">
                  <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> {s.savollarSoni} savol</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {s.davomiylikDaqiqa} daqiqa</span>
                </div>
                <Button className="w-full"><Play className="h-4 w-4" /> Imtihonni boshlash</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Past Attempts */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">O'tgan urinishlar</h2>
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {urinishlar.map((u) => (
              <Link
                key={u.id}
                href="#"
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#F1E9D8]/50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                  {u.ball >= 85 ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Target className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{u.imtihonNomi}</p>
                  <p className="text-xs text-muted">{u.sana} · {u.davomiylik} · {u.togri}/{u.jami} to'g'ri</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${u.ball >= 85 ? "text-success" : u.ball >= 60 ? "text-warning" : "text-danger"}`}>{u.ball}%</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
