"use client";

import { Button } from "@/components/ui/button";
import { parseISO } from "date-fns";
import { Upload } from "lucide-react";
import { useCSVReader } from "react-papaparse";

type Props = {
  onUpload: (results: {
    data: any[];
    errors: any[];
    meta: { total: number; rows: number };
  }) => void;
};

export const UploadButton = ({ onUpload }: Props) => {
  const { CSVReader } = useCSVReader();

  const handleUpload = (results: any) => {
    const parsedData = results.data.slice(1).map((row: any) => ({
      date: parseISO(row[0]),
      payee: row[1],
      amount: Math.round(parseFloat(row[2]) * 1000),
      accountName: row[3] || "",
      categoryName: row[4] || null,
      notes: row[5] || null,
    }));

    onUpload({
      data: parsedData,
      errors: results.errors || [],
      meta: {
        total: parsedData.length,
        rows: results.data.length - 1,
      },
    });
  };

  return (
    <CSVReader onUploadAccepted={handleUpload}>
      {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }: any) => (
        <>
          <Button
            size="sm"
            variant="outline"
            className="w-full lg:w-auto"
            {...getRootProps()}
          >
            <Upload className="mr-2 size-4" />
            Import
          </Button>
          {acceptedFile && (
            <div className="flex items-center gap-2">
              <span className="text-sm">{acceptedFile.name}</span>
              <Button
                size="sm"
                variant="ghost"
                {...getRemoveFileProps()}
              >
                Remove
              </Button>
              <ProgressBar />
            </div>
          )}
        </>
      )}
    </CSVReader>
  );
};