import { Building2, Globe, Bell, Shield, CreditCard, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

function Toggle({ on = false }: { on?: boolean }) {
  return (
    <span className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${on ? "bg-primary" : "bg-[#E0D3BC]"}`}>
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-soft transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
    </span>
  );
}

export default function SettingsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">Tizim sozlamalari</h1>
        <p className="text-[15px] text-muted">Platforma konfiguratsiyasi va umumiy parametrlar.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Umumiy */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-sm"><Building2 className="h-4 w-4 text-primary" /> Umumiy</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Platforma nomi</Label><Input defaultValue="Milliy Sertifikat" /></div>
            <div className="space-y-2"><Label>Qo'llab-quvvatlash emaili</Label><Input defaultValue="yordam@milliy.uz" /></div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> Standart til</Label>
              <Select defaultValue="uz"><option value="uz">O'zbek tili</option></Select>
            </div>
          </CardContent>
        </Card>

        {/* Imtihon parametrlari */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-sm"><Shield className="h-4 w-4 text-primary" /> Imtihon qoidalari</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>To'liq sinov (daqiqa)</Label><Input type="number" defaultValue={90} /></div>
              <div className="space-y-2"><Label>Mini sinov (daqiqa)</Label><Input type="number" defaultValue={30} /></div>
            </div>
            <Separator />
            {[
              { nomi: "Savollarni aralashtirish", tavsif: "Har bir urinishda tartib o'zgaradi", on: true },
              { nomi: "Natijani darhol ko'rsatish", tavsif: "Imtihon oxirida ball chiqadi", on: true },
              { nomi: "Qayta topshirishga ruxsat", tavsif: "O'quvchi imtihonni takrorlashi mumkin", on: false },
            ].map((r) => (
              <div key={r.nomi} className="flex items-center justify-between">
                <div><p className="text-sm font-medium text-foreground">{r.nomi}</p><p className="text-xs text-muted">{r.tavsif}</p></div>
                <Toggle on={r.on} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bildirishnomalar */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-sm"><Bell className="h-4 w-4 text-primary" /> Bildirishnomalar</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { nomi: "Telegram eslatmalari", tavsif: "Kunlik seriya va yangiliklar", on: true },
              { nomi: "Email xabarlari", tavsif: "Muhim yangilanishlar", on: true },
              { nomi: "Imtihon eslatmasi", tavsif: "Rasmiy imtihon yaqinlashganda", on: true },
            ].map((r) => (
              <div key={r.nomi} className="flex items-center justify-between">
                <div><p className="text-sm font-medium text-foreground">{r.nomi}</p><p className="text-xs text-muted">{r.tavsif}</p></div>
                <Toggle on={r.on} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* To'lov */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-sm"><CreditCard className="h-4 w-4 text-primary" /> To'lov tizimlari</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { nomi: "Payme", tavsif: "Ulangan", on: true },
              { nomi: "Click", tavsif: "Ulangan", on: true },
              { nomi: "Uzcard / Humo", tavsif: "Ulangan", on: true },
            ].map((r) => (
              <div key={r.nomi} className="flex items-center justify-between">
                <div><p className="text-sm font-medium text-foreground">{r.nomi}</p><p className="text-xs text-muted">{r.tavsif}</p></div>
                <Toggle on={r.on} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button><Save className="h-4 w-4" /> Saqlash</Button>
      </div>
    </div>
  );
}
