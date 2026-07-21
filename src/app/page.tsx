import { redirect } from "next/navigation";

export default function Home() {
  // Demo: to'g'ridan-to'g'ri o'quvchi boshqaruv paneliga yo'naltiramiz.
  // Real ilovada bu yerda sessiya tekshiriladi (auth guard).
  redirect("/dashboard");
}
