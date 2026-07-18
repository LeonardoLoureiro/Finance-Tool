"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { ImportTable } from "./import-table";

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

const requiredColumns = [
  "amount", 
  "payee", 
  "date", 
  "account"
];

export const ImportCard = ({
  data,
  onCancel,
  onSubmit,
  isPending,
  onUpload,
  importResults,
}: Props) => {
  const [selectColumns, setSelectColumns] = useState<SelectedColumnsState>({});

  const originalHeaders = data.length > 0 ? Object.keys(data[0]) : [];

  // pass available fields to TableHeadSelect
  // for example, if csv does not have a "notes" field,
  // then simply do not give user options to select it!
  const existingFields = originalHeaders.map(h => h.toLowerCase());

  // auto-detect and pre-select columns
  useEffect(() => {
    if (data.length > 0 && Object.keys(selectColumns).length === 0) {
      const autoMappings: SelectedColumnsState = {};
      const headers = Object.keys(data[0]);
      
      headers.forEach((header, index) => {
        const headerLower = header.toLowerCase();
        
        // date detection
        if (headerLower.includes('date') || headerLower.includes('time') || headerLower.includes('transaction')) {
          autoMappings[`column_${index}`] = 'date';
        } 
        
        // payee detection
        else if (headerLower.includes('payee') || headerLower.includes('vendor') || headerLower.includes('merchant') || headerLower.includes('name')) {
          autoMappings[`column_${index}`] = 'payee';
        } 

        // amount detection
        else if (headerLower.includes('amount') || headerLower.includes('price') || headerLower.includes('total') || headerLower.includes('cost')) {
          autoMappings[`column_${index}`] = 'amount';
        } 
        
        // account detection
        else if (headerLower.includes('account') || headerLower.includes('wallet') || headerLower.includes('bank')) {
          autoMappings[`column_${index}`] = 'account';
        } 

        // category detection
        else if (headerLower.includes('category') || headerLower.includes('type') || headerLower.includes('tag')) {
          autoMappings[`column_${index}`] = 'category';
        } 

        // notes detection
        else if (headerLower.includes('note') || headerLower.includes('description') || headerLower.includes('memo')) {
          autoMappings[`column_${index}`] = 'notes';
        }
      });
      
      setSelectColumns(autoMappings);
    }
  }, [data]);

  // display headers with visual indicator of what was mapped
  const displayHeaders = originalHeaders.map((header, index) => {
    const selected = selectColumns[`column_${index}`];
    return selected ?? "Skip";
  });

  const displayBody = data.map((row) => {
    return originalHeaders.map((_, columnIndex) => {
      const selectedColumn = selectColumns[`column_${columnIndex}`];
      if (!selectedColumn) return "";
      
      const sourceIndex = originalHeaders.findIndex(
        (header) => header.toLowerCase() === selectedColumn.toLowerCase()
      );
      
      return String(row[originalHeaders[sourceIndex]]);
    });
  });

  const mappedImportData = data.map((row) => {
    const mappedRow: Record<string, any> = {};

    Object.entries(selectColumns).forEach(([key, value]) => {
      if (!value) return;

      const sourceColumnIndex = originalHeaders.findIndex(
        (header) => header.toLowerCase() === value.toLowerCase()
      );

      if (sourceColumnIndex === -1) return;

      const sourceHeader = originalHeaders[sourceColumnIndex];
      mappedRow[value] = row[sourceHeader];
    });

    return mappedRow;
  });

  const onTableSelectedChange = (columnIndex: number, value: string | null) => {
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

  const hasRequiredColumns = requiredColumns.every((column) =>
    Object.values(selectColumns).includes(column)
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-10 -mt-5">
      <Button variant="ghost" onClick={onCancel} className="mb-4 relative z-50">
        <MoveLeft className="mr-2 h-4 w-4" />
        Back to transactions
      </Button>
      
      <Card className="relative z-0">
        <CardHeader className="flex flex-col gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Import Transactions
          </CardTitle>
          {importResults.data.length > 0 && (
            <Button 
              onClick={() => onSubmit(mappedImportData)} 
              disabled={isPending || !hasRequiredColumns}
            >
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
                availableFields={existingFields}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};