import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

// hook
export const useGetCategories = () => {
  const query = useQuery({
    queryKey: ["Categorys"],
    queryFn: async () => {
      // fetch Categorys from API, since using Hono client,
      // if will simlply assign data to objects (ORM).
      // Do not have to fetch and parse json, it is done by client
      // and is end-to-end type safe.
      const res = await client.api.categories.$get();

      // if something goes wrong then throw an error.
      if (!res.ok) {
        throw new Error("Failed to fetch Categorys");
      }

      const { data } = await res.json();

      return data;
    }
  });

  return query;
};