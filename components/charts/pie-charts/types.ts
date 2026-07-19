export type PieChartType = "pie" | "radar" | "radial";

export type CategoryData = {
  name: string;
  value: number;
};

export type CategoryPieChartProps = {
  data: CategoryData[];
  isLoading?: boolean;
  defaultChartType?: PieChartType;
};