import { Search, GraduationCap, Crown, MapPin, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { reyting } from "@/lib/data";

const oquvchilar = reyting.map((r, i) => ({
  ...r.foydalanuvchi,
  ballar: r.ballar,
  yechilgan: r.yechilgan,
  obuna: i < 3 ? "premium" : i % 2 === 0 ? "premium" : "bepul",
  faol: i < 7,
}));

export default function StudentsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">O'quvchilar</h1>
        <p className="text-[15px] text-muted">Ro'yxatdan o'tgan o'quvchilar — jami 8 420 ta.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { nomi: "Jami o'quvchilar", qiymat: "8 420" },
          { nomi: "Premium a'zolar", qiymat: "2 180" },
          { nomi: "Bu hafta faol", qiymat: "5 640" },
        ].map((s) => (
          <Card key={s.nomi}><CardContent className="p-5"><p className="text-2xl font-bold text-foreground">{s.qiymat}</p><p className="text-xs text-muted">{s.nomi}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input placeholder="O'quvchi qidirish…" className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="hidden grid-cols-[1fr,140px,120px,110px,50px] gap-4 border-b border-border px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted lg:grid">
            <span>O'quvchi</span><span>Region</span><span>Ball</span><span>Obuna</span><span></span>
          </div>
          <div className="divide-y divide-border">
            {oquvchilar.map((o) => (
              <div key={o.id} className="grid grid-cols-1 items-center gap-2 px-6 py-3.5 transition-colors hover:bg-[#F1E9D8]/40 lg:grid-cols-[1fr,140px,120px,110px,50px] lg:gap-4">
                <div className="flex items-center gap-3">
                  <Avatar ism={`${o.ism} ${o.familiya}`} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{o.ism} {o.familiya}</p>
                    <p className="text-xs text-muted">@{o.username}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-sm text-muted"><MapPin className="h-3.5 w-3.5" /> {o.region}</span>
                <span className="text-sm font-semibold text-foreground">{o.ballar.toLocaleString()}</span>
                <div>
                  {o.obuna === "premium"
                    ? <Badge variant="accent"><Crown className="h-3 w-3" /> Premium</Badge>
                    : <Badge variant="neutral">Bepul</Badge>}
                </div>
                <button className="rounded-lg p-1.5 text-muted hover:bg-[#F1E9D8]"><MoreHorizontal className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
