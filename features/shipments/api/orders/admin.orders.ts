import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse, Paginated } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import {
  ORDER_KEYS,
  ShipmentOrderFilters,
  ShipmentOrderSummary,
} from "../../shipment.type";

export type AdminOrderParams = {
  page?: number;
  limit?: number;
  sort?: keyof ShipmentOrderSummary;
  order?: "asc" | "desc";
} & Omit<ShipmentOrderFilters, "from_date" | "to_date"> & {
    from_date?: string;
    to_date?: string;
  };

export const defaultAdminOrderParams: Partial<AdminOrderParams> = {
  page: 1,
  limit: 10,
  sort: "created_at",
  order: "desc",
};

export const normalizeAdminOrderParams = (params: AdminOrderParams) => {
  return {
    ...defaultAdminOrderParams,
    ...params,
  };
};

export const getAdminOrders = async (
  params: AdminOrderParams,
): Promise<ApiResponse<Paginated<ShipmentOrderSummary>>> => {
  const normalized = normalizeAdminOrderParams(params);

  const response = await api$.get<ApiResponse<Paginated<ShipmentOrderSummary>>>(
    "/admin/orders",
    {
      params: normalized,
    },
  );

  return response.data;
};

export const getAdminOrdersQueryOptions = (params: AdminOrderParams) => {
  const normalized = normalizeAdminOrderParams(params);
  return {
    queryKey: ORDER_KEYS.lists(normalized),
    queryFn: () => getAdminOrders(normalized),
  };
};

type UseAdminOrdersOptions = {
  params?: AdminOrderParams;
  queryConfig?: Partial<QueryConfig<typeof getAdminOrdersQueryOptions>>;
};

export const useAdminOrders = ({
  params,
  queryConfig,
}: UseAdminOrdersOptions) => {
  return useQuery({
    ...getAdminOrdersQueryOptions(params || {}),
    ...queryConfig,
  });
};
