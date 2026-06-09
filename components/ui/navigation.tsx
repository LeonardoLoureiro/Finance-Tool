"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NavButton } from "./nav-button";
import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMedia } from "react-use";
import { useState } from "react";
import { Menu } from "lucide-react";

const routes = [
  { label: "Home", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Accounts", href: "/accounts" },
  { label: "Categories", href: "/categories" },
  { label: "Settings", href: "/settings" },
]

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMedia("(max-width: 1024px)", false);

  const onClick = (href: string) => {
    router.push(href);
    setIsOpen(false); // close the sheet after navigation
  }

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Menu className="size-4" />
        </SheetTrigger>

        <SheetContent side="left" className="px-3 py-6 w-screen">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={route.href === pathname ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onClick(route.href)}
            >
              {route.label}
            </Button>
          ))}

        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="hidden lg:flex items-center gap-x-2 h-full">
      {routes.map((route) => (
        <NavButton
          key={route.href}
          href={route.href}
          isActive={pathname === route.href}
          label={route.label}
        />
      ))}
    </nav>
  )
}
