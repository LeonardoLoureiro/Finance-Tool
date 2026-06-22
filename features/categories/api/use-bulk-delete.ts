import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>;

// what it is expecting
type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.categories["bulk-delete"]["$post"]({ json });
      return response.json();
    },

    onSuccess: () => {
      toast.success("Categorys Delete");
      queryClient.invalidateQueries({ queryKey: ["Categorys"] });
      // TODO:
      //  Invalidate summary.
    },

    onError: () => {
      toast.error("Failed to delete Categorys");

    }
  })

  return mutation;

};