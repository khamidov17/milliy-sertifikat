import { Mail, Shield, Building2, FileQuestion, Target, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

export default function AdminProfilePage() {
  const admin = { ism: "Alisher", familiya: "Rustamov", email: "alisher.r@milliy.uz", rol: "Administrator" };
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">Profil</h1>

      <Card className="overflow-hidden">
        <div className="h-24" style={{ backgroundImage: "linear-gradient(120deg,#8E2C3A,#74222F)" }} />
        <CardContent className="p-6">
          <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end">
              <Avatar ism={`${admin.ism} ${admin.familiya}`} size="xl" className="ring-4 ring-card" />
              <div className="space-y-1 pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{admin.ism} {admin.familiya}</h2>
                  <Badge variant="default"><Shield className="h-3 w-3" /> {admin.rol}</Badge>
                </div>
                <p className="flex items-center gap-1.5 text-sm text-muted"><Mail className="h-3.5 w-3.5" />{admin.email}</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">Tahrirlash</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { nomi: "Boshqarilgan savollar", qiymat: "1 240", icon: FileQuestion },
          { nomi: "Yaratilgan imtihonlar", qiymat: "18", icon: Target },
          { nomi: "Nazorat ostidagi o'qituvchilar", qiymat: "12", icon: Users },
        ].map((s) => (
          <Card key={s.nomi}><CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary"><s.icon className="h-5 w-5" /></div>
            <div><p className="text-2xl font-bold text-foreground">{s.qiymat}</p><p className="text-xs text-muted">{s.nomi}</p></div>
          </CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-sm"><Building2 className="h-4 w-4 text-primary" /> Ruxsatlar</CardTitle></CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {[
            "Savollarni boshqarish", "Imtihonlarni yaratish", "O'quvchilarni ko'rish",
            "O'qituvchilarni boshqarish", "To'lovlarni ko'rish", "Tizim sozlamalari",
          ].map((p) => (
            <div key={p} className="flex items-center gap-2 rounded-xl bg-[#FBF6EC] px-3 py-2.5 text-sm text-foreground">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15 text-success">✓</span>
              {p}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
