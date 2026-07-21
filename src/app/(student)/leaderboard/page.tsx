"use client";

import * as React from "react";
import { Trophy, Crown, TrendingUp, TrendingDown, Minus, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { reyting, joriyFoydalanuvchi } from "@/lib/data";
import { cn } from "@/lib/utils";

const davrlar = [
  { id: "haftalik", nomi: "Haftalik" },
  { id: "oylik", nomi: "Oylik" },
  { id: "umumiy", nomi: "Umumiy" },
];

function Ozgarish({ n }: { n: number }) {
  if (n === 0) return <span className="flex items-center gap-0.5 text-xs text-muted"><Minus className="h-3 w-3" /> 0</span>;
  if (n > 0) return <span className="flex items-center gap-0.5 text-xs text-success"><TrendingUp className="h-3 w-3" /> {n}</span>;
  return <span className="flex items-center gap-0.5 text-xs text-danger"><TrendingDown className="h-3 w-3" /> {Math.abs(n)}</span>;
}

function Jadval() {
  const top3 = reyting.slice(0, 3);
  const qolgan = reyting.slice(3);
  const podiumOrder = [top3[1], top3[0], top3[2]]; // 2 - 1 - 3

  return (
    <div className="space-y-8">
      {/* Podium */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {podiumOrder.map((r, i) => {
          const first = r.orin === 1;
          return (
            <Card
              key={r.foydalanuvchi.id}
              className={cn(
                "flex flex-col items-center gap-2 p-4 text-center transition-transform",
                first ? "-translate-y-3 border-primary/30 bg-primary text-white shadow-soft-lg" : "shadow-soft",
              )}
            >
              <div className="relative">
                <Avatar
                  ism={`${r.foydalanuvchi.ism} ${r.foydalanuvchi.familiya}`}
                  size={first ? "lg" : "md"}
                  className={first ? "bg-white/15 text-white ring-white/20" : ""}
                />
                <span className={cn(
                  "absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-soft",
                  first ? "bg-accent text-[#6B5A38]" : r.orin === 2 ? "bg-[#D8D8DE] text-[#54545C]" : "bg-[#E4B486] text-[#6B4A2E]",
                )}>
                  {r.orin}
                </span>
              </div>
              {first && <Crown className="h-5 w-5 text-accent" />}
              <div>
                <p className={cn("text-sm font-semibold leading-tight", first ? "text-white" : "text-foreground")}>
                  {r.foydalanuvchi.ism}
                </p>
                <p className={cn("text-xs", first ? "text-white/70" : "text-muted")}>{r.foydalanuvchi.familiya}</p>
              </div>
              <p className={cn("text-lg font-bold", first ? "text-white" : "text-primary")}>
                {r.ballar.toLocaleString()}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Ro'yxat */}
      <Card>
        <CardContent className="divide-y divide-border p-0">
          {qolgan.map((r) => {
            const men = r.foydalanuvchi.id === joriyFoydalanuvchi.id;
            return (
              <div
                key={r.foydalanuvchi.id}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 transition-colors sm:px-5",
                  men ? "bg-primary/5" : "hover:bg-[#F1E9D8]/50",
                )}
              >
                <span className="w-6 text-center text-sm font-bold text-muted">{r.orin}</span>
                <Avatar ism={`${r.foydalanuvchi.ism} ${r.foydalanuvchi.familiya}`} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate text-sm font-medium text-foreground">
                    {r.foydalanuvchi.ism} {r.foydalanuvchi.familiya}
                    {men && <Badge variant="default">Siz</Badge>}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted">
                    <MapPin className="h-3 w-3" /> {r.foydalanuvchi.region} · {r.yechilgan.toLocaleString()} savol
                  </p>
                </div>
                <Ozgarish n={r.ozgarish} />
                <p className="w-20 text-right text-sm font-bold text-foreground">{r.ballar.toLocaleString()}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">
            <Trophy className="h-6 w-6 text-primary" /> Reyting
          </h1>
          <p className="text-[15px] text-muted">Eng faol o'quvchilar bilan raqobatlashing va yuqoriga ko'tariling.</p>
        </div>
      </div>

      <Tabs defaultValue="haftalik">
        <TabsList>
          {davrlar.map((d) => (
            <TabsTrigger key={d.id} value={d.id}>{d.nomi}</TabsTrigger>
          ))}
        </TabsList>
        {davrlar.map((d) => (
          <TabsContent key={d.id} value={d.id} className="mt-6">
            <Jadval />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
