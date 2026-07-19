export type ChartType = "area" | "bar" | "line";

export type TrendData = {
  date: string;
  income: number;
  expenses: number;
};

export type TrendChartProps = {
  data: TrendData[];
  isLoading?: boolean;
  defaultChartType?: ChartType;
};