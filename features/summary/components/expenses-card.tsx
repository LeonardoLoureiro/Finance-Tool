"use client";

import { ArrowDownRight } from "lucide-react";
import { SummaryCard } from "./summary-card";

type ExpensesCardProps = {
  amount: number;
  dateRange: string;
  change?: {
    amount: number;
    percent: number;
  };
  isLoading?: boolean;
};

export const ExpensesCard = ({
  amount,
  dateRange,
  change,
  isLoading = false,
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