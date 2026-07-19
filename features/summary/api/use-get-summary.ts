// features/transactions/api/use-get-summary.ts

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export type SummaryResponse = {
  data: {
    currentPeriod: {
      income: number;
      expenses: number;
      net: number;
      count: number;
    };
    lastPeriod: {
      income: number;
      expenses: number;
      net: number;
      count: number;
    };
    changes: {
      income: number;
      incomePercent: number;
      expenses: number;
      expensesPercent: number;
      net: number;
      netPercent: number;
    };
    period: {
      from: string;
      to: string;
    };
  };
};

export const useGetSummary = (params?: {
  from?: string;
  to?: string;
  accountId?: string;
}) => {
  const query = useQuery<SummaryResponse>({
    queryKey: ["summary", params],
    queryFn: async () => {
      const response = await client.api.summary.$get({
        // ensure we always pass an object (API client expects an object, not undefined)
        query: params ?? {},
      });

      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      return response.json();
    },
  });

  return query;
};