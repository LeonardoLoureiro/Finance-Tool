"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react"; 

import { insertCategoriesSchema } from "@/db/schema";
import { Trash } from "lucide-react";

// just use the name, since we're only adding an Category name.
const formSchema = insertCategoriesSchema.pick({
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

export const CategoryForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
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


  // when user presses submit, do this.
  const handleFormSubmit = (values: FormValues) => {
    onSubmit(values);
  }

  //  delete Category user specified.
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
          Category Name
        </Label>

        <Input
          id="name"
          placeholder="e.g. Food, Health, General, etc."
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

      {/* Using isSubmitting so to prevent user from creating multiple
          of the same Category. Since without it they can simply
          click endlessly.  */}
      <Button
        type="submit"
        className="w-full rounded-md"
        disabled={disabled || isSubmitting}
      >
        {id ? "Save Changes" : "Create Category"}
      </Button>

      {!!id && (
        <Button
          type="button"
          variant="destructive"
          className="w-full rounded-md"
          disabled={disabled || isSubmitting}
          onClick={handleDelete}
        >
          <Trash className="size-4 mr-2" />
          Delete Category 
        </Button>
      )}
    </form>
  );
};