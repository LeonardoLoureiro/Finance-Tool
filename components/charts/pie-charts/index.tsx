"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useState } from "react";
import { PieChartComponent } from "./pie-chart";
import { RadarChartComponent } from "./radar-chart";
import { RadialChartComponent } from "./radial-chart";
import { CHART_TYPES, DEFAULT_CHART_TYPE } from "./constants";
import { CategoryPieChartProps, PieChartType } from "./types";

export const CategoryPieChart = ({
  data,
  isLoading = false,
  defaultChartType = DEFAULT_CHART_TYPE,
}: CategoryPieChartProps) => {
  const [chartType, setChartType] = useState<PieChartType>(defaultChartType);

  if (isLoading) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Spending by Category</CardTitle>
          <Skeleton className="h-8 w-28" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full" />
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
        <CardContent className="h-[280px] flex items-center justify-center text-muted-foreground">
          No category data available
        </CardContent>
      </Card>
    );
  }

  const currentConfig = CHART_TYPES[chartType];

  const renderChart = () => {
    switch (chartType) {
      case "radar":
        return <RadarChartComponent data={data} />;
      case "radial":
        return <RadialChartComponent data={data} />;
      case "pie":
      default:
        return <PieChartComponent data={data} />;
    }
  };

  const handleChartTypeChange = (value: PieChartType | null) => {
    if (value === null) return;
    setChartType(value);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Spending by Category</CardTitle>
        <Select value={chartType} onValueChange={handleChartTypeChange}>
          <SelectTrigger className="w-[130px] bg-background border border-input hover:bg-accent hover:text-accent-foreground">
            <div className="flex items-center gap-2">
              {currentConfig.icon}
              <span className="capitalize">{currentConfig.label}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CHART_TYPES).map(([key, config]) => (
              <SelectItem key={key} value={key as PieChartType}>
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
        <div className="h-[280px]">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};

// Re-export types
export type { PieChartType, CategoryData, CategoryPieChartProps } from "./types";