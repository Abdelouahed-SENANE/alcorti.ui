import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { ShipmentOfferSubmitted, ORDER_KEYS } from "../../shipment.type";
import { api$ } from "@/config/axios";

export const getOrderOffers = async (
  id: string,
): Promise<ApiResponse<ShipmentOfferSubmitted[]>> => {
  const response = await api$.get<ApiResponse<ShipmentOfferSubmitted[]>>(
    `shipments/orders/${id}/offers`,
  );
  return response.data;
};

export const useOrderOffers = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ORDER_KEYS.order_offers(id),
    queryFn: () => getOrderOffers(id),
    enabled: !!id && enabled,
  });
};
