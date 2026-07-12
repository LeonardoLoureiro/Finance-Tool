"use client";

import { AccountColumn } from "@/app/(dashboard)/transactions/account-column";
import { CategoryColumn } from "@/app/(dashboard)/transactions/category-column";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { client } from "@/lib/hono";
import { cn, convertAmountFromMilliUnits } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { InferResponseType } from "hono";
import { ArrowUpDown } from "lucide-react";
import { Actions } from "./actions";

export type ResponseType = InferResponseType<typeof client.api.transactions.$get, 200>["data"][0];

export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select",
    size: 32,
    minSize: 32,
    maxSize: 32,
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <div className="flex w-8 justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex w-8 justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          />
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{new Date(row.original.date).toLocaleDateString()}</span>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = row.original.amount;
      const isIncome = amount > 0;
      const isExpense = amount < 0;
      
      return <span className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-mono font-medium",
        isIncome && "bg-emerald-100 text-emerald-700",
        isExpense && "bg-rose-100 text-rose-700",
        amount === 0 && "bg-gray-100 text-gray-700"
      )}>
        {convertAmountFromMilliUnits(amount)}
      </span>;
    },
  },
  {
    accessorKey: "payee",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Payee
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "account",
    header: "Account",
    // simply return custom code wich handles the hook imports
    // just need to pass values
    cell: ({ row }) => <AccountColumn
        id={row.original.id}
        account={row.original.account} 
        accountId={row.original.accountId} 
      />,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <CategoryColumn
        id={row.original.id}
        category={row.original.category} 
        categoryId={row.original.categoryId} 
      />,
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
];
