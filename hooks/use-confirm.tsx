"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmOptions {
  title?: string;
  description?: string;
}

export function useConfirm() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [resolveRef, setResolveRef] = React.useState<
    ((value: boolean) => void) | null
  >(null);

  const [options, setOptions] = React.useState<ConfirmOptions>({
    title: "Are you sure?",
    description: "This action cannot be undone.",
  });

  const confirm = (opts?: ConfirmOptions) => {
    setOptions({
      title: opts?.title ?? "Are you sure?",
      description: opts?.description ?? "This action cannot be undone.",
    });

    setOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolveRef(() => resolve);
    });
  };

  const handleClose = () => {
    setOpen(false);
    resolveRef?.(false);
  };

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 100)); // optional safety delay
    resolveRef?.(true);
    setLoading(false);
    setOpen(false);
  };

  const ConfirmDialog = (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{options.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {options.description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction onClick={handleConfirm} disabled={loading}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { confirm, ConfirmDialog };
}