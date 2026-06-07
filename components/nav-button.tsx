import { Button } from "@base-ui/react";
import Link from "next/link";

type Props = {
  href: string;
  label: string;
  isActive?: boolean;
  
};

export const NavButton = ({ href, label, isActive }: Props) => {
  return (
    <Button>
      <Link href={href} className={`px-3 py-2 rounded-md transition-colors font-medium
      ${isActive ? "bg-blue-50 text-slate-900" : "bg-white text-slate-800 hover:bg-blue-50"}`}>
        {label}
      </Link>
    </Button>
  )
;}