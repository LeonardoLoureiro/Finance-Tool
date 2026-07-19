"use client";

import { ArrowUpRight } from "lucide-react";
import { SummaryCard } from "./summary-card";

type IncomeCardProps = {
  amount: number;
  dateRange: string;
  change?: {
    amount: number;
    percent: number;
  };
  isLoading?: boolean;
};

export const IncomeCard = ({
  amount,
  dateRange,
  change,
  isLoading = false,
}: IncomeCardProps) => {
  return (
    <SummaryCard
      title="Income"
      icon={<ArrowUpRight className="h-5 w-5 text-green-500" />}
      value={amount}
      valueClassName="text-green-600"
      subtitle={dateRange}
      trend={
        change
          ? {
              value: change.amount,
              percent: change.percent,
              isPositive: change.amount >= 0,
              label: "vs last period",
            }
          : undefined
      }
      isLoading={isLoading}
    />
  );
};