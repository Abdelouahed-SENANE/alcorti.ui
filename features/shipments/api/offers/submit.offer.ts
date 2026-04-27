import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ORDER_KEYS } from "../../shipment.type";

export const submitOffer = ({
  orderId,
}: {
  orderId: string;
}): Promise<ApiResponse<any>> => {
  return api$.post(`/shipments/orders/${orderId}/submit-offer`);
};

type UseSubmitOfferOptions = {
  mutationConfig?: MutationConfig<typeof submitOffer>;
};

export const useSubmitOffer = ({
  mutationConfig,
}: UseSubmitOfferOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: submitOffer,
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
  });
};
