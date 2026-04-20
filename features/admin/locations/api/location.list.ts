import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse, Paginated } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { Location, LOCATION_KEYS } from "../location.type";

export interface LocationParams {
  term?: string;
  page?: number;
  limit?: number;
  sort?: keyof Location;
  order?: "asc" | "desc";
}

export const defaultLocationParams: Partial<LocationParams> = {
  page: 1,
  limit: 10,
  sort: "created_at",
  order: "desc",
};

export const normalizeLocationParams = (params: LocationParams) => {
  return {
    ...defaultLocationParams,
    ...params,
  };
};

const getLocations = async (
  params: LocationParams,
): Promise<ApiResponse<Paginated<Location>>> => {
  const normalized = normalizeLocationParams(params);

  const response = await api$.get<ApiResponse<Paginated<Location>>>(
    "admin/locations",
    {
      params: {
        ...normalized,
        ...(normalized.term && { term: normalized.term }),
      },
    },
  );

  return response.data;
};

export const getLocationsQueryOptions = (params: LocationParams) => {
  const normalized = normalizeLocationParams(params);
  return {
    queryKey: LOCATION_KEYS.list(normalized),
    queryFn: () => getLocations(normalized),
  };
};

type UseLocationsOptions = {
  params?: LocationParams;
  queryConfig?: Partial<QueryConfig<typeof getLocationsQueryOptions>>;
};

export const useLocations = ({ params, queryConfig }: UseLocationsOptions) => {
  return useQuery({
    ...getLocationsQueryOptions(params || {}),
    ...queryConfig,
  });
};
