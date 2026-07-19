"use client";

import { Wallet } from "lucide-react";
import { SummaryCard } from "./summary-card";

type RemainingCardProps = {
  amount: number;
  dateRange: string;
  change?: {
    amount: number;
    percent: number;
  };
  isLoading?: boolean;
};

export const RemainingCard = ({
  amount,
  dateRange,
  change,
  isLoading = false,
}: RemainingCardProps) => {
  const isPositive = amount >= 0;

  return (
    <SummaryCard
      title="Remaining"
      icon={<Wallet className="h-5 w-5 text-muted-foreground" />}
      value={amount}
      valueClassName={isPositive ? "text-green-600" : "text-red-600"}
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