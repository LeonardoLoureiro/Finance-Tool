import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  typeof client.api.accounts[":id"]["$delete"]
>;

export const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      if (!id) throw new Error("Missing id");

      const response = await client.api.accounts[":id"]["$delete"]({
        param: { id },
      });

      return response.json();
    },

    onSuccess: () => {
      toast.success("Account deleted");

      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClient.removeQueries({
        queryKey: ["account", { id }],
      });
    },

    onError: () => {
      toast.error("Failed to delete account");
    },
  });

  return mutation;
};