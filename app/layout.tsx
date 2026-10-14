import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Mono, Manrope } from "next/font/google";
import { event } from "@/content/evento";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: event.name,
  description: `${event.claim}. ${event.footerDate} en ${event.place}.`,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${manrope.variable} ${dmMono.variable} h-full`}>
      <body className="min-h-full bg-canvas font-sans text-ink antialiased">
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
