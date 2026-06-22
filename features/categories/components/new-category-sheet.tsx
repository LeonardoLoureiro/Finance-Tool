import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

import { insertCategorysSchema } from "@/db/schema";
import { CategoryForm } from "@/features/Categorys/components/Category-form";
import { z } from "zod";
import { useCreateCategory } from "@/features/Categorys/api/use-create-Categorys";
import { useNewCategory } from "@/features/Categorys/hooks/use-new-Categorys";


// just use the name, since we're only adding an Category name.
const formSchema = insertCategorysSchema.pick({
  name: true, 
});

type FormValues = z.input<typeof formSchema>;

export const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory();

  const mutation = useCreateCategory();

  const onSubmit = (values: FormValues) => {
    // send values to db, already checked types match
    mutation.mutate(values, {
      // once submitted successfully, close the sheet.
      onSuccess: () => {
        onClose();
      }
    });
    
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>
            New Category
          </SheetTitle>
          <SheetDescription>
            Create a new Category to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <CategoryForm 
          onSubmit={onSubmit} 
          disabled={mutation.isPending} 
          defaultValues={{
            name: "",
          }}
        />
      </SheetContent>
    </Sheet>
  )
}