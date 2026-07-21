import Link from "next/link";
import {
  Plus, Search, Filter, FileQuestion, Pencil, Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { savollar, fanlar, mavzular } from "@/lib/data";

const qiyRang = { oson: "success", orta: "warning", qiyin: "danger" } as const;
const qiyNomi = { oson: "Oson", orta: "O'rta", qiyin: "Qiyin" } as const;

export default function QuestionsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">Savollar</h1>
          <p className="text-[15px] text-muted">Savollar bankini boshqaring — {(11820).toLocaleString()} ta savol.</p>
        </div>
        <Button asChild><Link href="/admin/questions/new"><Plus className="h-4 w-4" /> Yangi savol</Link></Button>
      </div>

      {/* Filtrlar */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input placeholder="Savol matni bo'yicha qidirish…" className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="default"><Filter className="h-4 w-4" /> Fan</Button>
            <Button variant="secondary" size="default">Qiyinchilik</Button>
            <Button variant="secondary" size="default">Holat</Button>
          </div>
        </CardContent>
      </Card>

      {/* Ro'yxat */}
      <Card>
        <CardContent className="p-0">
          {/* Sarlavha (desktop) */}
          <div className="hidden grid-cols-[1fr,120px,110px,110px,60px] gap-4 border-b border-border px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted lg:grid">
            <span>Savol</span><span>Fan</span><span>Qiyinchilik</span><span>Holat</span><span></span>
          </div>
          <div className="divide-y divide-border">
            {savollar.map((s) => {
              const fan = fanlar.find((f) => f.id === s.fanId);
              const mavzu = mavzular.find((m) => m.id === s.mavzuId);
              return (
                <div key={s.id} className="grid grid-cols-1 gap-2 px-6 py-4 transition-colors hover:bg-[#F1E9D8]/40 lg:grid-cols-[1fr,120px,110px,110px,60px] lg:items-center lg:gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary sm:flex">
                      <FileQuestion className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-medium text-foreground">{s.matn}</p>
                      <p className="text-xs text-muted">{mavzu?.nomi} · {s.teglar.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted lg:block">
                    <span className="lg:hidden text-xs text-muted">Fan:</span>{fan?.emoji} {fan?.nomi}
                  </div>
                  <div><Badge variant={qiyRang[s.qiyinchilik]}>{qiyNomi[s.qiyinchilik]}</Badge></div>
                  <div>
                    <Badge variant={s.holat === "chop_etilgan" ? "success" : "neutral"}>
                      {s.holat === "chop_etilgan" ? "Chop etilgan" : "Qoralama"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="rounded-lg p-1.5 text-muted hover:bg-[#F1E9D8] hover:text-primary" aria-label="Ko'rish"><Eye className="h-4 w-4" /></button>
                    <button className="rounded-lg p-1.5 text-muted hover:bg-[#F1E9D8] hover:text-primary" aria-label="Tahrirlash"><Pencil className="h-4 w-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
