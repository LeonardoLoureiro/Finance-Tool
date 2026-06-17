"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { insertAccountsSchema } from "@/db/schema";

const formSchema = insertAccountsSchema.pick({
  name: true, 
});

type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // when user presses submit, do this.
  const handleFormSubmit = (values: FormValues) => {
    console.log({ values })
  }

  // 
  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 px-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name">
          Account Name
        </Label>

        <Input
          id="name"
          placeholder="e.g. Cash, Bank, Credit Card"
          className="rounded-md"
          disabled={disabled}
          {...register("name")}
        />

        {errors.name && (
          <p className="text-sm text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full rounded-md"
        disabled={disabled || isSubmitting}
      >
        {id ? "Save Changes" : "Create Account"}
      </Button>

      {id && (
        <Button
          type="button"
          variant="destructive"
          className="w-full rounded-md"
          disabled={disabled || isSubmitting}
          onClick={handleDelete}
        >
          Delete Account
        </Button>
      )}
    </form>
  );
};