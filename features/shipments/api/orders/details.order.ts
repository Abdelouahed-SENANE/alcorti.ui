import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

import { SHIPMENT_KEYS, ShipmentOrder } from "../../shipment.type";

export const getOrderDetails = async ({
  id,
}: {
  id: string;
}): Promise<ApiResponse<ShipmentOrder>> => {
  const response = await api$.get<ApiResponse<ShipmentOrder>>(
    `shipments/orders/${id}`,
  );
  return response.data;
};

export const useOrderDetailsQueryOptions = (id: string) => ({
  queryKey: SHIPMENT_KEYS.detail(id),
  queryFn: () => getOrderDetails({ id }),
});

type UseOrderDetailsOptions = {
  id: string;
  config?: Partial<QueryConfig<typeof useOrderDetailsQueryOptions>>;
};

export const useOrderDetails = ({ id, config }: UseOrderDetailsOptions) => {
  return useQuery({
    ...useOrderDetailsQueryOptions(id),
    ...config,
  });
};
