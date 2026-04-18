import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VEHICLE_KEYS } from "../vehicle.type";

export const deleteVehicle = async ({
  id,
}: {
  id: string;
}): Promise<ApiResponse<void>> => {
  return api$.delete(`/vehicles/${id}`);
};

type UseDeleteVehicleOptions = {
  mutationConfig?: MutationConfig<typeof deleteVehicle>;
};

export const useDeleteVehicle = ({
  mutationConfig,
}: UseDeleteVehicleOptions = {}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: VEHICLE_KEYS.all, exact: false });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};