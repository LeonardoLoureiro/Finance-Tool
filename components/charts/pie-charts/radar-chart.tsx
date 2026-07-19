"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { COLORS } from "./constants";
import { CategoryData } from "./types";
import { formatCurrency } from "@/lib/utils";

type RadarChartComponentProps = {
  data: CategoryData[];
};

export const RadarChartComponent = ({ data }: RadarChartComponentProps) => {
  const sortedData = [...data].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  const displayData = sortedData.slice(0, 8);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart 
        data={displayData}
        margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
      >
        <PolarGrid
          stroke="hsl(var(--foreground))"
          strokeWidth={1.5}
          opacity={0.4}
        />
        <PolarAngleAxis
          dataKey="name"
          tick={{ 
            fill: "hsl(var(--foreground))", 
            fontSize: 10, 
            fontWeight: 500 
          }}
          tickLine={false}
          axisLine={false}
        />
        <PolarRadiusAxis
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
          tickFormatter={(value) => `£${value}`}
          axisLine={{ stroke: "hsl(var(--foreground))", strokeWidth: 1, opacity: 0.3 }}
          tickCount={4}
        />
        <Tooltip
          formatter={(value) => {
            const numericValue = typeof value === "number" ? value : Number(value ?? 0);
            return [formatCurrency(Math.abs(numericValue)), ""];
          }}
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
        <Radar
          name="Spending"
          dataKey="value"
          stroke={COLORS[0]}
          strokeWidth={2.5}
          fill={COLORS[0]}
          fillOpacity={0.25}
        />
        <Legend
          iconSize={10}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};