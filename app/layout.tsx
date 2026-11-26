import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCOUNDREL — Roguelike Card Game",
  description: "A faithful, atmospheric digital edition of Scoundrel by Zach Gage and Kurt Bieg (2011). 44 cards, procedural Web Audio, handcrafted engraving art.",
  keywords: ["Scoundrel", "Card Game", "Roguelike", "Zach Gage", "Kurt Bieg", "Dungeon Crawler"],
  authors: [{ name: "Zach Gage & Kurt Bieg (Original Design)" }, { name: "Antigravity Engineering" }],
  openGraph: {
    title: "SCOUNDREL — Roguelike Card Game",
    description: "44 Cards. One equipped blade. Slay the monsters or perish in the gilded depths.",
    type: "website",
  }
};

export const viewport: Viewport = {
  themeColor: "#070a10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="color-scheme" content="dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/v10-responsive.css" />
      </head>
      <body className="min-h-screen bg-[#070a10] text-[#EDE5D8] antialiased selection:bg-[#f5d378]/30 selection:text-[#f5d378]">
        {children}
        <script src="/v10-suite.js" defer></script>
      </body>
    </html>
  );
}
