"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useCreateTransactions } from "@/features/transactions/api/use-create-transactions";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transactions";
import { z } from "zod";
import { insertTransactionsSchema } from "@/db/schema";

const formSchema = insertTransactionsSchema.pick({
  amount: true,
  payee: true,
  date: true,
  notes: true,
  accountId: true,
  categoryId: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction();
  const mutation = useCreateTransactions();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Add a new transaction to your account history.</SheetDescription>
        </SheetHeader>
        <TransactionForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            amount: 0,
            payee: "",
            date: new Date(),
            notes: "",
            accountId: "",
            categoryId: undefined,
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
