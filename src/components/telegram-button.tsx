import { cn } from "@/lib/utils";

// Telegram Login — hozircha ko'rgazma (stub). Backend ulanganda
// Telegram Login Widget yoki OAuth verify shu tugmaga bog'lanadi.
export function TelegramButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-11 w-full items-center justify-center gap-2.5 rounded-xl bg-[#28A8E9] text-sm font-medium text-white shadow-soft transition-all duration-200 hover:bg-[#1f97d4] active:scale-[0.98]",
        className
      )}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M11.94 2.5C6.7 2.5 2.44 6.76 2.44 12s4.26 9.5 9.5 9.5 9.5-4.26 9.5-9.5-4.26-9.5-9.5-9.5Zm4.4 6.47-1.47 6.96c-.11.49-.4.61-.81.38l-2.24-1.65-1.08 1.04c-.12.12-.22.22-.45.22l.16-2.28 4.15-3.75c.18-.16-.04-.25-.28-.09l-5.13 3.23-2.21-.69c-.48-.15-.49-.48.1-.71l8.63-3.33c.4-.15.75.09.62.68Z" />
      </svg>
      Telegram orqali kirish
    </button>
  );
}
