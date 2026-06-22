import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>;

// what it is expecting
type RequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]>["json"];

export const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.categories[":id"]["$patch"]({ 
        json,
        param: { id },
      });
      return response.json();
    },

    onSuccess: () => {
      toast.success("Category Updated");
      queryClient.invalidateQueries({ queryKey: ["Categorys"] });
      queryClient.invalidateQueries({ queryKey: ["Categorys", { id }] });
      // TODO:
      //  invalidate summary and transactions

    },

    onError: () => {
      toast.error("Failed to update Category");

    }
  })

  return mutation;

};