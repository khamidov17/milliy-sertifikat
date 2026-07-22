// Server ishga tushganda bir marta bajariladi (Next.js instrumentation).
// Supabase'ga ulanishlarni ILIQ saqlaydi (keep-alive) — har chaqiruvda ~575ms
// TLS handshake takrorlanmaydi. Bu remote DB'ga sekin ulanishning asosiy sababi edi.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { setGlobalDispatcher, Agent } = await import("undici");
      setGlobalDispatcher(
        new Agent({
          keepAliveTimeout: 60_000,       // 60s ulanishni ochiq saqlaymiz
          keepAliveMaxTimeout: 600_000,
          connections: 128,
          pipelining: 1,
        })
      );
    } catch {
      /* undici mavjud bo'lmasa — o'tkazib yuboramiz */
    }
  }
}
