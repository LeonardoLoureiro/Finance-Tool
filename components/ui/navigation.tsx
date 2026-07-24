"use client";

import { usePathname, useRouter } from "next/navigation";
import { NavButton } from "./nav-button";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMedia } from "react-use";
import { useState } from "react";
import { 
  Menu, 
  Home, 
  Receipt, 
  Wallet, 
  Tag, 
  Settings 
} from "lucide-react";

const routes = [
  { label: "Home", href: "/", icon: Home },
  { label: "Transactions", href: "/transactions", icon: Receipt },
  { label: "Accounts", href: "/accounts", icon: Wallet },
  { label: "Categories", href: "/categories", icon: Tag },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMedia("(max-width: 1024px)", false);

  const onClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <>
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="size-5" />
        </Button>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left" className="px-3 py-6 w-[280px]">
            <div className="flex flex-col gap-2">
              {routes.map((route) => {
                const Icon = route.icon;
                const isActive = route.href === pathname;
                return (
                  <Button
                    key={route.href}
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3"
                    onClick={() => onClick(route.href)}
                  >
                    <Icon className="h-4 w-4" />
                    {route.label}
                  </Button>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </>
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
  );
};