import { api$ } from "@/config/axios";
import { InfiniteQueryConfig } from "@/config/react-query";
import { ApiResponse, CursorPaginated } from "@/types/api";
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { ORDER_KEYS, ShipmentOrder } from "../../shipment.type";

export type BookingOrdersParams = {
  cursor?: string | null;
  limit?: number;
  origin_id?: string;
  destination_id?: string;
  from_date?: string;
  to_date?: string;
};

export const getBookingOrders = async ({
  cursor,
  limit = 10,
  ...filters
}: BookingOrdersParams = {}): Promise<
  ApiResponse<CursorPaginated<ShipmentOrder>>
> => {
  const response = await api$.get<ApiResponse<CursorPaginated<ShipmentOrder>>>(
    "shipments/orders/booking",
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

export const getBookingOrdersQueryOptions = (
  params: Omit<BookingOrdersParams, "cursor"> = {},
) => ({
  queryKey: ORDER_KEYS.lists(params),
  queryFn: ({
    pageParam,
  }: {
    pageParam: string | null;
  }): Promise<ApiResponse<CursorPaginated<ShipmentOrder>>> =>
    getBookingOrders({ cursor: pageParam, ...params }),
});

type UseBookingOrdersOptions = {
  params?: Omit<BookingOrdersParams, "cursor">;
  config?: Partial<InfiniteQueryConfig<typeof getBookingOrdersQueryOptions>>;
};

export const useBookingOrders = ({ params, config }: UseBookingOrdersOptions = {}) => {
  return useInfiniteQuery<
    ApiResponse<CursorPaginated<ShipmentOrder>>,
    Error,
    InfiniteData<ApiResponse<CursorPaginated<ShipmentOrder>>>,
    QueryKey,
    string | null
  >({
    ...getBookingOrdersQueryOptions(params),
    getNextPageParam: (lastPage) =>
      lastPage.data?.cursor.next_cursor ?? undefined,
    initialPageParam: null as string | null,
    ...config,
  });
};
