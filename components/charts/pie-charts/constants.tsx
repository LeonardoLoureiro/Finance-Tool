import { PieChartType } from "./types";
import { PieChartIcon, RadarIcon, TargetIcon } from "lucide-react";
import { ReactNode } from "react";

export const COLORS = [
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

export const CHART_TYPES: Record<PieChartType, { label: string; icon: ReactNode }> = {
  pie: {
    label: "Pie",
    icon: <PieChartIcon className="h-4 w-4" />,
  },
  radar: {
    label: "Radar",
    icon: <RadarIcon className="h-4 w-4" />,
  },
  radial: {
    label: "Radial",
    icon: <TargetIcon className="h-4 w-4" />,
  },
};

export const DEFAULT_CHART_TYPE: PieChartType = "pie";