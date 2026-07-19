"use client";

import { ArrowDownRight } from "lucide-react";
import { SummaryCard } from "./data-card";

type ExpensesCardProps = {
  amount: number;
  dateRange: string;
  change?: {
    amount: number;
    percent: number;
  };
  isLoading?: boolean;
  variant?: "default" | "success" | "warning" | "destructive" | "outline" | "ghost" | "secondary";
  accentColor?: "green" | "red" | "blue" | "yellow" | "purple";
};

export const ExpensesCard = ({
  amount,
  dateRange,
  change,
  isLoading = false,
  variant = "default",
  accentColor = "red",
}: ExpensesCardProps) => {
  // for expenses, a negative change is good (spent less)
  const isPositive = change ? change.amount <= 0 : true;

  return (
    <SummaryCard
      title="Expenses"
      icon={<ArrowDownRight className="h-5 w-5 text-red-500" />}
      value={amount}
      valueClassName="text-red-600"
      subtitle={dateRange}
      variant={variant}
      accentColor={accentColor}
      trend={
        change
          ? {
              value: Math.abs(change.amount),
              percent: change.percent,
              isPositive: isPositive,
              label: "vs last period",
            }
          : undefined
      }
      isLoading={isLoading}
    />
  );
};