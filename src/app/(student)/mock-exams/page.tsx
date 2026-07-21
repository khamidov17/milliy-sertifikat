"use client";

import * as React from "react";
import Link from "next/link";
import {
  Target, Clock, FileText, Crown, Play, Loader2, Lock, CalendarClock,
  ClipboardList, CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MockRunner } from "@/components/practice/mock-runner";
import { mockRoyxat, mockSavollari, type MockRoyxatItem, type MockBoshlash } from "@/lib/actions";
import { formatSana } from "@/lib/utils";

export default function MockExamsPage() {
  const [royxat, setRoyxat] = React.useState<MockRoyxatItem[] | null>(null);
  const [yuklanmoqda, setYuklanmoqda] = React.useState<number | null>(null);
  const [faol, setFaol] = React.useState<{ id: number; data: MockBoshlash } | null>(null);

  React.useEffect(() => {
    mockRoyxat().then(setRoyxat);
  }, []);

  async function boshla(id: number) {
    setYuklanmoqda(id);
    const r = await mockSavollari(id);
    setYuklanmoqda(null);
    if ("xato" in r) return alert(r.xato);
    setFaol({ id, data: r });
  }

  if (faol) {
    return (
      <MockRunner
        mockId={faol.id}
        nomi={faol.data.nomi}
        davomiylikDaqiqa={faol.data.davomiylikDaqiqa}
        savollar={faol.data.savollar}
        onChiqish={() => { setFaol(null); mockRoyxat().then(setRoyxat); }}
      />
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">Sinov imtihonlari</h1>
          <p className="text-[15px] text-muted">Rasmiy formatdagi imtihonlar — belgilangan vaqt ichida yeching.</p>
        </div>
        <Button asChild variant="secondary"><Link href="/history"><ClipboardList className="h-4 w-4" /> Tarixim</Link></Button>
      </div>

      {royxat === null ? (
        <div className="flex items-center justify-center py-20 text-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {royxat.map((m) => {
            const ochiq = m.holat === "ochiq";
            return (
              <Card key={m.id} className="relative overflow-hidden transition-all duration-200 hover:shadow-soft-lg">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${m.turi === "toliq" ? "bg-primary text-white shadow-soft" : "bg-[#F1E9D8] text-primary"}`}>
                      <Target className="h-6 w-6" />
                    </span>
                    {m.turi === "toliq" ? <Badge variant="accent"><Crown className="h-3 w-3" /> To'liq</Badge> : <Badge variant="neutral">Mini</Badge>}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{m.nomi}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{m.tavsif}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                    <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> {m.savollarSoni} savol</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {m.davomiylikDaqiqa} daqiqa</span>
                  </div>

                  {/* Holat */}
                  {ochiq ? (
                    <Button className="w-full" disabled={yuklanmoqda === m.id} onClick={() => boshla(m.id)}>
                      {yuklanmoqda === m.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} Imtihonni boshlash
                    </Button>
                  ) : m.holat === "kelgusi" ? (
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-warning/8 py-3 text-sm font-medium text-warning">
                      <CalendarClock className="h-4 w-4" /> Ochiladi: {m.boshlanish ? formatSana(new Date(m.boshlanish)) : "—"}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-[#F1E9D8] py-3 text-sm font-medium text-muted">
                      <Lock className="h-4 w-4" /> Muddati tugagan
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {royxat.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-16 text-muted">
              <CheckCircle2 className="h-8 w-8" /> Hozircha imtihonlar yo'q
            </div>
          )}
        </div>
      )}
    </div>
  );
}
