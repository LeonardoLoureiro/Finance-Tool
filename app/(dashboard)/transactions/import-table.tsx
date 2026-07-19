"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableHeadSelect } from "./table-head-select";

type Props = {
  headers: string[];
  body: string[][];
  selectColumns: Record<string, string | null>;
  onTableSelectedChange: (
    columnIndex: number,
    value: string | null
  ) => void;
  availableFields: string[];
};

export const ImportTable = ({
  headers,
  body,
  selectColumns,
  onTableSelectedChange,
  availableFields,
}: Props) => {
  
  // has user selected any columns yet? 
  // if not then display on table no data/rows message until they do.
  const hasMappedColumns = Object.values(selectColumns).some(
    (value) => value !== null
  );

  return (
    <div className="rounded-md border overflow-hidden">
      <Table className="table-auto">
        <TableHeader className="bg-muted">
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index}>
                <div className="space-y-1">
                  <TableHeadSelect
                    columnIndex={index}
                    selectColumns={selectColumns}
                    onChange={onTableSelectedChange}
                    availableFields={availableFields}
                  />
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
            {hasMappedColumns ? (
              body.map((row: string[], index) => (
                <TableRow key={index}>
                  {row.map((cell: string, index) => (
                    <TableCell key={index}>
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              )
            )) : (
              <TableRow>
                <TableCell 
                  colSpan={headers.length}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  No columns selected.
                  <br />
                  Please select at least one column to import.
                </TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
    </div>
  )


};