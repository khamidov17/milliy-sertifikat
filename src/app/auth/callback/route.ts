import { NextResponse, type NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

// Supabase recovery/OAuth kodini sessiyaga almashtiradi, so'ng `next` ga yo'naltiradi.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/dashboard";
  // Ochiq-redirect himoyasi: faqat "/xxx" ko'rinishidagi ichki manzil.
  // "//evil" va "/\evil" (brauzerlar \ ni / ga aylantiradi) rad etiladi.
  const safeNext = /^\/[^/\\]/.test(next) ? next : "/dashboard";

  if (code) {
    const sb = await supabaseServer();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${safeNext}`);
  }
  return NextResponse.redirect(`${origin}/login`);
}
