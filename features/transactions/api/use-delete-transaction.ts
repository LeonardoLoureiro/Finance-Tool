import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>;

export const useDeleteTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      if (!id) throw new Error("Missing id");

      const response = await client.api.transactions[":id"]["$delete"]({
        param: { id },
      });

      return response.json();
    },

    onSuccess: () => {
      toast.success("Transaction deleted");

      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClient.removeQueries({
        queryKey: ["transaction", { id }],
      });
    },

    onError: () => {
      toast.error("Failed to delete transaction");
    },
  });

  return mutation;
};
