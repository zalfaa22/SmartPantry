import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartPantry",
  description: "Manajemen persediaan bahan pangan dan rekomendasi resep berbasis AI."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
