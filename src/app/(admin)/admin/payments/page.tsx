import { CreditCard, TrendingUp, Download, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

const tolovlar = [
  { id: "p1", ism: "Dilnoza Karimova", reja: "Premium (oylik)", summa: "49 000", usul: "Payme", holat: "muvaffaqiyatli", sana: "20-iyul, 2026" },
  { id: "p2", ism: "Bekzod Umarov", reja: "Pro (yillik)", summa: "490 000", usul: "Click", holat: "muvaffaqiyatli", sana: "19-iyul, 2026" },
  { id: "p3", ism: "Feruza Ergasheva", reja: "Premium (oylik)", summa: "49 000", usul: "Payme", holat: "kutilmoqda", sana: "19-iyul, 2026" },
  { id: "p4", ism: "Oybek Nazarov", reja: "Premium (oylik)", summa: "49 000", usul: "Uzcard", holat: "muvaffaqiyatli", sana: "18-iyul, 2026" },
  { id: "p5", ism: "Jasur Qodirov", reja: "Pro (yillik)", summa: "490 000", usul: "Click", holat: "bekor", sana: "17-iyul, 2026" },
];

const holatMap = {
  muvaffaqiyatli: { icon: CheckCircle2, variant: "success" as const, nomi: "Muvaffaqiyatli" },
  kutilmoqda: { icon: Clock, variant: "warning" as const, nomi: "Kutilmoqda" },
  bekor: { icon: XCircle, variant: "danger" as const, nomi: "Bekor qilingan" },
};

export default function PaymentsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">To'lovlar</h1>
          <p className="text-[15px] text-muted">Obuna to'lovlari va daromad hisoboti.</p>
        </div>
        <Button variant="secondary"><Download className="h-4 w-4" /> Hisobotni yuklab olish</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { nomi: "Oylik daromad", qiymat: "42.6M so'm", ozg: "+8%" },
          { nomi: "Yangi obunalar", qiymat: "318", ozg: "+21%" },
          { nomi: "Faol obunalar", qiymat: "2 180", ozg: "+5%" },
        ].map((s) => (
          <Card key={s.nomi}><CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary"><CreditCard className="h-5 w-5" /></div>
              <Badge variant="success"><TrendingUp className="h-3 w-3" /> {s.ozg}</Badge>
            </div>
            <div><p className="text-2xl font-bold text-foreground">{s.qiymat}</p><p className="text-xs text-muted">{s.nomi}</p></div>
          </CardContent></Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="hidden grid-cols-[1fr,150px,120px,110px,130px] gap-4 border-b border-border px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted lg:grid">
            <span>O'quvchi</span><span>Reja</span><span>Summa</span><span>Usul</span><span>Holat</span>
          </div>
          <div className="divide-y divide-border">
            {tolovlar.map((t) => {
              const h = holatMap[t.holat as keyof typeof holatMap];
              return (
                <div key={t.id} className="grid grid-cols-1 items-center gap-2 px-6 py-3.5 transition-colors hover:bg-[#F1E9D8]/40 lg:grid-cols-[1fr,150px,120px,110px,130px] lg:gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar ism={t.ism} size="sm" />
                    <div className="min-w-0"><p className="truncate text-sm font-medium text-foreground">{t.ism}</p><p className="text-xs text-muted">{t.sana}</p></div>
                  </div>
                  <span className="text-sm text-muted">{t.reja}</span>
                  <span className="text-sm font-semibold text-foreground">{t.summa} so'm</span>
                  <span className="text-sm text-muted">{t.usul}</span>
                  <Badge variant={h.variant}><h.icon className="h-3 w-3" /> {h.nomi}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
