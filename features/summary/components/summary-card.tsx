"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ReactNode } from "react";

type SummaryCardProps = {
  title: string;
  icon: ReactNode;
  value: number;
  subtitle?: string;
  valueClassName?: string;
  trend?: {
    value: number;
    percent: number;
    isPositive: boolean;
    label: string;
  };
  isLoading?: boolean;
};

export const SummaryCard = ({
  title,
  icon,
  value,
  subtitle,
  valueClassName,
  trend,
  isLoading = false,
}: SummaryCardProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-16 mt-1" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      {/* subtle gradient accent line */}
      <div
        className={cn(
          "absolute top-0 left-0 h-1 w-full",
          trend ? (trend.isPositive ? "bg-green-500" : "bg-red-500") : value >= 0 ? "bg-green-500" : "bg-red-500"
        )}
      />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-md bg-muted p-1.5">{icon}</div>
      </CardHeader>

      <CardContent>
        <div className={cn("text-2xl font-bold tracking-tight", valueClassName)}>
          {formatCurrency(value)}
        </div>

        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}

        {trend && (
          <div className="flex items-center gap-1.5 text-xs mt-2 border-t border-muted/50 pt-2">
            <span className="text-muted-foreground">{trend.label}:</span>
            <span
              className={cn(
                "flex items-center gap-0.5 font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.isPositive ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {Math.abs(trend.percent).toFixed(1)}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};