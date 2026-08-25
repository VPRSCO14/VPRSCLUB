import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HexField from "@/components/HexField";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "VPRS.CO",
  description: "Disenado para descubrir.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${spaceGrotesk.variable} ${inter.variable} antialiased bg-vprs-white text-vprs-black`}>
        <HexField />
        <div className="relative z-10">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
