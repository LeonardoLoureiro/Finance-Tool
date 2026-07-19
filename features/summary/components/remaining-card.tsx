"use client";

import { PiggyBank } from "lucide-react";
import { SummaryCard } from "./data-card";

type RemainingCardProps = {
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

export const RemainingCard = ({
  amount,
  dateRange,
  change,
  isLoading = false,
  variant = "default",
  accentColor = amount >= 0 ? "green" : "red",
}: RemainingCardProps) => {
  const isPositive = amount >= 0;

  return (
    <SummaryCard
      title="Remaining"
      icon={<PiggyBank className="h-5 w-5 text-blue-500" />}
      value={amount}
      valueClassName={isPositive ? "text-green-600" : "text-red-600"}
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