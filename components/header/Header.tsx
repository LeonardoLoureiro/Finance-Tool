"use client";

import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "@/components/ui/navigation";
import { Loader2, Menu } from "lucide-react";
import { ThemeToggle } from "../layout/ThemeToggle";

export function Header() {
  const { isSignedIn, isLoaded } = useAuth();

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

        {/* Navigation links which only show if user is signed in */}
        {isSignedIn && <Navigation />}
        
      </div>
      
      {/* Header controls - Theme toggle and User button */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {isLoaded ? 
          <UserButton /> : 
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        }        
      </div>
    </header>
  );
}
