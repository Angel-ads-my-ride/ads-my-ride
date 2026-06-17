import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Ads My Ride — Transformez votre voiture en panneau publicitaire",
  description:
    "Gagnez de l'argent en affichant des publicités sur votre voiture. Choisissez une campagne, posez le covering chez un partenaire, et touchez vos gains.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
