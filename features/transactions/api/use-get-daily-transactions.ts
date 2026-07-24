import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export type DailyData = {
  date: string;
  income: number;
  expenses: number;
  count: number;
};

export type DailyResponse = {
  data: DailyData[];
  period: {
    from: string;
    to: string;
  };
};

export const useGetDailyTransactions = (params?: {
  from?: string;
  to?: string;
  accountId?: string;
}) => {
  const query = useQuery<DailyResponse>({
    queryKey: ["daily", params],
    queryFn: async () => {
      const response = await client.api.transactions.daily.$get({
        query: params ?? {},
      });

      if (!response.ok) {
        throw new Error("Failed to fetch daily transactions");
      }

      return response.json();
    },
  });

  return query;
};