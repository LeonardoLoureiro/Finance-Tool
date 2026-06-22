import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>;

// what it is expecting
type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>["json"];

export const useEditAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.accounts[":id"]["$patch"]({ 
        json,
        param: { id },
      });
      return response.json();
    },

    onSuccess: () => {
      toast.success("Account Updated");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["accounts", { id }] });
      // TODO:
      //  invalidate summary and transactions

    },

    onError: () => {
      toast.error("Failed to update account");

    }
  })

  return mutation;

};