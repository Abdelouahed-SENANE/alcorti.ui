import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ORDER_KEYS, OrderStatus } from "../../shipment.type";

export type UpdateOrderStatusInputs = {
  status: OrderStatus;
};

export const updateOrderStatus = ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateOrderStatusInputs;
}): Promise<ApiResponse<any>> => {
  return api$.patch(`/admin/orders/${id}/status`, payload);
};

type UseUpdateOrderStatusOptions = {
  mutationConfig?: MutationConfig<typeof updateOrderStatus>;
};

export const useUpdateOrderStatus = ({
  mutationConfig,
}: UseUpdateOrderStatusOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.all,
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.details(),
        exact: false,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateOrderStatus,
  });
};
