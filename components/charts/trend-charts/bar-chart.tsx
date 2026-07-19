"use client";

import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { COLORS } from "./constants";
import { TrendData } from "./types";
import { format } from "date-fns";

type BarChartComponentProps = {
  data: TrendData[];
};

export const BarChartComponent = ({ data }: BarChartComponentProps) => {
  const chartData = data.map((item) => ({
    date: format(new Date(item.date), "MMM d"),
    Income: item.income,
    Expenses: Math.abs(item.expenses),
  }));

  return (
    <BarChart data={chartData}>
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
        labelFormatter={(label) => `Date: ${label}`}
        contentStyle={{
          backgroundColor: "hsl(var(--background))",
          borderColor: "hsl(var(--border))",
          borderRadius: "8px",
        }}
      />
      <Legend />
      <Bar yAxisId="left" dataKey="Income" fill={COLORS.income} radius={[4, 4, 0, 0]} />
      <Bar yAxisId="right" dataKey="Expenses" fill={COLORS.expenses} radius={[4, 4, 0, 0]} />
    </BarChart>
  );
};