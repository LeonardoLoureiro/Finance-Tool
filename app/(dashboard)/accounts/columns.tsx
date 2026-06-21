"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

    header: ({ column }) => {
      return (
        <div className="flex items-center gap-2 min-w-[220px]">
          
          <div className="text-sm font-medium whitespace-nowrap">
            Account
          </div>

          <Input
            placeholder="Filter..."
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(e) => column.setFilterValue(e.target.value)}
            className="h-8 text-xs w-32"
          />
        </div>
      );
    },

    filterFn: "includesString",
  },
  {
    accessorKey: "amount",
    // filter out amounts to match what user wants (min-max)
    filterFn: (row, columnId, filterValue: any) => {
      const value = row.getValue<number>(columnId);

      if (!filterValue) return true;

      if (filterValue.min !== undefined && value < filterValue.min) return false;
      if (filterValue.max !== undefined && value > filterValue.max) return false;

      return true;
    },
    
    // this allows to sort table by amount of transaction
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-2 min-w-[260px]">
          
          {/* label + sort */}
          <Button
            variant="ghost"
            className="p-0 h-auto font-medium whitespace-nowrap"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Amount
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>

          {/* filters inline */}
          <Input
            placeholder="Min"
            type="number"
            value={(column.getFilterValue() as any)?.min ?? ""}
            onChange={(e) => {
              const current = (column.getFilterValue() as any) || {};

              column.setFilterValue({
                ...current,
                min: e.target.value ? Number(e.target.value) : undefined,
              });
            }}
            className="h-8 text-xs w-16"
          />

          <span className="text-xs text-muted-foreground">-</span>

          <Input
            placeholder="Max"
            type="number"
            value={(column.getFilterValue() as any)?.max ?? ""}
            onChange={(e) => {
              const current = (column.getFilterValue() as any) || {};

              column.setFilterValue({
                ...current,
                max: e.target.value ? Number(e.target.value) : undefined,
              });
            }}
            className="h-8 text-xs w-16"
          />
        </div>
      );
    },

    // format it to money number instead of just float.
    cell: ({ row }) => {
      // convert str to float
      const num = parseFloat(row.getValue("amount"));

      // format it into "currency" but more specifically GBP
      const formatted = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(num);

      return <div className="text-center front medium">{formatted}</div>
    }
  },
]