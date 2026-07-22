import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Har so'rovda Supabase sessiyasini yangilaydi (@supabase/ssr talabi).
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // Lokal (tarmoqsiz) tekshiruv — ES256 imzo JWKS bilan tasdiqlanadi.
  const { data } = await supabase.auth.getClaims();
  const exp = (data?.claims as { exp?: number } | undefined)?.exp;
  const now = Math.floor(Date.now() / 1000);
  // Faqat token muddati yaqinlashsa (yoki yo'q bo'lsa) tarmoq orqali yangilaymiz.
  if (!exp || exp - now < 300) {
    await supabase.auth.getUser();
  }
  return response;
}
