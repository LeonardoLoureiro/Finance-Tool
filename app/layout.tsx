import { Header } from "@/components/header/Header";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/query-provider";
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { SheetProvider } from "@/providers/sheet-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finance Tool",
  description: "A tool to help you manage your finances and track your expenses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ThemeProvider>
        <html
          lang="en"
          className={cn(
            "h-full",
            "antialiased",
            geistSans.variable,
            geistMono.variable,
            "font-sans",
            inter.variable
          )}
        >
          <body className="min-h-full flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
            <Header />

            <QueryProvider>
              <SheetProvider />
              {children}
            </QueryProvider>
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  );
}