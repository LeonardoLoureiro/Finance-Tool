import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  typeof client.api.categories[":id"]["$delete"]
>;

export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      if (!id) throw new Error("Missing id");

      const response = await client.api.categories[":id"]["$delete"]({
        param: { id },
      });

      return response.json();
    },

    onSuccess: () => {
      toast.success("Category deleted");

      queryClient.invalidateQueries({
        queryKey: ["Categorys"],
      });

      queryClient.removeQueries({
        queryKey: ["Category", { id }],
      });
    },

    onError: () => {
      toast.error("Failed to delete Category");
    },
  });

  return mutation;
};