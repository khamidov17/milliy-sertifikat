import Link from "next/link";
import { ClipboardList, Clock, ArrowRight, PencilLine, Trophy, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tarix } from "@/lib/actions";
import { vaqtSana, vaqtMatn } from "@/lib/utils";

const turiMap: Record<string, { nomi: string; icon: typeof PencilLine }> = {
  mavzu: { nomi: "Mavzu mashqi", icon: PencilLine },
  kurs: { nomi: "Kurs sinovi", icon: Trophy },
  mock: { nomi: "Sinov imtihoni", icon: Target },
};

export default async function HistoryPage() {
  const royxat = await tarix();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">Tarix</h1>
        <p className="text-[15px] text-muted">Yechgan mashq va imtihonlaringiz — natijalar va batafsil tahlil.</p>
      </div>

      {royxat.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-20 text-center text-muted">
          <ClipboardList className="h-9 w-9" />
          <p>Hali mashq yoki imtihon yechmadingiz.</p>
          <Link href="/practice" className="text-sm font-semibold text-primary hover:text-primary-hover">Mashqni boshlash →</Link>
        </div>
      ) : (
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {royxat.map((a) => {
              const t = turiMap[a.turi] ?? turiMap.mavzu;
              const Icon = t.icon;
              return (
                <Link key={a.id} href={`/history/${a.id}`} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#F1E9D8]/50">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${a.ball >= 60 ? "bg-success/10 text-success" : "bg-primary/8 text-primary"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 truncate text-sm font-medium text-foreground">
                      {a.nomi} <Badge variant="neutral">{t.nomi}</Badge>
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
                      <span>{vaqtSana(a.sana)}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {vaqtMatn(a.davomiylik)}</span>
                      <span>{a.togri}/{a.jami} to'g'ri</span>
                    </p>
                  </div>
                  <p className={`text-lg font-bold ${a.ball >= 85 ? "text-success" : a.ball >= 50 ? "text-warning" : "text-danger"}`}>{a.ball}%</p>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
                </Link>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
