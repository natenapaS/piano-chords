import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "คอร์ดเปียโน | Piano Chords", description: "Interactive piano chord explorer" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body>{children}</body></html>;
}
