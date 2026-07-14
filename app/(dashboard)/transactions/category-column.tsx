"use client";

import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { Pencil, Plus, Triangle } from "lucide-react";

type Props ={
  id: string,
  category: string | null,
  categoryId: string | null
}

export const CategoryColumn = ({
  id,
  category,
  categoryId,
}: Props) => {
  const { onOpen: onOpenCategory } = useOpenCategory();
  const { onOpen: onOpenTransaction } = useOpenTransaction();

  // if no category, offer to add one
  if (!category || !categoryId) {
    return (
      <button
        onClick={() => onOpenTransaction(id)}
        className="text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
      >
        <Triangle className="h-3 w-3" />
        <span>Uncategorised</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => onOpenCategory(categoryId!)}
      className="group flex items-center gap-1.5 text-left transition-colors hover:text-blue-600"
    >
      <span className="group-hover:underline">{category}</span>
      <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};