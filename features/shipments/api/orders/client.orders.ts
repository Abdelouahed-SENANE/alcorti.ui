import { api$ } from "@/config/axios";
import { InfiniteQueryConfig } from "@/config/react-query";
import { ApiResponse, CursorPaginated } from "@/types/api";
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { ORDER_KEYS, OrderStatus, ShipmentOrder } from "../../shipment.type";

export type ClientOrdersParams = {
  cursor?: string | null;
  limit?: number;
  origin_id?: string;
  destination_id?: string;
  status?: OrderStatus;
  from_date?: string;
  to_date?: string;
};

export const getMyOrders = async ({
  cursor,
  limit = 9,
  ...filters
}: ClientOrdersParams = {}): Promise<
  ApiResponse<CursorPaginated<ShipmentOrder>>
> => {
  const response = await api$.get<ApiResponse<CursorPaginated<ShipmentOrder>>>(
    "shipments/my/orders",
    {
      params: {
        cursor,
        limit,
        ...filters,
      },
    },
  );
  return response.data;
};

export const getMyOrdersQueryOptions = (
  params: Omit<ClientOrdersParams, "cursor"> = {},
) => ({
  queryKey: ORDER_KEYS.lists(params),
  queryFn: ({
    pageParam,
  }: {
    pageParam: string | null;
  }): Promise<ApiResponse<CursorPaginated<ShipmentOrder>>> =>
    getMyOrders({ cursor: pageParam, ...params }),
});

type UseClientOrdersOptions = {
  params?: Omit<ClientOrdersParams, "cursor">;
  config?: Partial<InfiniteQueryConfig<typeof getMyOrdersQueryOptions>>;
};

export const useClientOrders = ({ params, config }: UseClientOrdersOptions = {}) => {
  return useInfiniteQuery<
    ApiResponse<CursorPaginated<ShipmentOrder>>,
    Error,
    InfiniteData<ApiResponse<CursorPaginated<ShipmentOrder>>>,
    QueryKey,
    string | null
  >({
    ...getMyOrdersQueryOptions(params),
    getNextPageParam: (lastPage) =>
      lastPage.data?.cursor.next_cursor ?? undefined,
    initialPageParam: null as string | null,
    ...config,
  });
};
