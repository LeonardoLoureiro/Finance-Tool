"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash } from "lucide-react";
import { insertTransactionsSchema } from "@/db/schema";


// easier to create own form schema for the form, 
// as the api schema has some extra fields that are not needed for the form.
const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string().max(100),
  amount: z.string(),
  notes: z.string().nullable().optional(),
});

const apiSchema = insertTransactionsSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;
type ApiValues = z.input<typeof apiSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: ApiValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  accountOptions: { label: string; value: string }[];
  categoryOptions: { label: string; value: string }[];
  onCreateAccount: (name: string) => void;
  onCreateCategory: (name: string) => void;
};

export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateAccount,
  onCreateCategory,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!defaultValues) return;
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-4">
      <div className="space-y-2">
        <Label htmlFor="payee">Payee</Label>
        <Input id="payee" placeholder="e.g. Tesco" disabled={disabled} {...register("payee")} />
        {errors.payee && <p className="text-sm text-red-500">{errors.payee.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input id="amount" type="number" placeholder="e.g. 1050" disabled={disabled} {...register("amount", { valueAsNumber: true })} />
        {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" disabled={disabled} {...register("date", { valueAsDate: true })} />
        {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="accountId">Account ID</Label>
        <Input id="accountId" placeholder="Account ID" disabled={disabled} {...register("accountId")} />
        {errors.accountId && <p className="text-sm text-red-500">{errors.accountId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Category ID</Label>
        <Input id="categoryId" placeholder="Category ID" disabled={disabled} {...register("categoryId")} />
        {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" placeholder="Optional notes" disabled={disabled} {...register("notes")} />
        {errors.notes && <p className="text-sm text-red-500">{errors.notes.message}</p>}
      </div>

      <Button type="submit" className="w-full rounded-md" disabled={disabled || isSubmitting}>
        {id ? "Save Changes" : "Create Transaction"}
      </Button>

      {!!id && (
        <Button type="button" variant="destructive" className="w-full rounded-md" disabled={disabled || isSubmitting} onClick={onDelete}>
          <Trash className="mr-2 size-4" />
          Delete Transaction
        </Button>
      )}
    </form>
  );
};
