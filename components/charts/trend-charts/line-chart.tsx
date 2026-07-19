"use client";

import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { COLORS } from "./constants";
import { TrendData } from "./types";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

type LineChartComponentProps = {
  data: TrendData[];
};

export const LineChartComponent = ({ data }: LineChartComponentProps) => {
  const chartData = data.map((item) => ({
    date: format(new Date(item.date), "MMM d"),
    Income: item.income,
    Expenses: Math.abs(item.expenses),
  }));

  return (
    <LineChart data={chartData}>
      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
      <XAxis
        dataKey="date"
        className="text-xs"
        tick={{ fill: "hsl(var(--muted-foreground))" }}
        tickLine={false}
        axisLine={false}
      />
      <YAxis
        yAxisId="left"
        orientation="left"
        className="text-xs"
        tick={{ fill: "hsl(var(--muted-foreground))" }}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => `£${value}`}
      />
      <YAxis
        yAxisId="right"
        orientation="right"
        className="text-xs"
        tick={{ fill: "hsl(var(--muted-foreground))" }}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => `£${value}`}
      />
      <Tooltip
        formatter={(value) => {
          const numericValue = typeof value === "number" ? value : Number(value ?? 0);
          return [formatCurrency(Math.abs(numericValue)), ""];
        }}
        labelFormatter={(label) => `Date: ${label}`}
        contentStyle={{
          backgroundColor: "hsl(var(--background))",
          borderColor: "hsl(var(--border))",
          borderRadius: "8px",
          padding: "8px 12px",
        }}
        labelStyle={{
          color: "hsl(var(--foreground))",
          fontWeight: 600,
          fontSize: "13px",
          marginBottom: "4px",
        }}
        itemStyle={{
          color: "hsl(var(--muted-foreground))",
          fontSize: "12px",
        }}
      />
      <Legend />
      <Line
        yAxisId="left"
        type="monotone"
        dataKey="Income"
        stroke={COLORS.income}
        strokeWidth={2}
        dot={{ fill: COLORS.income, r: 4 }}
      />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="Expenses"
        stroke={COLORS.expenses}
        strokeWidth={2}
        dot={{ fill: COLORS.expenses, r: 4 }}
      />
    </LineChart>
  );
};