import { Logo } from "@/components/logo";
import { CheckCircle2 } from "lucide-react";

const afzalliklar = [
  "10 000+ dan ortiq sinovdan o'tgan savollar",
  "Rasmiy formatdagi sinov imtihonlari",
  "Har bir mavzu bo'yicha o'zlashtirish tahlili",
  "Real vaqtdagi reyting va yutuqlar",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Chap panel — brend / afzalliklar */}
      <div className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 60%, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative">
          <Logo href="/dashboard" className="[&_span]:text-white [&_.text-muted]:text-white/70" />
        </div>

        <div className="relative max-w-md space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-tight text-white text-balance">
              Milliy sertifikatga ishonch bilan tayyorlaning
            </h2>
            <p className="text-[15px] leading-relaxed text-white/75">
              Minglab o'quvchilar biz bilan birga imtihonga tayyorlanmoqda. Har kuni mashq qiling,
              natijalaringizni kuzating va maqsadingizga eriching.
            </p>
          </div>
          <ul className="space-y-3">
            {afzalliklar.map((a) => (
              <li key={a} className="flex items-center gap-3 text-sm text-white/90">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                {a}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-6 text-white/70">
          <div>
            <p className="text-2xl font-bold text-white">50k+</p>
            <p className="text-xs">O'quvchilar</p>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div>
            <p className="text-2xl font-bold text-white">12k+</p>
            <p className="text-xs">Savollar</p>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div>
            <p className="text-2xl font-bold text-white">7</p>
            <p className="text-xs">Fanlar</p>
          </div>
        </div>
      </div>

      {/* O'ng panel — forma */}
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 sm:px-6">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
