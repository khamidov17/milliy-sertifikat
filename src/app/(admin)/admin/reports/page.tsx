import { BarChart3, TrendingUp, Users, Target, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fanlar } from "@/lib/data";

const haftalik = [
  { kun: "Du", qiymat: 68 }, { kun: "Se", qiymat: 82 }, { kun: "Ch", qiymat: 74 },
  { kun: "Pa", qiymat: 91 }, { kun: "Ju", qiymat: 86 }, { kun: "Sh", qiymat: 62 }, { kun: "Ya", qiymat: 48 },
];

export default function ReportsPage() {
  const maxQ = Math.max(...haftalik.map((h) => h.qiymat));
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">Hisobotlar</h1>
          <p className="text-[15px] text-muted">Platforma faoliyati va o'quv natijalari tahlili.</p>
        </div>
        <Button variant="secondary"><Download className="h-4 w-4" /> Eksport</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { nomi: "Kunlik faol", qiymat: "3 240", ozg: "+6%", icon: Users },
          { nomi: "Yechilgan savollar", qiymat: "184k", ozg: "+14%", icon: Target },
          { nomi: "O'rtacha natija", qiymat: "71%", ozg: "+2%", icon: TrendingUp },
        ].map((s) => (
          <Card key={s.nomi}><CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary"><s.icon className="h-5 w-5" /></div>
              <Badge variant="success"><TrendingUp className="h-3 w-3" /> {s.ozg}</Badge>
            </div>
            <div><p className="text-2xl font-bold text-foreground">{s.qiymat}</p><p className="text-xs text-muted">{s.nomi}</p></div>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Haftalik faollik */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-sm"><BarChart3 className="h-4 w-4 text-primary" /> Haftalik faollik</CardTitle></CardHeader>
          <CardContent>
            <div className="flex h-48 items-end justify-between gap-3 pt-4">
              {haftalik.map((h) => (
                <div key={h.kun} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-lg bg-primary transition-all hover:bg-primary-hover"
                      style={{ height: `${(h.qiymat / maxQ) * 100}%`, opacity: 0.55 + (h.qiymat / maxQ) * 0.45 }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted">{h.kun}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fanlar bo'yicha o'rtacha natija */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Fanlar bo'yicha o'rtacha natija</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {fanlar.map((f, i) => {
              const natija = 82 - i * 5;
              return (
                <div key={f.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-foreground">{f.emoji} {f.nomi}</span>
                    <span className="text-xs font-semibold text-muted">{natija}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#EFE6D3]">
                    <div className={`h-full rounded-full ${natija >= 70 ? "bg-success" : natija >= 55 ? "bg-warning" : "bg-danger"}`} style={{ width: `${natija}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
