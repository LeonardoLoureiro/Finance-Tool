import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

// hook
export const useGetCategory = (id?: string) => {
  const query = useQuery({
    // if no id, then will not even run.
    enabled: !!id,
    queryKey: ["Category", { id }],
    queryFn: async () => {
      // fetch single Category from API, since using Hono client,
      // if will simlply assign data to objects (ORM).
      // Do not have to fetch and parse json, it is done by client
      // and is end-to-end type safe.
      const res = await client.api.categories[":id"].$get({
        param: { id }
      });

      // if something goes wrong then throw an error.
      if (!res.ok) {
        throw new Error("Failed to fetch Category");
      }

      const { data } = await res.json();

      return data;
    }
  });

  return query;
};