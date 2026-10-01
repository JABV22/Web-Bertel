import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/**
 * Inter es la tipografía verificada de la marca (docs/DISENO.md §1).
 * Se carga con next/font para evitar peticiones a terceros en tiempo de render.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Preicfés Bertel — Preparación Saber 11",
    template: "%s · Preicfés Bertel",
  },
  description:
    "Preparación para las pruebas Saber: estudia, practica y comprende tus resultados.",
  // PRD §53: solo las páginas públicas se indexan. Campus, admin y login no.
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
