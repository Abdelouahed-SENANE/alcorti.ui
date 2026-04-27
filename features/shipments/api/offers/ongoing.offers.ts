import { api$ } from "@/config/axios";
import { InfiniteQueryConfig } from "@/config/react-query";
import { ApiResponse, CursorPaginated } from "@/types/api";
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { OFFERS_KEYS, OfferStatus, ShipmentOffer } from "../../shipment.type";

export type OngoingOffersParams = {
  cursor?: string | null;
  limit?: number;
  origin_id?: string;
  destination_id?: string;
  from_date?: string;
  to_date?: string;
};

export const getOngoingOffers = async ({
  status = "all",
  cursor,
  limit = 9,
  ...filters
}: OngoingOffersParams & { status?: OfferStatus | "all" } = {}): Promise<
  ApiResponse<CursorPaginated<ShipmentOffer>>
> => {
  const response = await api$.get<ApiResponse<CursorPaginated<ShipmentOffer>>>(
    `shipments/offers/ongoing/${status}`,
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

export const getOngoingOffersQueryOptions = (
  params: Omit<OngoingOffersParams, "cursor"> & {
    status?: OfferStatus | "all";
  } = {},
) => ({
  queryKey: OFFERS_KEYS.lists(params),
  queryFn: ({
    pageParam,
  }: {
    pageParam: string | null;
  }): Promise<ApiResponse<CursorPaginated<ShipmentOffer>>> =>
    getOngoingOffers({ cursor: pageParam, ...params }),
});

type UseOngoingOffersOptions = {
  params?: Omit<OngoingOffersParams, "cursor"> & {
    status?: OfferStatus | "all";
  };
  config?: Partial<InfiniteQueryConfig<typeof getOngoingOffersQueryOptions>>;
};

export const useOngoingOffers = ({ params, config }: UseOngoingOffersOptions = {}) => {
  return useInfiniteQuery<
    ApiResponse<CursorPaginated<ShipmentOffer>>,
    Error,
    InfiniteData<ApiResponse<CursorPaginated<ShipmentOffer>>>,
    QueryKey,
    string | null
  >({
    ...getOngoingOffersQueryOptions(params),
    getNextPageParam: (lastPage) =>
      lastPage.data?.cursor.next_cursor ?? undefined,
    initialPageParam: null as string | null,
    ...config,
  });
};
