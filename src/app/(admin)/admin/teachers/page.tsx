import { Plus, Mail, FileQuestion, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

const oqituvchilar = [
  { id: "t1", ism: "Nilufar", familiya: "Rahimova", fan: "Matematika", email: "nilufar.r@milliy.uz", savollar: 842, holat: "faol" },
  { id: "t2", ism: "Sardor", familiya: "Aliyev", fan: "Fizika", email: "sardor.a@milliy.uz", savollar: 614, holat: "faol" },
  { id: "t3", ism: "Malika", familiya: "Yusupova", fan: "Biologiya", email: "malika.y@milliy.uz", savollar: 738, holat: "faol" },
  { id: "t4", ism: "Javohir", familiya: "Toshev", fan: "Tarix", email: "javohir.t@milliy.uz", savollar: 456, holat: "taklif" },
  { id: "t5", ism: "Zarina", familiya: "Sobirova", fan: "Ona tili", email: "zarina.s@milliy.uz", savollar: 923, holat: "faol" },
];

export default function TeachersPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">O'qituvchilar</h1>
          <p className="text-[15px] text-muted">Savol muallliflari va ularning faoliyati.</p>
        </div>
        <Button><Plus className="h-4 w-4" /> O'qituvchi taklif qilish</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {oqituvchilar.map((t) => (
          <Card key={t.id} className="group transition-all duration-200 hover:shadow-soft-lg">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar ism={`${t.ism} ${t.familiya}`} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.ism} {t.familiya}</p>
                    <p className="text-xs text-muted">{t.fan}</p>
                  </div>
                </div>
                <button className="rounded-lg p-1.5 text-muted hover:bg-[#F1E9D8]"><MoreHorizontal className="h-4 w-4" /></button>
              </div>
              <div className="space-y-2 text-xs text-muted">
                <p className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {t.email}</p>
                <p className="flex items-center gap-1.5"><FileQuestion className="h-3.5 w-3.5" /> {t.savollar} ta savol yaratgan</p>
              </div>
              <div className="border-t border-border pt-3">
                {t.holat === "faol"
                  ? <Badge variant="success">Faol</Badge>
                  : <Badge variant="warning">Taklif yuborilgan</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
