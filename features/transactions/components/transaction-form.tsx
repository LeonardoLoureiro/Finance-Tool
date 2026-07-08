"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { insertTransactionsSchema } from "@/db/schema";
import { Trash } from "lucide-react";

// easier to create own form schema for the form, 
// as the api schema has some extra fields that are not needed for the form.
const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string().max(100),
  amount: z.coerce.number(),
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
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    categoryId: null,  // fix base UI error
    ...defaultValues,
    },
  });

  useEffect(() => {
    if (!defaultValues) return;
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onFormSubmit = (values: FormValues) => {
    console.log({values});
  }

  // get label from accoutId
  // fixing issue where accountId was being displayed after selecting 
  // option.
  const getAccountLabel = (value: string) => {
    const account = accountOptions.find(option => option.value === value);
    return account?.label || value;
  };

  // get label from categoryId
  // accept undefined as well because form field value can be undefined
  const getCategoryLabel = (value: string | null | undefined) => {
    if (value == null || value === "none") return "Select a category";

    const category = categoryOptions.find((option) => option.value === value);
    return category?.label || value;
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 px-4">
      
      {/* account Field */}
      <div className="space-y-2">
        <Label htmlFor="accountId">Account</Label>

        <Controller
          control={control}
          name="accountId"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                 <SelectValue placeholder="Select an account">
                  {field.value ? getAccountLabel(field.value) : "Select an account"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent className="min-w-full">
                {accountOptions.map((account) => (
                  <SelectItem key={account.value} value={account.value}>
                    {account.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.accountId && (
          <p className="text-sm text-red-500">{errors.accountId.message}</p>
        )}
      </div>

      {/* category Field */}
      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>

        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select
              value={field.value ?? "none"}
               onValueChange={(value) => {
                field.onChange(value === "none" ? null : value);
              }}
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                 <SelectValue placeholder="Select a category">
                  { getCategoryLabel(field.value) }
                </SelectValue>
              </SelectTrigger>

              <SelectContent className="min-w-full">
                {/* This is the "No category" option */}
                <SelectItem key="none" value="none">
                  No category
                </SelectItem>

                {/* show all options saved in user account */}
                {categoryOptions.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.categoryId && (
          <p className="text-sm text-red-500">{errors.categoryId.message}</p>
        )}
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
