"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveLeft } from "lucide-react";
import { UploadButton } from "./upload-button";
import { columns } from "./columns";
import { Row } from "@tanstack/react-table";

type ImportResult = {
  data: any[];
  errors: any[];
  meta: {
    total: number;
    rows: number;
  };
};

type Props = {
  data: any[];
  onCancel: () => void;
  onSubmit: () => void;
  isPending?: boolean;
  onUpload: (results: ImportResult) => void;
  importResults: ImportResult;
};

export const ImportCard = ({
  data,
  onCancel,
  onSubmit,
  isPending,
  onUpload,
  importResults,
}: Props) => {
  // Map import data to match the expected format
  const mappedData = data.map((item: any) => ({
    ...item,
    account: item.accountName,
    category: item.categoryName,
  }));

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-10 -mt-5">
      <Button
        variant="ghost"
        onClick={onCancel}
        className="mb-4"
      >
        <MoveLeft className="mr-2 h-4 w-4" />
        Back to transactions
      </Button>
      <Card>
        <CardHeader className="flex flex-col gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Import Transactions
          </CardTitle>
          {importResults.data.length > 0 && (
            <Button onClick={onSubmit} disabled={isPending}>
              {isPending ? "Importing..." : `Import ${importResults.meta.total} Transactions`}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <UploadButton onUpload={onUpload} />
          
          {data.length > 0 && (
            <div className="mt-4">
              <DataTable
                columns={columns}
                data={mappedData}
                filterKey="payee"
                disabled={isPending}
                onDelete={() => {}}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};