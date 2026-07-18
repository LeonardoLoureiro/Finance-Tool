"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transactions";
import { useConfirm } from "@/hooks/use-confirm";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { columns } from "./columns";
import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT"
}

type ImportResult = {
  data: any[];
  errors: any[];
  meta: {
    total: number;
    rows: number;
  };
};

const INITIAL_IMPORT_RESULTS: ImportResult = {
  data: [],
  errors: [],
  meta: {
    total: 0,
    rows: 0,
  },
};

const TransactionsPage = () => {
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState<ImportResult>(INITIAL_IMPORT_RESULTS);

  const { confirm, ConfirmDialog } = useConfirm();
  const newTransaction = useNewTransaction();
  const deleteTransactions = useBulkDeleteTransactions();
  const transactionsQuery = useGetTransactions();
  const bulkCreate = useBulkCreateTransactions();
  
  const transactions = transactionsQuery.data || [];
  const disabled = transactionsQuery.isLoading || deleteTransactions.isPending;

  const onUpload = (results: ImportResult) => {
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setVariant(VARIANTS.LIST);
    setImportResults(INITIAL_IMPORT_RESULTS);
  };

  const onSubmitImport = () => {
    bulkCreate.mutate(importResults.data, {
      onSuccess: () => {
        setVariant(VARIANTS.LIST);
        setImportResults(INITIAL_IMPORT_RESULTS);
      },
    });
  };

  if (transactionsQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 pb-10 -mt-5">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-125 w-full flex items-center justify-center">
              <Loader2 className="size-6 animate-spin text-slate-300" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <ImportCard
        data={importResults.data}
        onCancel={onCancelImport}
        onSubmit={onSubmitImport}
        isPending={bulkCreate.isPending}
        onUpload={onUpload}
        importResults={importResults}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-10 -mt-5">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transactions History
          </CardTitle>

          <div className="flex flex-col gap-2 w-full sm:flex-row lg:w-auto">
            <UploadButton onUpload={onUpload} />
            <Button size="sm" className="w-full sm:w-auto" onClick={newTransaction.onOpen}>
              <Plus className="mr-2 size-4" />
              Add new
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <DataTable
            columns={columns}
            data={transactions}
            filterKey="payee"
            onDelete={async (rows) => {
              const ok = await confirm({
                title: "Delete transactions?",
                description: `This will delete ${rows.length} transaction(s). This cannot be undone.`,
              });

              if (!ok) return;

              const ids = rows.map((row) => row.original.id);
              deleteTransactions.mutate({ ids });
            }}
            disabled={disabled}
          />
        </CardContent>

        {ConfirmDialog}
      </Card>
    </div>
  );
};

export default TransactionsPage;