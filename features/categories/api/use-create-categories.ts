import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.categories.$post>;

// what it is expecting
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"];

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.categories.$post({ json });
      return response.json();
    },

    onSuccess: () => {
      toast.success("Category Created");
      queryClient.invalidateQueries({ queryKey: ["Categorys"] });

    },

    onError: () => {
      toast.error("Failed to create Category");

    }
  })

  return mutation;

};