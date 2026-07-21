import "./globals.css";
import "./desktop.css";
import type { Metadata } from "next";
import { APPEARANCE_INIT_SCRIPT } from "@/lib/appearance";

export const metadata: Metadata = {
  title: "Cqt — Full-Stack & Minecraft Developer",
  description: "Full-stack developer building Minecraft plugins, web apps and tooling. Available for freelance and full-time work.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: APPEARANCE_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
