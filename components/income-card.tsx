"use client";

import { ArrowUpRight } from "lucide-react";
import { SummaryCard } from "./ui/data-card";

type IncomeCardProps = {
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

export const IncomeCard = ({
  amount,
  dateRange,
  change,
  isLoading = false,
  variant = "default",
  accentColor = "green",
}: IncomeCardProps) => {
  return (
    <SummaryCard
      title="Income"
      icon={<ArrowUpRight className="h-5 w-5 text-green-500" />}
      value={amount}
      valueClassName="text-green-600"
      subtitle={dateRange}
      variant={variant}
      accentColor={accentColor}
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