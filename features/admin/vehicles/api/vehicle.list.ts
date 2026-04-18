import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse, Paginated } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { Vehicle, VEHICLE_KEYS } from "../vehicle.type";

export interface VehicleParams {
  term?: string;
  page?: number;
  limit?: number;
  sort?: keyof Vehicle;
  order?: "asc" | "desc";
  active?: boolean;
}
export const defaultVehicleParams: Partial<VehicleParams> = {
  page: 1,
  limit: 10,
  sort: "created_at",
  order: "desc",
};

export const normalizeVehicleParams = (params: VehicleParams) => {
  return {
    ...defaultVehicleParams,
    ...params,
  };
};

const getVehicles = async (
  params: VehicleParams,
): Promise<ApiResponse<Paginated<Vehicle>>> => {
  const normalized = normalizeVehicleParams(params);

  const response = await api$.get<ApiResponse<Paginated<Vehicle>>>(
    "/vehicles",
    {
      params: {
        ...normalized,
        ...(normalized.term && { term: normalized.term }),
      },
    },
  );

  return response.data;
};

export const getVehiclesQueryOptions = (params: VehicleParams) => {
  const normalized = normalizeVehicleParams(params);
  return {
    queryKey: VEHICLE_KEYS.list(normalized),
    queryFn: () => getVehicles(normalized),
  };
};

type UseVehiclesOptions = {
  params?: VehicleParams;
  queryConfig?: Partial<QueryConfig<typeof getVehiclesQueryOptions>>;
};

export const useVehicles = ({ params, queryConfig }: UseVehiclesOptions) => {
  return useQuery({
    ...getVehiclesQueryOptions(params || {}),
    ...queryConfig,
  });
};
