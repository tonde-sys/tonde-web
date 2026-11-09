import React from "react";
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";

import { MotionProvider } from "@/components/motion-provider";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  icons: { icon: "/icon.svg" },
  title: "TONDE — Transformer l’attente en dignité",
  description:
    "TONDE est l’infrastructure de gestion de files d’attente pensée pour les banques, hôpitaux et institutions d’Afrique de l’Est : temps réel, résilience hors ligne et cloisonnement des données.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${manrope.variable}`}>
      <body className="font-sans antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
