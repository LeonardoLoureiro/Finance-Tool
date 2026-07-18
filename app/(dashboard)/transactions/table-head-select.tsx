"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Props = {
  columnIndex: number;
  // keys are stringified like `column_${index}`
  selectColumns: Record<string, string | null>;
  onChange: (columnIndex: number, value: string | null) => void;
};

const options = [
  "amount",
  "payee",
  "date",
  "category",
  "account",
  "notes",
];

export const TableHeadSelect = ({
  columnIndex,
  selectColumns,
  onChange,
}: Props) => {
  const currentSelection = selectColumns[`column_${columnIndex}`];

  return (
    <Select
      value={currentSelection || ""}
      onValueChange={(value) => onChange(columnIndex, value)}
    >
      <SelectTrigger
        className={cn(
          "focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize",
          currentSelection && "text-blue-500",
        )}
      >
        <SelectValue>
          {currentSelection ?? "Skip"}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {/* hardcoded as user may not want to include certain columns */}
        <SelectItem value="skip">Skip</SelectItem>
        {options.map((option, index) => {
          const disabled =
            Object.entries(selectColumns).some(
              ([key, value]) =>
                key !== `column_${columnIndex}` &&
                value === option
            );
            
          return (
            <SelectItem 
              key={index}
              value={option}
              disabled={disabled}
              className="capitalize"
            >
              {option}
            </SelectItem>
          )
        })}
      </SelectContent>

    </Select>
  );
};