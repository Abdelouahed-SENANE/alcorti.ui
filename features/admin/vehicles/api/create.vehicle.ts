import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { VEHICLE_KEYS } from "../vehicle.type";

export const createVehicleSchema = z.object({
  brand: z
    .string()
    .min(1, "vehicles.form.fields.brand.errors.required"),
  model: z
    .string()
    .min(1, "vehicles.form.fields.model.errors.required"),
  year: z
    .number({ error: "vehicles.form.fields.year.errors.required" })
    .min(1, "vehicles.form.fields.year.errors.required"),
  price_km: z
    .number({ error: "vehicles.form.fields.price_km.errors.required" })
    .min(1, "vehicles.form.fields.price_km.errors.required")
});

// export const createVehicleSchema = z.object({
//   brand: z.any().optional(),
//   model: z.any().optional(),
//   year: z.any().optional(),
//   price_km: z.any().optional(),
// });

export type CreateVehicleInputs = z.infer<typeof createVehicleSchema>;

const createVehicle = async ({
  payload,
}: {
  payload: CreateVehicleInputs;
}): Promise<ApiResponse<void>> => {
  try {
    const res = await api$.post("/vehicles", payload);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const useCreateVehicle = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createVehicle, ApiResponse<void>>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation<
    ApiResponse<void>,
    ApiResponse<void>,
    { payload: CreateVehicleInputs }
  >({
    mutationFn: createVehicle,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: VEHICLE_KEYS.lists(), exact: false });
      qc.invalidateQueries({ queryKey: VEHICLE_KEYS.list_options(), exact: false });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};
