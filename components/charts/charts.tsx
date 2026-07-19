"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useState } from "react";
import { AreaChartIcon, BarChart3, LineChartIcon } from "lucide-react";

type ChartType = "area" | "bar" | "line";

type TrendChartProps = {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
  isLoading?: boolean;
  defaultChartType?: ChartType;
};

const chartTypeConfig: Record<ChartType, { label: string; icon: React.ReactNode }> = {
  area: {
    label: "Area",
    icon: <AreaChartIcon className="h-4 w-4" />,
  },
  bar: {
    label: "Bar",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  line: {
    label: "Line",
    icon: <LineChartIcon className="h-4 w-4" />,
  },
};

export const TrendChart = ({
  data,
  isLoading = false,
  defaultChartType = "area",
}: TrendChartProps) => {
  const [chartType, setChartType] = useState<ChartType>(defaultChartType);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Income vs Expenses</CardTitle>
          <Skeleton className="h-8 w-28" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          No data available for this period
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    date: format(new Date(item.date), "MMM d"),
    Income: item.income,
    Expenses: Math.abs(item.expenses),
  }));

  const renderChart = () => {
    switch (chartType) {
      case "bar":
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
              labelFormatter={(label) => {
                const dateStr = typeof label === "string" ? label : "";
                return `Date: ${dateStr}`;
              }}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case "line":
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
              labelFormatter={(label) => {
                const dateStr = typeof label === "string" ? label : "";
                return `Date: ${dateStr}`;
              }}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Income"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: "#22c55e", r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Expenses"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: "#ef4444", r: 4 }}
            />
          </LineChart>
        );

      case "area":
      default:
        return (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
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
              labelFormatter={(label) => {
                const dateStr = typeof label === "string" ? label : "";
                return `Date: ${dateStr}`;
              }}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="Income"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#incomeGradient)"
              dot={false}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="Expenses"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#expensesGradient)"
              dot={false}
            />
          </AreaChart>
        );
    }
  };

  const handleChartTypeChange = (
    value: "area" | "bar" | "line" | null,
    _eventDetails?: any
  ) => {
    if (value === null) return;
    if (value === "area" || value === "bar" || value === "line") {
      setChartType(value as ChartType);
    }
  };

  const currentConfig = chartTypeConfig[chartType];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Income vs Expenses</CardTitle>
          <p className="text-sm text-muted-foreground">Daily breakdown over the period</p>
        </div>
        <Select value={chartType} onValueChange={handleChartTypeChange}>
          <SelectTrigger className="w-[130px] bg-background border border-input hover:bg-accent hover:text-accent-foreground">
            <div className="flex items-center gap-2">
              {currentConfig.icon}
              <span className="capitalize">{currentConfig.label}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="area">
              <div className="flex items-center gap-2">
                <AreaChartIcon className="h-4 w-4" />
                Area
              </div>
            </SelectItem>
            <SelectItem value="bar">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Bar
              </div>
            </SelectItem>
            <SelectItem value="line">
              <div className="flex items-center gap-2">
                <LineChartIcon className="h-4 w-4" />
                Line
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};