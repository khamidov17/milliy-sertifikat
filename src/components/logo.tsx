import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/dashboard" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-soft">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 2.5 3.5 6.5v5c0 5 3.6 8.4 8.5 10 4.9-1.6 8.5-5 8.5-10v-5L12 2.5Z"
            fill="currentColor"
            opacity="0.25"
          />
          <path
            d="m8.5 12 2.5 2.5 4.5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-bold tracking-tight text-foreground">Milliy Sertifikat</span>
        <span className="text-[11px] font-medium text-muted">Imtihon tayyorgarligi</span>
      </span>
    </Link>
  );
}
