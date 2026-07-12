"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { DatePicker } from "@/components/date-picker";
import { Select } from "@/components/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AmountInput } from "@/components/amount-input";
import { insertTransactionsSchema } from "@/db/schema";
import { Trash } from "lucide-react";
import { convertAmountToMilliUnits } from "@/lib/utils";

// easier to create own form schema for the form, 
// as the api schema has some extra fields that are not needed for the form.
const formSchema = z.object({
  date: z.coerce.date({
    error: "Date is required",
  }),
  accountId: z.string().min(1, "Please select an account"),
  categoryId: z.string().nullable().optional(),
  payee: z.string().min(1, "Payee is required").max(100, "Payee is too long"),
  amount: z.coerce.number({
    error: "Amount is required",
  }).refine((val) => val !== 0, {
    message: "Amount cannot be zero",
  }),
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
    amount: 0,
    categoryId: null,  // fix base UI error
    ...defaultValues,
    },
  });

  useEffect(() => {
    if (!defaultValues) return;
    reset(defaultValues);
  }, [defaultValues, reset]);

  // finally, when pressing submit send to server
  const onFormSubmit = (values: FormValues) => {
    const amount = Number(values.amount) || 0;
    const milliUnitsAmount = convertAmountToMilliUnits(amount);
    
    // convert ot submitable vals
    const apiValues: ApiValues = {
      ...values,
      amount: milliUnitsAmount, // already in milliunits
    };
    
    onSubmit(apiValues);
  }

  // Add this inside your TransactionForm component, before the return statement
  const isFutureDate = (date: Date) => {
    const today = new Date();

    // Create a date for tomorrow to compare
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return date > tomorrow;
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 px-4">
      
      {/* date field */}
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Controller
          control={control}
          name="date"
          render={({ field }) => {
            const isFuture = field.value instanceof Date  && isFutureDate(field.value);
            
            return (
              <>
                <DatePicker
                  value={field.value as Date | undefined}
                  onChange={field.onChange}
                  disabled={disabled}
                  placeholder="Select a date"
                  className={isFuture ? "border-yellow-400" : ""}
                />
                {isFuture && (
                  <div className="mt-1 px-3 py-1.5 rounded-md bg-yellow-50 border border-yellow-200">
                    <p className="text-xs text-yellow-700 flex items-center gap-1.5">
                      <span className="text-sm">📅</span>
                      Future transaction - this will appear in upcoming budgets
                    </p>
                  </div>
                )}
              </>
            );
          }}
        />

        {errors.date && (
          <p className="text-xs text-red-400 mt-0.5">{errors.date.message}</p>
        )}
      </div>

      {/* account Field */}
      <div className="space-y-2">
        <Label htmlFor="accountId">Account</Label>
        <Controller
          control={control}
          name="accountId"
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              options={accountOptions}
              disabled={disabled}
              placeholder="Select an account"
              onCreate={onCreateAccount}
            />
          )}
        />
        {errors.accountId && (
          <p className="text-xs text-red-400 mt-0.5">{errors.accountId.message}</p>
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
              value={field.value}
              onChange={field.onChange}
              options={categoryOptions}
              disabled={disabled}
              placeholder="Select a category"
              onCreate={onCreateCategory}
            />
          )}
        />
        {errors.categoryId && (
          <p className="text-xs text-red-400 mt-0.5">{errors.categoryId.message}</p>
        )}
      </div>

      {/* payee Field */}
      <div className="space-y-2">
        <Label htmlFor="payee">Payee</Label>
        <Input
          id="payee"
          placeholder="e.g., Starbucks, Rent, Salary"
          disabled={disabled}
          {...register("payee")}
        />
        {errors.payee && (
          <p className="text-xs text-red-400 mt-0.5">{errors.payee.message}</p>
        )}
      </div>

      {/* amount Field */}
      <div className="space-y-2">
        <Label htmlFor="amount">
          Amount
          <span className="ml-2 text-sm text-muted-foreground">
            (Use + for income, - for expenses)
          </span>
        </Label>
        
        <Controller
          control={control}
          name="amount"
          render={({ field }) => {
            // Convert milliunits to pounds for display
            // Convert to display value - show empty when 0 or undefined
            const displayValue = field.value && field.value !== 0 
                    ? field.value.toString() 
                    : "";

            return (
              <AmountInput
                value={displayValue}
                onChange={(value) => {
                  const numValue = parseFloat(value || "0");
                  field.onChange(numValue);
                }}
                disabled={disabled}
                placeholder="0.00"
              />
            );
          }}
        />

        {errors.amount && (
          <p className="text-xs text-red-400 mt-0.5">{errors.amount.message}</p>
        )}
      </div>

      {/* notes Field */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add any additional notes..."
          disabled={disabled}
          className="resize-none"
          {...register("notes")}
        />
        {errors.notes && (
          <p className="text-xs text-red-400 mt-0.5">{errors.notes.message}</p>
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
