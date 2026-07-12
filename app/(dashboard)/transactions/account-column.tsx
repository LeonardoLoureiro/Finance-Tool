"use client";

import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { Pencil } from "lucide-react";

type Props ={
  id: string,
  account: string,
  accountId: string
}

export const AccountColumn = ({
  id,
  account,
  accountId,
}: Props) => {
  // get edit account hook
  const { onOpen } = useOpenAccount();

  return (
    <button
      // when user clicked on account column value, open editing sheet 
      onClick={() => {onOpen(accountId)}}
      className="group flex items-center gap-1.5 text-left transition-colors hover:text-blue-600"
    >
      <span className="group-hover:underline">{account}</span>
      {/* show little pencil when hovering to show that this can be edited directly */}
      <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}