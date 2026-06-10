import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

// hook
export const useGetAccounts = () => {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      // fetch accounts from API, since using Hono client,
      // if will simlply assign data to objects (ORM).
      // Do not have to fetch and parse json, it is done by client
      // and is end-to-end type safe.
      const res = await client.api.accounts.$get();

      // if something goes wrong then throw an error.
      if (!res.ok) {
        throw new Error("Failed to fetch accounts");
      }

      const { data } = await res.json();

      return data;
    }
  });

  return query;
};