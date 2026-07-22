import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Faqat SERVER — service_role (RLS ni chetlab o'tadi). Savol baholash, import, admin.
// Hech qachon mijozga chiqmaydi.
//
// SINGLETON: bitta klient qayta ishlatiladi → ulanish (TLS) iliq qoladi.
// Avval har chaqiruvda yangi klient yaratilardi → har safar ~575ms TLS handshake (sekinlik).
const g = globalThis as unknown as { __sbAdmin?: SupabaseClient };

export function supabaseAdmin(): SupabaseClient {
  if (g.__sbAdmin) return g.__sbAdmin;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY yo'q (.env.local ga qo'ying)");
  g.__sbAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return g.__sbAdmin;
}
