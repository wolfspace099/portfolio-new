import "./globals.css";
import type { Metadata } from "next";
import Shell from "./components/Shell";

export const metadata: Metadata = {
  title: "CQT.EXE",
  description: "Portfolio — Minecraft plugins, web dev, DevOps",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
