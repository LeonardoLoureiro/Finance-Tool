"use client";

import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { Edit, MoreHorizontal } from "lucide-react";

type Props = {
  id: string;
};

export const Actions = ({id}: Props) => {
  const { onOpen } = useOpenAccount();
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={false}
            onClick={() => {onOpen(id)}}>
            <Edit />
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}