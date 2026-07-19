"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const COLORS = [
  "#22c55e",
  "#ef4444",
  "#3b82f6",
  "#eab308",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
];

type CategoryPieChartProps = {
  data: {
    name: string;
    value: number;
  }[];
  isLoading?: boolean;
};

export const CategoryPieChart = ({ data, isLoading = false }: CategoryPieChartProps) => {
  if (isLoading) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          No category data available
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((sum, item) => sum + Math.abs(item.value), 0);
  const sortedData = [...data].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={45}
                labelLine={false}
              >
                {sortedData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category legend with percentages */}
        <div className="mt-4 space-y-1.5">
          {sortedData.slice(0, 6).map((item, index) => {
            const percentage = (Math.abs(item.value) / total) * 100;
            return (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="capitalize">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {formatCurrency(Math.abs(item.value))}
                  </span>
                  <span className="font-medium w-12 text-right">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
          {sortedData.length > 6 && (
            <div className="text-sm text-muted-foreground text-center pt-1">
              +{sortedData.length - 6} more categories
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};