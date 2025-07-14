import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from '@/lib/ThemeContext';
import { LanguageProvider } from '@/lib/LanguageContext';
import BottomNavBar from '@/components/BottomNavBar';

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
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <BottomNavBar />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
