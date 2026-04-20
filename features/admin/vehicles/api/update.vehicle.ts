import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";

import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { VEHICLE_KEYS } from "../vehicle.type";
import { createVehicleSchema } from "./create.vehicle";

export const updateVehicleSchema = createVehicleSchema.optional();
export type UpdateVehicleInputs = z.infer<typeof updateVehicleSchema>;

const updateVehicle = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateVehicleInputs;
}): Promise<ApiResponse<void>> => {
  try {
    const res = await api$.put(`/vehicles/${id}`, payload);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const useUpdateVehicle = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof updateVehicle, ApiResponse<void>>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation<
    ApiResponse<void>,
    ApiResponse<void>,
    { id: string; payload: UpdateVehicleInputs }
  >({
    mutationFn: updateVehicle,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: VEHICLE_KEYS.lists(), exact: false });
      qc.invalidateQueries({ queryKey: VEHICLE_KEYS.list_options(), exact: false });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};
