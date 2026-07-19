"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "relative overflow-hidden flex flex-col",
  {
    variants: {
      variant: {
        default: "bg-card border shadow-sm",
        outline: "bg-transparent border-2",
        ghost: "bg-transparent border-transparent shadow-none",
        secondary: "bg-secondary border-secondary",
        destructive: "bg-destructive/10 border-destructive/20",
        success: "bg-green-500/10 border-green-500/20",
        warning: "bg-yellow-500/10 border-yellow-500/20",
      },
      size: {
        default: "",
        sm: "",
        lg: "",
      },
      rounded: {
        default: "rounded-xl",
        sm: "rounded-lg",
        lg: "rounded-2xl",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
);

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
  accent?: boolean;
  accentColor?: "green" | "red" | "blue" | "yellow" | "purple";
} & VariantProps<typeof cardVariants>;

export const SummaryCard = ({
  title,
  icon,
  value,
  subtitle,
  valueClassName,
  trend,
  isLoading = false,
  variant = "default",
  size = "default",
  rounded = "default",
  accent = true,
  accentColor = value >= 0 ? "green" : "red",
}: SummaryCardProps) => {
  // Accent color mapping
  const accentColors = {
    green: "bg-green-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
  };

  if (isLoading) {
    return (
      <Card className={cn(cardVariants({ variant, size, rounded }), "aspect-square")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-5" />
        </CardHeader>
        <CardContent className="flex flex-col justify-center px-4 pb-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-16 mt-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(cardVariants({ variant, size, rounded }), "aspect-square")}>
      {/* accent line */}
      {accent && (
        <div
          className={cn(
            "absolute top-0 left-0 h-1 w-full",
            accentColors[accentColor as keyof typeof accentColors] || "bg-green-500"
          )}
        />
      )}

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4 flex-shrink-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "rounded-md p-2",
            variant === "destructive" && "bg-destructive/20",
            variant === "success" && "bg-green-500/20",
            variant === "warning" && "bg-yellow-500/20",
            variant === "secondary" && "bg-secondary",
            variant === "default" && "bg-muted",
            variant === "outline" && "bg-muted/50",
            variant === "ghost" && "bg-muted/30"
          )}
        >
          {icon}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-center px-4 pb-4">
        <div className={cn("text-3xl font-bold tracking-tight", valueClassName)}>
          {formatCurrency(value)}
        </div>

        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}

        {trend && (
          <div className="flex items-center gap-1.5 text-xs mt-3 pt-2 border-t border-muted/50">
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