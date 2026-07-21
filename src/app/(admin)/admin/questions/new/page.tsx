"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronLeft, ImagePlus, Check, Save, Send, X, Eye,
  Sparkles, Tag as TagIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { fanlar, mavzular } from "@/lib/data";
import { cn } from "@/lib/utils";

type Belgi = "A" | "B" | "C" | "D";

export default function QuestionBuilderPage() {
  const [fanId, setFanId] = React.useState(fanlar[0].id);
  const [mavzuId, setMavzuId] = React.useState("");
  const [subtopik, setSubtopik] = React.useState("");
  const [qiyinchilik, setQiyinchilik] = React.useState("orta");
  const [matn, setMatn] = React.useState("");
  const [variantlar, setVariantlar] = React.useState<Record<Belgi, string>>({ A: "", B: "", C: "", D: "" });
  const [togri, setTogri] = React.useState<Belgi>("A");
  const [izoh, setIzoh] = React.useState("");
  const [manba, setManba] = React.useState("");
  const [teglar, setTeglar] = React.useState<string[]>([]);
  const [tegKirish, setTegKirish] = React.useState("");

  const fanMavzular = mavzular.filter((m) => m.fanId === fanId);
  const fan = fanlar.find((f) => f.id === fanId);

  function tegQosh(e: React.KeyboardEvent) {
    if (e.key === "Enter" && tegKirish.trim()) {
      e.preventDefault();
      if (!teglar.includes(tegKirish.trim())) setTeglar([...teglar, tegKirish.trim()]);
      setTegKirish("");
    }
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Sarlavha */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon"><Link href="/admin/questions"><ChevronLeft className="h-5 w-5" /></Link></Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Yangi savol</h1>
            <p className="text-sm text-muted">Savol tuzing va jonli ko'rinishda tekshiring.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary"><Save className="h-4 w-4" /> Qoralama saqlash</Button>
          <Button><Send className="h-4 w-4" /> Chop etish</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* CHAP — forma */}
        <div className="space-y-6">
          {/* Tasnif */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Tasnif</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Fan</Label>
                  <Select value={fanId} onChange={(e) => { setFanId(e.target.value); setMavzuId(""); }}>
                    {fanlar.map((f) => <option key={f.id} value={f.id}>{f.nomi}</option>)}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mavzu</Label>
                  <Select value={mavzuId} onChange={(e) => setMavzuId(e.target.value)}>
                    <option value="">Tanlang…</option>
                    {fanMavzular.map((m) => <option key={m.id} value={m.id}>{m.nomi}</option>)}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Kichik mavzu</Label>
                  <Input value={subtopik} onChange={(e) => setSubtopik(e.target.value)} placeholder="Masalan: Chiziqli tenglamalar" />
                </div>
                <div className="space-y-2">
                  <Label>Qiyinchilik</Label>
                  <Select value={qiyinchilik} onChange={(e) => setQiyinchilik(e.target.value)}>
                    <option value="oson">Oson</option>
                    <option value="orta">O'rta</option>
                    <option value="qiyin">Qiyin</option>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Savol matni + rasm */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Savol</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Savol matni</Label>
                <Textarea value={matn} onChange={(e) => setMatn(e.target.value)} placeholder="Savol matnini kiriting…" />
              </div>
              <div className="space-y-2">
                <Label>Rasm (ixtiyoriy)</Label>
                <button className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-[#FBF6EC] py-8 text-muted transition-colors hover:border-accent hover:text-primary">
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-sm font-medium">Rasm yuklash uchun bosing</span>
                  <span className="text-xs">PNG, JPG — 5 MB gacha</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Variantlar */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Javob variantlari</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {(["A", "B", "C", "D"] as Belgi[]).map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <button
                    onClick={() => setTogri(b)}
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-all",
                      togri === b ? "bg-success text-white" : "bg-[#F1E9D8] text-muted hover:bg-accent/50",
                    )}
                    title="To'g'ri javob sifatida belgilash"
                  >
                    {togri === b ? <Check className="h-4 w-4" /> : b}
                  </button>
                  <Input
                    value={variantlar[b]}
                    onChange={(e) => setVariantlar({ ...variantlar, [b]: e.target.value })}
                    placeholder={`${b} varianti`}
                  />
                </div>
              ))}
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <Check className="h-3.5 w-3.5 text-success" /> Yashil belgi — to'g'ri javob
              </p>
            </CardContent>
          </Card>

          {/* Izoh, teglar, manba */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Qo'shimcha</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Izoh (yechim tushuntirishi)</Label>
                <Textarea value={izoh} onChange={(e) => setIzoh(e.target.value)} placeholder="To'g'ri javob nima uchun to'g'ri ekanini tushuntiring…" className="min-h-[72px]" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><TagIcon className="h-3.5 w-3.5" /> Teglar</Label>
                <Input value={tegKirish} onChange={(e) => setTegKirish(e.target.value)} onKeyDown={tegQosh} placeholder="Teg yozing va Enter bosing…" />
                {teglar.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {teglar.map((t) => (
                      <span key={t} className="flex items-center gap-1 rounded-full bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary">
                        {t}
                        <button onClick={() => setTeglar(teglar.filter((x) => x !== t))}><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Manba</Label>
                <Input value={manba} onChange={(e) => setManba(e.target.value)} placeholder="Masalan: Milliy sertifikat, 2024" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* O'NG — jonli ko'rinish */}
        <div className="lg:sticky lg:top-6 lg:h-fit">
          <Card className="border-primary/15">
            <CardHeader className="flex-row items-center justify-between border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2 text-sm"><Eye className="h-4 w-4 text-primary" /> Jonli ko'rinish</CardTitle>
              <Badge variant="accent"><Sparkles className="h-3 w-3" /> O'quvchi ko'rinishi</Badge>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
              <div className="flex flex-wrap items-center gap-2">
                {fan && <Badge variant="neutral">{fan.emoji} {fan.nomi}</Badge>}
                <Badge variant={qiyinchilik === "qiyin" ? "danger" : qiyinchilik === "orta" ? "warning" : "success"}>
                  {qiyinchilik === "oson" ? "Oson" : qiyinchilik === "orta" ? "O'rta" : "Qiyin"}
                </Badge>
              </div>

              <h2 className="text-lg font-semibold leading-relaxed text-foreground text-balance">
                {matn || <span className="text-muted/60">Savol matni shu yerda ko'rinadi…</span>}
              </h2>

              <div className="space-y-3">
                {(["A", "B", "C", "D"] as Belgi[]).map((b) => {
                  const togriMi = togri === b;
                  return (
                    <div
                      key={b}
                      className={cn(
                        "flex items-center gap-4 rounded-xl border px-4 py-3.5 text-sm font-medium",
                        togriMi ? "border-success bg-success/8" : "border-border bg-card",
                      )}
                    >
                      <span className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                        togriMi ? "bg-success text-white" : "bg-[#F1E9D8] text-muted",
                      )}>
                        {togriMi ? <Check className="h-4 w-4" /> : b}
                      </span>
                      <span className={cn("flex-1", !variantlar[b] && "text-muted/60")}>
                        {variantlar[b] || `${b} varianti…`}
                      </span>
                    </div>
                  );
                })}
              </div>

              {izoh && (
                <div className="rounded-xl border border-border bg-[#FBF6EC] p-4">
                  <p className="mb-1 text-sm font-semibold text-foreground">Izoh</p>
                  <p className="text-sm leading-relaxed text-muted">{izoh}</p>
                </div>
              )}

              {teglar.length > 0 && (
                <div className="flex flex-wrap gap-1.5 border-t border-border pt-4">
                  {teglar.map((t) => <Badge key={t} variant="neutral">{t}</Badge>)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
