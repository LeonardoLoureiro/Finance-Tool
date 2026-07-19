"use client";

import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { COLORS } from "./constants";
import { TrendData } from "./types";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

type AreaChartProps = {
  data: TrendData[];
};

export const AreaChartComponent = ({ data }: AreaChartProps) => {
  const chartData = data.map((item) => ({
    date: format(new Date(item.date), "MMM d"),
    Income: item.income,
    Expenses: Math.abs(item.expenses),
  }));

  return (
    <AreaChart data={chartData}>
      <defs>
        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={COLORS.income} stopOpacity={0.3} />
          <stop offset="95%" stopColor={COLORS.income} stopOpacity={0} />
        </linearGradient>
        <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={COLORS.expenses} stopOpacity={0.3} />
          <stop offset="95%" stopColor={COLORS.expenses} stopOpacity={0} />
        </linearGradient>
      </defs>
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
          opacity: 0.95,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          padding: "8px 12px",
        }}
        wrapperStyle={{
          outline: "none",
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
          paddingTop: "2px",
        }}
      />
      <Legend />
      <Area
        yAxisId="left"
        type="monotone"
        dataKey="Income"
        stroke={COLORS.income}
        strokeWidth={2}
        fill="url(#incomeGradient)"
        dot={false}
      />
      <Area
        yAxisId="right"
        type="monotone"
        dataKey="Expenses"
        stroke={COLORS.expenses}
        strokeWidth={2}
        fill="url(#expensesGradient)"
        dot={false}
      />
    </AreaChart>
  );
};