// features/transactions/api/use-get-summary-categories.ts

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export type CategoryData = {
  name: string;
  count: number;
  total: number;
  average: number;
};

export type CategoriesResponse = {
  data: {
    categoriesData: CategoryData[];
    totals: {
      income: number;
      expenses: number;
      net: number;
      count: number;
    };
    period: {
      from: string;
      to: string;
    };
  };
};

export const useGetSummaryCategories = (params?: {
  from?: string;
  to?: string;
  accountId?: string;
  type?: "income" | "expense" | "all";
}) => {
  const query = useQuery<CategoriesResponse>({
    queryKey: ["summary-categories", params],
    queryFn: async () => {
      const response = await client.api.summary.categories.$get({
        // ensure we always pass an object (API client expects an object, not undefined)
        query: params ?? {},
      });

      if (!response.ok) {
        throw new Error("Failed to fetch category breakdown");
      }

      return response.json();
    },
  });

  return query;
};