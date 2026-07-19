"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ResponsiveContainer } from "recharts";
import { useState } from "react";
import { AreaChartIcon, BarChart3, LineChartIcon } from "lucide-react";
import { AreaChartComponent } from "./area-chart";
import { BarChartComponent } from "./bar-chart";
import { LineChartComponent } from "./line-chart";
import { ChartType, TrendChartProps } from "./types";

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

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return <BarChartComponent data={data} />;
      case "line":
        return <LineChartComponent data={data} />;
      case "area":
      default:
        return <AreaChartComponent data={data} />;
    }
  };

  const handleChartTypeChange = (value: ChartType | null) => {
    if (value === null) return;
    setChartType(value);
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
            {Object.entries(chartTypeConfig).map(([key, config]) => (
              <SelectItem key={key} value={key as ChartType}>
                <div className="flex items-center gap-2">
                  {config.icon}
                  {config.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Re-export types
export type { ChartType, TrendData, TrendChartProps } from "./types";