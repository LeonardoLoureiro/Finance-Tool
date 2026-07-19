import CurrencyInput from "react-currency-input-field";

import { Info, MinusCircle, PlusCircle } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const AmountInput = ({
  value,
  onChange,
  placeholder,
  disabled,
}: Props) => {
  const parsedValue = parseFloat(value);
  const isIncome = parsedValue > 0;
  const isExpense = parsedValue < 0;
  const hasValue = value && value !== "0" && value !== "0.00" && value !== "";

  const onReverseValue = () => {
    if (!value || value === "0" || value === "0.00") return;
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onChange((numValue * -1).toString());
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={(props) => (
                  <button
                    {...props}
                    type="button"
                    onClick={onReverseValue}
                    className={cn(
                      "flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground size-6 transition-colors",
                      isIncome && "text-emerald-500 hover:bg-emerald-600",
                      isExpense && "text-rose-500 hover:bg-rose-600",
                      !hasValue && "text-muted-foreground"
                    )}
                  >
                    {isIncome && <PlusCircle className="size-4" />}
                    {isExpense && <MinusCircle className="size-4" />}
                    {!isIncome && !isExpense && !hasValue && (
                      <Info className="size-4" />
                    )}
                  </button>
                )}
              />
              <TooltipContent>
                <p>
                  {isIncome && "Click to switch to expense"}
                  {isExpense && "Click to switch to income"}
                  {!hasValue && "Enter an amount first"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <CurrencyInput
          prefix="£"
          placeholder={placeholder}
          value={value || ""}
          onValueChange={onChange}
          disabled={disabled}
          allowDecimals={true}
          allowNegativeValue={true}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "pl-10"
          )}
        />        
      </div>
      
      <div className="mt-1 text-xs text-muted-foreground">
        {isIncome && "This will count as income"}
        {isExpense && "This will count as expense"}
        {(!value || value === "0" || value === "") && "Enter an amount (positive = income, negative = expense)"}
      </div>
    </div>
  );
};