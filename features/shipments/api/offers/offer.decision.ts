import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OFFERS_KEYS, ORDER_KEYS, ShipmentOffer } from "../../shipment.type";

export type OfferDecisionInputs = {
  status: "accepted" | "cancelled";
};

export const offerDecision = async ({
  id,
  status,
}: {
  id: string;
} & OfferDecisionInputs): Promise<ApiResponse<ShipmentOffer>> => {
  const response = await api$.patch<ApiResponse<ShipmentOffer>>(
    `shipments/offers/${id}/decision/${status}`,
  );
  return response.data;
};

type UseOfferDecisionOptions = {
  offerId: string;
  mutationConfig?: MutationConfig<typeof offerDecision>;
};

export const useOfferDecision = ({
  offerId,
  mutationConfig,
}: UseOfferDecisionOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.list(),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.details(),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: OFFERS_KEYS.list(),
        exact: false,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: offerDecision,
  });
};
