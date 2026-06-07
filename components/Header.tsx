"use client";

import { UserButton } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "./ui/navigation";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { isSignedIn } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur transition-colors duration-300">
      {/* Logo and Navigation */}
      <div className="flex items-center gap-6">
        <Link href="/">
          <div className="font-semibold text-slate-900 dark:text-white">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} className="inline-block mr-2" />
            FinanceApp
          </div>
        </Link>
        <Navigation />
        
        {/* Burger menu - shows on mobile */}
        <button className="lg:hidden p-2">
          <Menu className="w-6 h-6 text-slate-900 dark:text-white" />
        </button>
      </div>
      
      {/* Header controls - Theme toggle and User button */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {isSignedIn && <UserButton />}
      </div>
    </header>
  );
}
