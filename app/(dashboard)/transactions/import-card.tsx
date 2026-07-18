"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveLeft } from "lucide-react";
import { useState } from "react";
import { ImportTable } from "./import-table";
import { UploadButton } from "./upload-button";

type ImportResult = {
  data: any[];
  errors: any[];
  meta: {
    total: number;
    rows: number;
  };
};

interface SelectedColumnsState {
  [key: string]: string | null;
}

type Props = {
  data: any[];
  onCancel: () => void;
  onSubmit: (data: any[]) => void;
  isPending?: boolean;
  onUpload: (results: ImportResult) => void;
  importResults: ImportResult;
};

// column options for mapping
const columnOptions = [
  "amount",
  "payee",
  "date",
  "category",
  "account",
  "notes",
];

// when import data, AT LEAST these MUST be present
const requiredColumns = [
  "amount",
  "payee",
  "date",
  "account",
]

export const ImportCard = ({
  data,
  onCancel,
  onSubmit,
  isPending,
  onUpload,
  importResults,
}: Props) => {
  // State for column mapping
  const [selectColumns, setSelectColumns] = useState<SelectedColumnsState>({});

  const originalHeaders =
    data.length > 0 ? Object.keys(data[0]) : [];
  
  // process which header to show
  const displayHeaders = originalHeaders.map((header, index) => {
    const selected = selectColumns[`column_${index}`];

    return selected ?? "Skip";
  });

  // what to show on the rows of the table itself
  const displayBody = data.map((row) => {
    return originalHeaders.map((_, columnIndex) => {

      const selectedColumn =
        selectColumns[`column_${columnIndex}`];

      if (!selectedColumn) {
        return "";
      }

      const sourceIndex = originalHeaders.findIndex(
        (header) =>
          header.toLowerCase() === selectedColumn.toLowerCase()
      );

      return String(
        row[originalHeaders[sourceIndex]]
      );
    });
  });

  // map selected columns to their relavant data
  const mappedImportData = data.map((row) => {
    const mappedRow: Record<string, any> = {};

    Object.entries(selectColumns).forEach(([key, value]) => {
      if (!value) return;

      // find the column index where the header matches the selected value
      const sourceColumnIndex = originalHeaders.findIndex(
        (header) => header.toLowerCase() === value.toLowerCase()
      );

      if (sourceColumnIndex === -1) return; // column not found

      const sourceHeader = originalHeaders[sourceColumnIndex];
      mappedRow[value] = row[sourceHeader];
    });

    return mappedRow;
  });

  const onTableSelectedChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectColumns((prev) => {
      const updated = { ...prev };

      if (value === "skip") {
        delete updated[`column_${columnIndex}`];
        return updated;
      }

      Object.keys(updated).forEach((key) => {
        if (updated[key] === value) {
          delete updated[key];
        }
      });

      updated[`column_${columnIndex}`] = value;      

      return updated;
    });
  };

  // have REQUIRED columns of data been chosen?
  // if not then cannot import anything yet.
  const hasRequiredColumns = requiredColumns.every((column) =>
    Object.values(selectColumns).includes(column)
  );

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
            <Button 
              onClick={() => onSubmit(mappedImportData)} 
              disabled={isPending || !hasRequiredColumns}>
              
              {isPending ? "Importing..." : `Import ${importResults.meta.total} Transactions`}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {data.length > 0 && (
            <div className="mt-4">
              <ImportTable
                headers={displayHeaders}
                body={displayBody}
                selectColumns={selectColumns}
                onTableSelectedChange={onTableSelectedChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};