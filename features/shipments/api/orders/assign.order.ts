import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ORDER_KEYS } from "../../shipment.type";
import z from "zod";




export const assignOrderSchema = z.object({
  status: z.enum(["assigned"]),
  shipper_id: z.string({message:"users.shipper.errors.required"}).min(1,"users.shipper.errors.required"),
});


export type AssignOrderInputs = z.infer<typeof assignOrderSchema>;

export const assignOrder = ({
  id,
  payload,
}: {
  id: string;
  payload: AssignOrderInputs;
}): Promise<ApiResponse<any>> => {
  return api$.patch(`/admin/orders/${id}/status`, payload );
};

type UseAssignOrderOptions = {
  mutationConfig?: MutationConfig<typeof assignOrder>;
};

export const useAssignOrder = ({
  mutationConfig,
}: UseAssignOrderOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.all, exact : false
      });
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.details(), exact : false
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: assignOrder,
  });
};
