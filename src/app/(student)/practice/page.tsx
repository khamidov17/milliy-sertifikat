"use client";

import * as React from "react";
import {
  ChevronLeft, Check, Play, Gauge, ListChecks, BookOpen,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PracticeSession } from "@/components/practice/practice-session";
import { fanlar, mavzular, savollar as barchaSavollar } from "@/lib/data";
import type { Qiyinchilik } from "@/lib/types";
import { cn } from "@/lib/utils";

const qadamlar = ["Fan", "Mavzu", "Qiyinchilik", "Savollar soni"];

const qiyinchiliklar: { qiy: Qiyinchilik; nomi: string; tavsif: string; rang: string }[] = [
  { qiy: "oson", nomi: "Oson", tavsif: "Asosiy tushunchalar", rang: "text-success" },
  { qiy: "orta", nomi: "O'rta", tavsif: "Standart daraja", rang: "text-warning" },
  { qiy: "qiyin", nomi: "Qiyin", tavsif: "Murakkab masalalar", rang: "text-danger" },
  { qiy: "aralash", nomi: "Aralash", tavsif: "Barcha darajalar", rang: "text-primary" },
];

const sonlar = [10, 20, 30, 50];

export default function PracticePage() {
  const [qadam, setQadam] = React.useState(0);
  const [fanId, setFanId] = React.useState<string | null>(null);
  const [mavzuId, setMavzuId] = React.useState<string | null>(null);
  const [qiyinchilik, setQiyinchilik] = React.useState<Qiyinchilik | null>(null);
  const [soni, setSoni] = React.useState<number | null>(null);
  const [boshlandi, setBoshlandi] = React.useState(false);

  const fan = fanlar.find((f) => f.id === fanId);
  const mavzu = mavzular.find((m) => m.id === mavzuId);
  const fanMavzular = mavzular.filter((m) => m.fanId === fanId);

  function reset() {
    setBoshlandi(false);
    setQadam(0);
    setFanId(null);
    setMavzuId(null);
    setQiyinchilik(null);
    setSoni(null);
  }

  if (boshlandi && fan && mavzu && soni) {
    const savollar = barchaSavollar.filter((s) => s.fanId === fanId);
    return (
      <PracticeSession
        savollar={savollar.length ? savollar : barchaSavollar}
        soralganSoni={soni}
        fanNomi={fan.nomi}
        mavzuNomi={mavzu.nomi}
        onQaytish={reset}
      />
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">Mashq</h1>
        <p className="text-[15px] text-muted">Fan, mavzu va darajani tanlang — biz mos savollarni tayyorlaymiz.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {qadamlar.map((q, i) => (
          <React.Fragment key={q}>
            <button
              onClick={() => i < qadam && setQadam(i)}
              disabled={i > qadam}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
                i === qadam && "bg-primary text-white shadow-soft",
                i < qadam && "bg-primary/10 text-primary hover:bg-primary/15",
                i > qadam && "bg-[#F1E9D8] text-muted",
              )}
            >
              <span className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold",
                i === qadam ? "bg-white/20" : i < qadam ? "bg-primary/15" : "bg-white/50",
              )}>
                {i < qadam ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              {q}
            </button>
            {i < qadamlar.length - 1 && <div className="h-px w-4 shrink-0 bg-border" />}
          </React.Fragment>
        ))}
      </div>

      {/* Qadam mazmuni */}
      <div className="min-h-[280px]">
        {/* 1. Fan */}
        {qadam === 0 && (
          <div className="grid animate-fade-in gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fanlar.map((f) => (
              <button
                key={f.id}
                onClick={() => { setFanId(f.id); setMavzuId(null); setQadam(1); }}
                className="group text-left"
              >
                <Card className={cn(
                  "h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg",
                  fanId === f.id && "ring-2 ring-primary",
                )}>
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1E9D8] text-2xl">
                        {f.emoji}
                      </span>
                      <Badge variant="neutral">{f.savollarSoni.toLocaleString()} savol</Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{f.nomi}</h3>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted">{f.tavsif}</p>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        )}

        {/* 2. Mavzu */}
        {qadam === 1 && (
          <div className="grid animate-fade-in gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fanMavzular.map((m) => (
              <button
                key={m.id}
                onClick={() => { setMavzuId(m.id); setQadam(2); }}
                className="group text-left"
              >
                <Card className={cn(
                  "h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg",
                  mavzuId === m.id && "ring-2 ring-primary",
                )}>
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary">
                        <BookOpen className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-medium text-muted">{m.savollarSoni} savol</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{m.nomi}</h3>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EFE6D3]">
                          <div
                            className={cn("h-full rounded-full", m.ozlashtirish < 45 ? "bg-danger" : m.ozlashtirish < 65 ? "bg-warning" : "bg-success")}
                            style={{ width: `${m.ozlashtirish}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-muted">{m.ozlashtirish}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        )}

        {/* 3. Qiyinchilik */}
        {qadam === 2 && (
          <div className="grid animate-fade-in gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {qiyinchiliklar.map((q) => (
              <button
                key={q.qiy}
                onClick={() => { setQiyinchilik(q.qiy); setQadam(3); }}
                className="group text-left"
              >
                <Card className={cn(
                  "h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg",
                  qiyinchilik === q.qiy && "ring-2 ring-primary",
                )}>
                  <CardContent className="space-y-2 p-5">
                    <Gauge className={cn("h-6 w-6", q.rang)} />
                    <h3 className="font-semibold text-foreground">{q.nomi}</h3>
                    <p className="text-xs text-muted">{q.tavsif}</p>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        )}

        {/* 4. Savollar soni */}
        {qadam === 3 && (
          <div className="grid animate-fade-in gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sonlar.map((n) => (
              <button
                key={n}
                onClick={() => setSoni(n)}
                className="group text-left"
              >
                <Card className={cn(
                  "h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg",
                  soni === n && "ring-2 ring-primary",
                )}>
                  <CardContent className="flex flex-col items-center gap-1 p-6 text-center">
                    <ListChecks className={cn("h-6 w-6", soni === n ? "text-primary" : "text-muted")} />
                    <p className="text-3xl font-bold text-foreground">{n}</p>
                    <p className="text-xs text-muted">savol</p>
                    <p className="mt-1 text-[11px] text-muted">~{Math.round(n * 1.2)} daqiqa</p>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pastki panel — tanlov xulosasi + boshlash */}
      <Card className="sticky bottom-4 border-primary/10 shadow-soft-lg">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {qadam > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setQadam((q) => q - 1)}>
                <ChevronLeft className="h-4 w-4" /> Orqaga
              </Button>
            )}
            <div className="flex flex-wrap items-center gap-1.5">
              {fan && <Badge variant="accent">{fan.emoji} {fan.nomi}</Badge>}
              {mavzu && <Badge variant="neutral">{mavzu.nomi}</Badge>}
              {qiyinchilik && <Badge variant="neutral">{qiyinchiliklar.find((q) => q.qiy === qiyinchilik)?.nomi}</Badge>}
              {soni && <Badge variant="neutral">{soni} savol</Badge>}
              {!fan && <span className="text-muted">Fan tanlashdan boshlang…</span>}
            </div>
          </div>
          <Button
            size="lg"
            className="shrink-0"
            disabled={!(fan && mavzu && qiyinchilik && soni)}
            onClick={() => setBoshlandi(true)}
          >
            <Play className="h-4 w-4" /> Mashqni boshlash
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
