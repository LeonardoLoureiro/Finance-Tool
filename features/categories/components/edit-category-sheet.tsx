import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

import { insertCategoriesSchema } from "@/db/schema";
import { useDeleteCategory } from "@/features/categories/api/use-delete-categories";
import { useEditCategory } from "@/features/categories/api/use-edit-categories";
import { useGetCategory } from "@/features/categories/api/use-get-categorie";
import { CategoryForm } from "@/features/categories/components/category-form";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { useConfirm } from "@/hooks/use-confirm";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { z } from "zod";

// just use the name, since we're only adding an Category name.
const formSchema = insertCategoriesSchema.pick({
  name: true, 
});

type FormValues = z.input<typeof formSchema>;

export const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory();

  // fetch Category
  const CategoryQuery = useGetCategory(id);

  const editMutation = useEditCategory(id);

  // while Category info is fetched, show form as loading
  const isLoading = CategoryQuery.isLoading;

  const queryClient = useQueryClient();
  const onSubmit = (values: FormValues) => {
    // send values to db, already checked types match
    editMutation.mutate(values, {
      // once submitted successfully, close the sheet.
      onSuccess: () => {
        // invalidate queries to refresh data on table
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
        onClose();
      }
    });
    
  }

  const deleteMutation = useDeleteCategory(id);
  const { confirm, ConfirmDialog } = useConfirm();

  const onDelete = async () => {
    const ok = await confirm({
      title: "Delete Category?",
      description: "This Category will be permanently deleted. This action cannot be undone.",
    });

    if (!ok) return;

    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  // has data returned anything? If not then set it to empty.
  const defaultValues = useMemo(() => {
    if (!CategoryQuery.data) return undefined;
    return { name: CategoryQuery.data.name };
  }, [CategoryQuery.data]);


  // prevent spam delete button.
  const isPending = 
    editMutation.isPending || deleteMutation.isPending;

  return (
    <>
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>
            Category
          </SheetTitle>
          <SheetDescription>
            Edit your Category to track your transactions.
          </SheetDescription>
        </SheetHeader>
        {isLoading
          ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <CategoryForm
              id={id}
              onSubmit={onSubmit} 
              disabled={isPending} 
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )
        }
      </SheetContent>
    </Sheet>
    {ConfirmDialog}
    </>

  )
}