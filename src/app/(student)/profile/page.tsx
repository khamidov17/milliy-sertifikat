import {
  Crown, Check, Mail, AtSign, MapPin, Award, Settings, Bell,
  Globe, Shield, ChevronRight, Zap, Target, Flame,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { joriyFoydalanuvchi, yutuqlar, urinishlar } from "@/lib/data";

const sozlamalar = [
  { icon: Bell, nomi: "Bildirishnomalar", tavsif: "Eslatma va yangiliklar" },
  { icon: Globe, nomi: "Til", tavsif: "O'zbek tili" },
  { icon: Shield, nomi: "Maxfiylik va xavfsizlik", tavsif: "Parol va hisob himoyasi" },
  { icon: Settings, nomi: "Umumiy sozlamalar", tavsif: "Ilova ko'rinishi" },
];

export default function ProfilePage() {
  const u = joriyFoydalanuvchi;
  const yechilgan = 2350;
  const ortacha = Math.round(urinishlar.reduce((a, x) => a + x.ball, 0) / urinishlar.length);

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">Profil</h1>

      {/* Profil sarlavhasi */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-primary" style={{ backgroundImage: "linear-gradient(120deg,#0F766E,#0C5F59)" }} />
        <CardContent className="p-6">
          <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end">
              <Avatar ism={`${u.ism} ${u.familiya}`} size="xl" className="ring-4 ring-card" />
              <div className="space-y-1 pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{u.ism} {u.familiya}</h2>
                  {u.obuna === "premium" && <Badge variant="accent"><Crown className="h-3 w-3" /> Premium</Badge>}
                </div>
                <p className="flex items-center gap-1.5 text-sm text-muted"><AtSign className="h-3.5 w-3.5" />{u.username}</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">Profilni tahrirlash</Button>
          </div>

          <div className="mt-6 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-[#FBF6EC]">
            <div className="p-4 text-center">
              <p className="flex items-center justify-center gap-1 text-xl font-bold text-foreground"><Zap className="h-4 w-4 text-primary" />{yechilgan.toLocaleString()}</p>
              <p className="mt-0.5 text-xs text-muted">Yechilgan savol</p>
            </div>
            <div className="p-4 text-center">
              <p className="flex items-center justify-center gap-1 text-xl font-bold text-foreground"><Target className="h-4 w-4 text-success" />{ortacha}%</p>
              <p className="mt-0.5 text-xs text-muted">O'rtacha natija</p>
            </div>
            <div className="p-4 text-center">
              <p className="flex items-center justify-center gap-1 text-xl font-bold text-foreground"><Flame className="h-4 w-4 text-warning" />{u.seriya}</p>
              <p className="mt-0.5 text-xs text-muted">Kunlik seriya</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chap ustun */}
        <div className="space-y-6 lg:col-span-2">
          {/* Shaxsiy ma'lumot */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Shaxsiy ma'lumotlar</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              {[
                { icon: Mail, label: "Email", value: u.email },
                { icon: AtSign, label: "Foydalanuvchi nomi", value: u.username },
                { icon: MapPin, label: "Region", value: u.region },
                { icon: Award, label: "Daraja", value: `${u.daraja}-daraja · ${u.ballar.toLocaleString()} ball` },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl px-2 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8 text-primary"><item.icon className="h-4 w-4" /></div>
                  <div className="flex-1">
                    <p className="text-xs text-muted">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Yutuqlar */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-sm"><Award className="h-4 w-4 text-primary" /> Yutuqlar</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {yutuqlar.map((y) => (
                <div
                  key={y.id}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center transition-all ${
                    y.qolganDaraja ? "border-border bg-[#FBF6EC]" : "border-dashed border-border bg-transparent opacity-55"
                  }`}
                >
                  <span className="text-3xl">{y.emoji}</span>
                  <p className="text-xs font-semibold text-foreground">{y.nomi}</p>
                  <p className="text-[11px] leading-tight text-muted">{y.tavsif}</p>
                  {y.qolganDaraja && <Check className="h-3.5 w-3.5 text-success" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* O'ng ustun */}
        <div className="space-y-6">
          {/* Obuna */}
          <Card className="overflow-hidden border-primary/20">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Premium obuna</h3>
              </div>
              <p className="text-sm text-muted">Barcha to'liq sinov imtihonlari va tahlillar ochiq.</p>
              <Separator />
              <ul className="space-y-2 text-sm">
                {["Cheksiz mashq", "To'liq sinov imtihonlari", "Batafsil tahlil", "Reklamasiz"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-foreground"><Check className="h-4 w-4 text-success" /> {f}</li>
                ))}
              </ul>
              <div className="rounded-xl bg-[#FBF6EC] p-3 text-center text-xs text-muted">
                Keyingi to'lov: <span className="font-medium text-foreground">15-avgust, 2026</span>
              </div>
              <Button variant="secondary" className="w-full" size="sm">Obunani boshqarish</Button>
            </CardContent>
          </Card>

          {/* Sozlamalar */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Sozlamalar</CardTitle></CardHeader>
            <CardContent className="p-2">
              {sozlamalar.map((s) => (
                <button key={s.nomi} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[#F1E9D8]/60">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8 text-primary"><s.icon className="h-4 w-4" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{s.nomi}</p>
                    <p className="text-xs text-muted">{s.tavsif}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted" />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
