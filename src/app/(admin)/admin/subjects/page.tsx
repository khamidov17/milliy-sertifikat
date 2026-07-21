import { Plus, Pencil, BookOpen, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fanlar, mavzular } from "@/lib/data";

export default function SubjectsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">Fanlar</h1>
          <p className="text-[15px] text-muted">Platformadagi fanlar va mavzularni boshqaring.</p>
        </div>
        <Button><Plus className="h-4 w-4" /> Yangi fan</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fanlar.map((f) => {
          const mavzuSoni = mavzular.filter((m) => m.fanId === f.id).length;
          return (
            <Card key={f.id} className="group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1E9D8] text-2xl">{f.emoji}</span>
                  <button className="rounded-lg p-1.5 text-muted opacity-0 transition-opacity hover:bg-[#F1E9D8] hover:text-primary group-hover:opacity-100"><Pencil className="h-4 w-4" /></button>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{f.nomi}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">{f.tavsif}</p>
                </div>
                <div className="flex items-center gap-4 border-t border-border pt-3 text-xs text-muted">
                  <span className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5" /> {mavzuSoni} mavzu</span>
                  <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {f.savollarSoni.toLocaleString()} savol</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
