"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const options = [
  // required data to import
  "amount",
  "payee",
  "date",
  "account",

  // optional
  "category",
  "notes",
];


type Props = {
  columnIndex: number;
  // keys are stringified like `column_${index}`
  selectColumns: Record<string, string | null>;
  onChange: (columnIndex: number, value: string | null) => void;
  availableFields?: string[];
};

export const TableHeadSelect = ({
  columnIndex,
  selectColumns,
  onChange,
  availableFields = [],
}: Props) => {
  const currentSelection = selectColumns[`column_${columnIndex}`];

  const availableOptions = options.filter(
    (opt) => availableFields.includes(opt)
  );

  // Check if current selection is still valid
  const isValidSelection = currentSelection && availableFields.includes(currentSelection);
  const displayValue = isValidSelection ? currentSelection : "skip";

  return (
    <Select
      value={displayValue}
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
        {availableOptions.map((option) => {
          const disabled = Object.entries(selectColumns).some(
            ([key, value]) =>
              key !== `column_${columnIndex}` && value === option
          );

          return (
            <SelectItem
              key={option}
              value={option}
              disabled={disabled}
              className="capitalize"
            >
              {option}
            </SelectItem>
          );
        })}
      </SelectContent>

    </Select>
  );
};