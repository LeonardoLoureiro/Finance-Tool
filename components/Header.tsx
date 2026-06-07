"use client";

import { UserButton } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "./ui/navigation";
import { Menu } from "lucide-react";

export function Header() {
  const { isSignedIn } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4 h-16 border-b border-slate-200 bg-white/60 backdrop-blur">
      {/* Logo and Navigation */}
      <div className="flex items-center gap-6">
        <Link href="/">
          <div className="font-semibold text-slate-900">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} className="inline-block mr-2" />
            FinanceApp
          </div>
        </Link>
        <Navigation />
        
        {/* Burger menu - shows on mobile */}
        <button className="lg:hidden p-2">
          <Menu className="w-6 h-6 text-slate-900" />
        </button>
      </div>
      
      {/* Shows user button only IF they are signed in */}
      <div className="flex items-center gap-4">
        {isSignedIn && <UserButton />}
      </div>
    </header>
  );
}
