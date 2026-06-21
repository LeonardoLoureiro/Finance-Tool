"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "amount",
    
    // this allows to sort table by amount of transaction
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },

    // format it to money number instead of just float.
    cell: ({ row }) => {
      const num = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(num);

      return <div className="text-center front medium">{formatted}</div>
    }
  },
]