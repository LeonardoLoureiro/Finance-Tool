"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Props = {
  value: Date | DateRange | undefined;
  onChange: (date: Date | DateRange | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  dateFormat?: string;
  mode: "single" | "range";
};

export function DatePicker({
  value,
  onChange,
  disabled,
  placeholder = "Select a date",
  className,
  dateFormat = "PPP",
  mode,
}: Props) {
  const displayText = React.useMemo(() => {
    if (mode === "range") {
      const range = value as DateRange | undefined;

      if (range?.from && range?.to) {
        return `${format(range.from, dateFormat)} - ${format(
          range.to,
          dateFormat
        )}`;
      }

      if (range?.from) {
        return format(range.from, dateFormat);
      }

      return placeholder;
    }

    if (value instanceof Date) {
      return format(value, dateFormat);
    }

    return placeholder;
  }, [value, mode, placeholder, dateFormat]);

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-start text-left font-normal",
          className
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {displayText}
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        {mode === "single" ? (
          <Calendar
            mode="single"
            selected={value instanceof Date ? value : undefined}
            onSelect={(date) => onChange(date)}
            disabled={disabled}
            numberOfMonths={1}
          />
        ) : (
          <Calendar
            mode="range"
            selected={
              value && !(value instanceof Date)
                ? (value as DateRange)
                : undefined
            }
            onSelect={(range) => {
              if (!range) {
                onChange(undefined);
                return;
              }

              // user started a new selection.
              if (range.from && !range.to) {
                onChange({
                  from: range.from,
                  to: range.from,
                });
                return;
              }

              onChange(range);
            }}
            disabled={disabled}
            numberOfMonths={2}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}