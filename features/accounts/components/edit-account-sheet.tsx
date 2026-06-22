import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

import { insertAccountsSchema } from "@/db/schema";
import { useCreateAccount } from "@/features/accounts/api/use-create-accounts";
import { AccountForm } from "@/features/accounts/components/account-form";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { z } from "zod";
import { useGetAccount } from "../api/use-get-account";
import { Loader2 } from "lucide-react";


// just use the name, since we're only adding an account name.
const formSchema = insertAccountsSchema.pick({
  name: true, 
});

type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();

  // fetch account
  const accountQuery = useGetAccount(id);

  // while account info is fetched, show form as loading
  const isLoading = accountQuery.isLoading;
 
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

  // has data returned anything? If not then set it to empty.
  const defaultValues = accountQuery.data ? {
    name: accountQuery.data.name
  } : {
    name: ""
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>
            Account
          </SheetTitle>
          <SheetDescription>
            Edit your account to track your transactions.
          </SheetDescription>
        </SheetHeader>
        {isLoading
          ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <AccountForm 
              id={id}
              onSubmit={onSubmit} 
              disabled={mutation.isPending} 
              defaultValues={defaultValues}
            />
          )
        }
      </SheetContent>
    </Sheet>
  )
}