"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { client } from "@/lib/hono";
import { ColumnDef } from "@tanstack/react-table";
import { InferResponseType } from "hono";
import { ArrowUpDown } from "lucide-react";
import { Actions } from "./actions";
import { convertAmountFromMilliUnits } from "@/lib/utils";

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
    accessorKey: "amount",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = row.original.amount;
      return <span className="font-mono">{convertAmountFromMilliUnits(amount)}</span>;
    },
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
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
];
