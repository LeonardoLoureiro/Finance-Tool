"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavButton } from "./nav-button";

const routes = [
  { label: "Home", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Accounts", href: "/accounts" },
  { label: "Categories", href: "/categories" },
  { label: "Settings", href: "/settings" },
]

export const Navigation = () => {
  const pathname = usePathname();

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
