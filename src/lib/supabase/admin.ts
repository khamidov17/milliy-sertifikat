import "server-only";
import { createClient } from "@supabase/supabase-js";

// Faqat SERVER — service_role (RLS ni chetlab o'tadi). Savol baholash, import, admin.
// Hech qachon mijozga chiqmaydi.
export function supabaseAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY yo'q (.env.local ga qo'ying)");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
