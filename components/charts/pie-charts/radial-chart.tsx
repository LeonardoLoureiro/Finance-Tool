"use client";

import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { COLORS } from "./constants";
import { CategoryData } from "./types";
import { formatCurrency } from "@/lib/utils";
import { CustomTooltip } from "../custom-tooltip";

type RadialChartComponentProps = {
  data: CategoryData[];
};

export const RadialChartComponent = ({ data }: RadialChartComponentProps) => {
  const sortedData = [...data]
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 10)
    .map((item, index) => ({
      ...item,
      fill: COLORS[index % COLORS.length],
    }));

  const renderLabel = (props: any) => {
    const { value } = props;
    return formatCurrency(Math.abs(value));
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="10%"
        outerRadius="70%"
        barSize={16}
        data={sortedData}
        startAngle={90}
        endAngle={-270}
      >
        <Tooltip content={<CustomTooltip labelKey="Category" />} />
        <RadialBar
          label={renderLabel}
          background
          dataKey="value"
        />
        <Legend
          iconSize={10}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};