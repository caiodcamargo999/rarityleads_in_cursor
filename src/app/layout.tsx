import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rarity Leads",
  description: "AI-powered B2B lead generation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-main-bg text-primary-text font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
