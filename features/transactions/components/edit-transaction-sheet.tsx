"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { insertTransactionsSchema } from "@/db/schema";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import { useEditTransactions } from "@/features/transactions/api/use-edit-transactions";
import { useGetTransaction } from "@/features/transactions/api/use-get-transaction";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useConfirm } from "@/hooks/use-confirm";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { z } from "zod";

const formSchema = insertTransactionsSchema.pick({
  amount: true,
  payee: true,
  date: true,
  notes: true,
  accountId: true,
  categoryId: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();

  const transactionQuery = useGetTransaction(id);
  const editMutation = useEditTransactions(id);
  const deleteMutation = useDeleteTransaction(id);
  const { confirm, ConfirmDialog } = useConfirm();

  const isLoading = transactionQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm({
      title: "Delete transaction?",
      description: "This transaction will be permanently deleted.",
    });

    if (!ok) return;

    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = useMemo(() => {
    if (!transactionQuery.data) return undefined;
    return {
      amount: transactionQuery.data.amount,
      payee: transactionQuery.data.payee,
      date: transactionQuery.data.date,
      notes: transactionQuery.data.notes ?? "",
      accountId: transactionQuery.data.accountId,
      categoryId: transactionQuery.data.categoryId ?? undefined,
    };
  }, [transactionQuery.data]);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Transaction</SheetTitle>
            <SheetDescription>Edit the transaction details.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
      {ConfirmDialog}
    </>
  );
};
