import { Button } from "@base-ui/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  label: string;
  isActive?: boolean;
  
};

export const NavButton = ({ href, label, isActive }: Props) => {
  return (
    <Button>
      <Link href={href} className={cn(
        "px-3 py-2 rounded-md font-medium transition-all duration-300 ease-in-out",
        "transform hover:scale-105",
        isActive 
          ? "bg-blue-50 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
          : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-slate-800 hover:shadow-md dark:shadow-sm"
      )}>
        {label}
      </Link>
    </Button>
  )
;}
