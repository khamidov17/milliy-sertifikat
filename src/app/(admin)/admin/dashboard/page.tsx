import Link from "next/link";
import {
  Users, FileQuestion, Target, CreditCard, TrendingUp, ArrowUpRight,
  Plus, GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { fanlar, reyting } from "@/lib/data";

const kpi = [
  { nomi: "Faol o'quvchilar", qiymat: "8 420", ozg: "+12%", icon: Users, rang: "text-primary", bg: "bg-primary/8" },
  { nomi: "Jami savollar", qiymat: "11 820", ozg: "+340", icon: FileQuestion, rang: "text-success", bg: "bg-success/10" },
  { nomi: "Sinov imtihonlari", qiymat: "48", ozg: "+3", icon: Target, rang: "text-warning", bg: "bg-warning/10" },
  { nomi: "Oylik daromad", qiymat: "42.6M so'm", ozg: "+8%", icon: CreditCard, rang: "text-primary", bg: "bg-primary/8" },
];

const songgiSavollar = [
  { id: "q1", matn: "Kvadrat tenglamaning diskriminanti...", fan: "Matematika", holat: "chop_etilgan", muallif: "N. Rahimova" },
  { id: "q2", matn: "Nyutonning ikkinchi qonuni...", fan: "Fizika", holat: "qoralama", muallif: "S. Aliyev" },
  { id: "q3", matn: "Fotosintez reaksiyasi mahsulotlari...", fan: "Biologiya", holat: "chop_etilgan", muallif: "M. Yusupova" },
  { id: "q4", matn: "Amir Temur davlati poytaxti...", fan: "Tarix", holat: "tekshiruvda", muallif: "J. Toshev" },
];

export default function AdminDashboard() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">Boshqaruv paneli</h1>
          <p className="text-[15px] text-muted">Platforma holati va asosiy ko'rsatkichlar.</p>
        </div>
        <Button asChild>
          <Link href="/admin/questions/new"><Plus className="h-4 w-4" /> Yangi savol</Link>
        </Button>
      </div>

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpi.map((k) => (
          <Card key={k.nomi}>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${k.bg} ${k.rang}`}>
                  <k.icon className="h-5 w-5" />
                </div>
                <Badge variant="success"><TrendingUp className="h-3 w-3" /> {k.ozg}</Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{k.qiymat}</p>
                <p className="text-xs text-muted">{k.nomi}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* So'nggi savollar */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-sm"><FileQuestion className="h-4 w-4 text-primary" /> So'nggi savollar</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link href="/admin/questions">Barchasi <ArrowUpRight className="h-3.5 w-3.5" /></Link></Button>
          </CardHeader>
          <CardContent className="divide-y divide-border p-0">
            {songgiSavollar.map((q) => (
              <div key={q.id} className="flex items-center gap-3 px-6 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <FileQuestion className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{q.matn}</p>
                  <p className="text-xs text-muted">{q.fan} · {q.muallif}</p>
                </div>
                <Badge variant={q.holat === "chop_etilgan" ? "success" : q.holat === "qoralama" ? "neutral" : "warning"}>
                  {q.holat === "chop_etilgan" ? "Chop etilgan" : q.holat === "qoralama" ? "Qoralama" : "Tekshiruvda"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Fanlar bo'yicha taqsimot */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Fanlar bo'yicha savollar</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {fanlar.slice(0, 5).map((f) => {
              const foiz = Math.round((f.savollarSoni / 2200) * 100);
              return (
                <div key={f.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-foreground">{f.emoji} {f.nomi}</span>
                    <span className="text-xs text-muted">{f.savollarSoni.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#EFE6D3]">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${foiz}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Eng faol o'quvchilar */}
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2 text-sm"><GraduationCap className="h-4 w-4 text-primary" /> Eng faol o'quvchilar</CardTitle>
          <Button asChild variant="ghost" size="sm"><Link href="/admin/students">Barchasi</Link></Button>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reyting.slice(0, 6).map((r) => (
            <div key={r.foydalanuvchi.id} className="flex items-center gap-3 rounded-xl border border-border bg-[#FBF6EC] px-3 py-2.5">
              <Avatar ism={`${r.foydalanuvchi.ism} ${r.foydalanuvchi.familiya}`} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{r.foydalanuvchi.ism} {r.foydalanuvchi.familiya}</p>
                <p className="text-xs text-muted">{r.foydalanuvchi.region}</p>
              </div>
              <span className="text-sm font-bold text-primary">#{r.orin}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
