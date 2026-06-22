import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

import { insertAccountsSchema } from "@/db/schema";
import { useEditAccount } from "@/features/accounts/api/use-edit-accounts";
import { useGetAccount } from "@/features/accounts/api/use-get-account";
import { AccountForm } from "@/features/accounts/components/account-form";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { z } from "zod";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
import { useConfirm } from "@/hooks/use-confirm";

// just use the name, since we're only adding an account name.
const formSchema = insertAccountsSchema.pick({
  name: true, 
});

type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();

  // fetch account
  const accountQuery = useGetAccount(id);

  const editMutation = useEditAccount(id);

  const isPending = editMutation.isPending;

  // while account info is fetched, show form as loading
  const isLoading = accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    // send values to db, already checked types match
    editMutation.mutate(values, {
      // once submitted successfully, close the sheet.
      onSuccess: () => {
        onClose();
      }
    });
    
  }

  const deleteMutation = useDeleteAccount(id);
  const { confirm, ConfirmDialog } = useConfirm();

  const onDelete = async () => {
    const ok = await confirm({
      title: "Delete account?",
      description: "This account will be permanently deleted. This action cannot be undone.",
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
    if (!accountQuery.data) return undefined;
    return { name: accountQuery.data.name };
  }, [accountQuery.data]);

  return (
    <>
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
              disabled={isPending || deleteMutation.isPending} 
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