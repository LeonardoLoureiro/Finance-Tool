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
};

export const ImportTable = ({
  headers,
  body,
  selectColumns,
  onTableSelectedChange,
}: Props) => {
  console.log(headers);

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted">
        <TableRow>
          {headers.map((header, index) => (
            <TableHead key={index}>
              <TableHeadSelect
                columnIndex={index}
                selectColumns={selectColumns}
                onChange={onTableSelectedChange}
              />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
        <TableBody>
            {body.map((row: string[], index) => (
              <TableRow key={index}>
                {row.map((cell: string, index) => (
                  <TableCell key={index}>
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )


};