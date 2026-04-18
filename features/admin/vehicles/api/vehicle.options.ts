import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { VEHICLE_KEYS, type VehicleOption } from "../vehicle.type";

export const getVehicleOptions = async (
  term?: string,
): Promise<ApiResponse<VehicleOption[]>> => {
  const response = await api$.get<ApiResponse<VehicleOption[]>>(
    "/vehicles/options",
    {
      params: { term },
    },
  );

  return response.data;
};

export const getVehicleOptionsQueryOptions = (term?: string) => {
  return {
    queryKey: VEHICLE_KEYS.options(term),
    queryFn: () => getVehicleOptions(term),
    placeholderData: keepPreviousData,
  };
};

type UseVehicleOptionsConfig = {
  term?: string;
  queryConfig?: Partial<QueryConfig<typeof getVehicleOptionsQueryOptions>>;
};

export const useVehicleOptions = ({
  term,
  queryConfig,
}: UseVehicleOptionsConfig = {}) => {
  return useQuery({
    ...getVehicleOptionsQueryOptions(term),
    ...queryConfig,
  });
};
