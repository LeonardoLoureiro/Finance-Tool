// components/charts/trend-chart/constants.tsx

import { ChartType } from "./types";
import { AreaChartIcon, BarChart3, LineChartIcon } from "lucide-react";
import { ReactNode } from "react";

export const COLORS = {
  income: "#22c55e",
  expenses: "#ef4444",
};

export const CHART_TYPES: Record<ChartType, { label: string; icon: ReactNode }> = {
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

export const DEFAULT_CHART_TYPE: ChartType = "area";