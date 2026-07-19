// features/transactions/api/use-get-summary.ts

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export type CategoryData = {
  name: string;
  count: number;
  total: number;
  average: number;
};

export type CategoryTotals = {
  income: number;
  expenses: number;
  net: number;
  count: number;
};

export type SummaryTotals = {
  income: number;
  expenses: number;
  net: number;
  count: number;
};

export type Changes = {
  income: number;
  incomePercent: number;
  expenses: number;
  expensesPercent: number;
  net: number;
  netPercent: number;
};

export type SummaryResponse = {
  data: {
    summary: {
      currentPeriod: SummaryTotals;
      lastPeriod: SummaryTotals;
      changes: Changes;
    };
    categories: {
      currentPeriod: {
        categories: CategoryData[];
        totals: CategoryTotals;
      };
      lastPeriod: {
        categories: CategoryData[];
        totals: CategoryTotals;
      };
      changes: Changes;
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
  type?: "income" | "expense" | "all";
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