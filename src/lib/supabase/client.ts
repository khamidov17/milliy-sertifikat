import { createBrowserClient } from "@supabase/ssr";

// Brauzer (klient komponent) uchun — auth UI, sessiya.
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
