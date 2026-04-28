import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CQT.EXE",
  description: "Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body dangerouslySetInnerHTML={{ __html: children as string }} />
    </html>
  );
}