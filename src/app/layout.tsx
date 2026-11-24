import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ÉLIXIR HAUTE BEAUTÉ | Next-Generation Salon 2027",
  description:
    "An international luxury salon atelier. Bespoke hair couture, advanced skin aesthetics, master colorists, and personalized beauty rituals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${plusJakarta.variable} dark scroll-smooth`}
    >
      <body className="min-h-screen bg-[#111111] text-[#F8F6F2] font-sans antialiased selection:bg-[#C8A46A] selection:text-[#111111] overflow-x-hidden">
        <AuthProvider>
          <Preloader />
          <CustomCursor />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
