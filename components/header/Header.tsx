// components/header.tsx
"use client";

import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs';
import { WelcomeMsg } from '@/components/welcome-msg';
import { useAuth } from '@clerk/nextjs';
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "@/components/ui/navigation";
import { Loader2 } from "lucide-react";
import { ThemeToggle } from "../layout/ThemeToggle";
import { usePathname } from 'next/navigation';

export function Header() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  
  // only show welcome message on dashboard
  const showWelcome = isSignedIn && pathname === '/';

  return (
    <div className="relative pb-6">
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300 sticky top-0 z-50">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center">
              <Image 
                src="/logo.svg" 
                alt="Logo" 
                width={32} 
                height={32} 
                className="inline-block mr-2" 
              />
              <span className="hidden sm:inline">FinanceApp</span>
            </div>
          </Link>

          {/* navigation links which only show if user is signed in */}
          {isSignedIn && <Navigation />}
        </div>
        
        {/* header controls - Theme toggle and User button */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          {isLoaded ? 
            <UserButton /> : 
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          }        
        </div>
      </header>
      
      {/* welcome Message - only show on dashboard */}
      {showWelcome && (
        <div className="px-6 py-6 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <WelcomeMsg />
        </div>
      )}

      {/* add consistent bottom padding for all pages */}
      <div className="h-4" />
    </div>
  );
}