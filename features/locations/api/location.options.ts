import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LOCATION_KEYS, type LocationOption } from "../location.type";

export const getLocationOptions = async (
  search?: string,
): Promise<ApiResponse<LocationOption[]>> => {
  const response = await api$.get<ApiResponse<LocationOption[]>>(
    `/locations/options/${search}`,
  );

  return response.data;
};

export const getLocationOptionsQueryOptions = (term?: string) => {
  return {
    queryKey: LOCATION_KEYS.list_option(term),
    queryFn: () => getLocationOptions(term),
    placeholderData: keepPreviousData,
  };
};

type UseLocationOptionsConfig = {
  search?: string;
  queryConfig?: Partial<QueryConfig<typeof getLocationOptionsQueryOptions>>;
};

export const useLocationOptions = ({
  search,
  queryConfig,
}: UseLocationOptionsConfig = {}) => {
  return useQuery({
    ...getLocationOptionsQueryOptions(search),
    ...queryConfig,
  });
};
