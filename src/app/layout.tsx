import type { Metadata, Viewport } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Milliy Sertifikat — Imtihonga tayyorgarlik platformasi",
  description:
    "O'zbekiston Milliy sertifikat imtihonlariga tayyorlaning. Minglab savollar, sinov imtihonlari va real vaqtdagi reyting.",
  applicationName: "Milliy Sertifikat",
};

export const viewport: Viewport = {
  themeColor: "#F8F4EA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
