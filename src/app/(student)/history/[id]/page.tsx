import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, Check, X, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MathText } from "@/components/math-text";
import { tarixDetal } from "@/lib/actions";
import { vaqtSana, vaqtMatn, vaqtQisqa, cn } from "@/lib/utils";

const BELGILAR = ["A", "B", "C", "D", "E"] as const;

export default async function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = await tarixDetal(Number(id));
  if (!d) notFound();

  const javobsiz = d.natijalar.filter((n) => n.tanlangan == null).length;

  return (
    <div className="animate-fade-in space-y-6">
      <Link href="/history" className="flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Tarixga qaytish
      </Link>

      {/* Xulosa */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-foreground">{d.nomi}</h1>
            <p className="flex flex-wrap items-center gap-x-3 text-xs text-muted">
              <span>{vaqtSana(d.sana)}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {vaqtMatn(d.davomiylik)}</span>
            </p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-[#FBF6EC]">
            <div className="p-4 text-center"><p className="text-2xl font-bold text-primary">{d.ball}%</p><p className="text-xs text-muted">Natija</p></div>
            <div className="p-4 text-center"><p className="text-2xl font-bold text-success">{d.togri}</p><p className="text-xs text-muted">To'g'ri</p></div>
            <div className="p-4 text-center"><p className="text-2xl font-bold text-danger">{d.jami - d.togri - javobsiz}</p><p className="text-xs text-muted">Xato</p></div>
          </div>
        </CardContent>
      </Card>

      {/* Har bir savol tahlili */}
      <div className="space-y-4">
        {d.natijalar.map((n, i) => {
          const holat = n.tanlangan == null ? "javobsiz" : n.togri ? "togri" : "xato";
          return (
            <Card key={n.question_id}>
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-muted">Savol {i + 1}{n.manba_kod ? ` · DTM ${n.manba_kod}` : ""}</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-muted"><Clock className="h-3.5 w-3.5" /> {vaqtQisqa(n.sekund)}</span>
                    {holat === "togri" && <Badge variant="success"><Check className="h-3 w-3" /> To'g'ri</Badge>}
                    {holat === "xato" && <Badge variant="danger"><X className="h-3 w-3" /> Xato</Badge>}
                    {holat === "javobsiz" && <Badge variant="neutral"><Minus className="h-3 w-3" /> Javobsiz</Badge>}
                  </div>
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
    </div>
  );
}
