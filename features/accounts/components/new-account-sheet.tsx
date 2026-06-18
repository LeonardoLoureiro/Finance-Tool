import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

import { insertAccountsSchema } from "@/db/schema";
import { AccountForm } from "@/features/accounts/components/account-form";
import { z } from "zod";
import { useCreateAccount } from "@/features/accounts/api/use-create-accounts";
import { useNewAccount } from "@/features/accounts/hooks/use-new-accounts";


// just use the name, since we're only adding an account name.
const formSchema = insertAccountsSchema.pick({
  name: true, 
});

type FormValues = z.input<typeof formSchema>;

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();

  const mutation = useCreateAccount();

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
            New Account
          </SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <AccountForm 
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