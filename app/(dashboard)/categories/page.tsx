"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete";
import { useGetCategories } from "@/features/categories/api/user-get-categories";
import { useNewCategory } from "@/features/categories/hooks/use-new-categories";
import { useConfirm } from "@/hooks/use-confirm";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";


const CategoriesPage = () => {
  // you sure you want to delete?
  const { confirm, ConfirmDialog } = useConfirm(); 

  const newCategory = useNewCategory();

  // delete categories
  const deleteCategories = useBulkDeleteCategories();

  // get categories
  const categoriesQuery = useGetCategories();
  const categories = categoriesQuery.data || [];

  // disable delete while things are loading/fetching
  const disabled = categoriesQuery.isLoading || deleteCategories.isPending;


  // while page is loading, show spinning/skeleton
  if (categoriesQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 pb-10 -mt-5">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="flex flex-col gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return(
    <div className="mx-auto w-full max-w-7xl px-4 pb-10 -mt-5">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="flex flex-col gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Categories Page
          </CardTitle>

          <Button size="sm" className="w-full lg:w-auto"
            onClick={newCategory.onOpen}>
            <Plus className="size-4 mr-2"/>
            Add new
          </Button>
        </CardHeader>

        <CardContent>
          <DataTable 
            columns={columns} 
            data={categories} 
            filterKey="name"
            onDelete={async (rows) => {
              // confirm with user they want to delete
              const ok = await confirm({
                title: "Delete categories?",
                description: `This will delete ${rows.length} category(s). This cannot be undone.`,
              });

              if (!ok) return;

              const ids = rows.map((r) => r.original.id);
              deleteCategories.mutate({ ids });
            }}
            disabled={disabled}
          />
        </CardContent>

        {/* Are you SURE you want to delete these categories? */}
        {ConfirmDialog}

      </Card>
    </div>
  );
}

export default CategoriesPage;