"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useNewAccount } from "@/features/accounts/hooks/use-new-accounts";
import { Plus } from "lucide-react";
import { columns, Payment } from "./columns";
import { DataTable } from "@/components/data-table";


// TODO:
//  will implement API fetch later on
function getData(): Payment[] {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ]
}


// mock data to test out some features
export const mockPayments: Payment[] = [
  {
    id: "a1b2c3d4",
    amount: 120,
    status: "pending",
    email: "alice@example.com",
  },
  {
    id: "b2c3d4e5",
    amount: 450,
    status: "success",
    email: "bob@example.com",
  },
  {
    id: "c3d4e5f6",
    amount: 75,
    status: "failed",
    email: "carol@example.com",
  },
  {
    id: "d4e5f6g7",
    amount: 980,
    status: "success",
    email: "david@example.com",
  },
  {
    id: "e5f6g7h8",
    amount: 230,
    status: "pending",
    email: "emma@example.com",
  },
  {
    id: "f6g7h8i9",
    amount: 610,
    status: "success",
    email: "frank@example.com",
  },
  {
    id: "g7h8i9j0",
    amount: 340,
    status: "failed",
    email: "grace@example.com",
  },
  {
    id: "h8i9j0k1",
    amount: 150,
    status: "pending",
    email: "hannah@example.com",
  },
  {
    id: "i9j0k1l2",
    amount: 890,
    status: "success",
    email: "ian@example.com",
  },
  {
    id: "j0k1l2m3",
    amount: 60,
    status: "failed",
    email: "julia@example.com",
  },
];


const AccountsPage = () => {
  const newAccount = useNewAccount();
  const data = mockPayments;

  return(
    <div className="mx-auto w-full max-w-7xl px-4 pb-10 -mt-5">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="flex flex-col gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Account Page
          </CardTitle>

          <Button size="sm" className="w-full lg:w-auto"
            onClick={newAccount.onOpen}>
            <Plus className="size-4 mr-2"/>
            Add new
          </Button>
        </CardHeader>

        <CardContent>
          <DataTable columns={columns} data={data} filterKey="email" />
        </CardContent>

      </Card>
    </div>
  );
}

export default AccountsPage;