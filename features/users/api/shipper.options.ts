import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { userKeys, type ShipperOption } from "../user.type";

export const getShipperOptions = async (
  search?: string,
): Promise<ApiResponse<ShipperOption[]>> => {
  const response = await api$.get<ApiResponse<ShipperOption[]>>(
    `admin/users/shippers/options/${search}`,
  );

  return response.data;
};

export const getShipperOptionsQueryOptions = (term?: string) => {
  return {
    queryKey: userKeys.shipper_options(term),
    queryFn: () => getShipperOptions(term),
    placeholderData: keepPreviousData,
  };
};

type UseShipperOptionsConfig = {
  search?: string;
  queryConfig?: Partial<QueryConfig<typeof getShipperOptionsQueryOptions>>;
};

export const useShipperOptions = ({
  search,
  queryConfig,
}: UseShipperOptionsConfig = {}) => {
  return useQuery({
    ...getShipperOptionsQueryOptions(search),
    ...queryConfig,
  });
};
