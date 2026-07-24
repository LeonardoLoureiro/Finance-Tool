import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type Params = {
  from?: string;
  to?: string;
  accountId?: string;
};

export const useGetTransactions = ({
  from = "",
  to = "",
  accountId = "",
}: Params = {}) => {
  return useQuery({
    queryKey: ["transactions", { from, to, accountId }],

    queryFn: async () => {
      const res = await client.api.transactions.$get({
        query: {
          from,
          to,
          accountId,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const { data } = await res.json();

      return data;
    },
  });
};