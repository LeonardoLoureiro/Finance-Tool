"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

type Props = {
  value?: Date | DateRange;
  onChange: (date: Date | DateRange | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  dateFormat?: string;
  mode?: "single" | "range" | "multiple";
};

export const DatePicker = ({
  value,
  onChange,
  disabled,
  placeholder = "Select a date",
  className,
  dateFormat = "PPP",
  mode = "single",
}: Props) => {
  // format display text based on mode
  const displayText = React.useMemo(() => {
    if (mode === "range" && value && typeof value === "object" && "from" in value && "to" in value) {
      const range = value as DateRange;
      if (range.from && range.to) {
        return `${format(range.from, dateFormat)} - ${format(range.to, dateFormat)}`;
      }
      if (range.from) {
        return `${format(range.from, dateFormat)} - ...`;
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
        render={(props) => (
          <Button
            {...props}
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayText}
          </Button>
        )}
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode={mode}
          selected={value}
          onSelect={onChange}
          disabled={disabled}
          numberOfMonths={mode === "range" ? 2 : 1}
        />
      </PopoverContent>
    </Popover>
  );
};