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
    // get headers from first row
    const headers = results.data[0];
    
    // parse data starting from row 1
    const parsedData = results.data.slice(1).map((row: any[]) => {
      const obj: Record<string, string> = {};
      headers.forEach((header: string, index: number) => {
        let value = row[index]?.trim() || "";
        
        // try to parse date if it looks like one
        if (header.toLowerCase().includes('date')) {
          try {
            const parsedDate = parseISO(value);
            if (!isNaN(parsedDate.getTime())) {
              value = parsedDate.toISOString();
            }
          } catch {
            // keep as string
          }
        }
        
        obj[header.trim()] = value;
      });
      return obj;
    });

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