import { Plus, Target, Clock, FileText, Pencil, Crown, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sinovImtihonlar } from "@/lib/data";

export default function AdminMockExamsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">Sinov imtihonlari</h1>
          <p className="text-[15px] text-muted">Imtihonlarni yarating va nashr holatini boshqaring.</p>
        </div>
        <Button><Plus className="h-4 w-4" /> Yangi imtihon</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {sinovImtihonlar.map((s) => (
              <div key={s.id} className="flex flex-col gap-3 px-6 py-4 transition-colors hover:bg-[#F1E9D8]/40 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary"><Target className="h-5 w-5" /></div>
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                      {s.nomi}
                      {s.premium && <Badge variant="accent"><Crown className="h-3 w-3" /> Premium</Badge>}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {s.savollarSoni} savol</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {s.davomiylikDaqiqa} daqiqa</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {(Math.floor(Math.abs(Math.sin(s.id.length * 3)) * 900) + 120)} urinish</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={s.turi === "toliq" ? "default" : "neutral"}>{s.turi === "toliq" ? "To'liq" : "Mini"}</Badge>
                  <Button variant="secondary" size="sm"><Pencil className="h-3.5 w-3.5" /> Tahrirlash</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
