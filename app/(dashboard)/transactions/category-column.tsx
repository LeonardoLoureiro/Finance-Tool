"use client";

import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { Pencil } from "lucide-react";

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
  // get edit account hook
  const { onOpen } = useOpenCategory();

  if (!category || !categoryId) {
    return <span>N/A</span>;
  } 

  return (
    <button
      // when user clicked on account column value, open editing sheet 
      onClick={() => {onOpen(categoryId)}}
      className="group flex items-center gap-1.5 text-left transition-colors hover:text-blue-600"
    >
      <span className="group-hover:underline">{category}</span>
      {/* show little pencil when hovering to show that this can be edited directly */}
      <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}