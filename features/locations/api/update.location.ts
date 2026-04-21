import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { LOCATION_KEYS } from "../location.type";
import { createLocationSchema } from "./create.location";

export const updateLocationSchema = createLocationSchema.optional();
export type UpdateLocationInputs = z.infer<typeof updateLocationSchema>;

const updateLocation = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateLocationInputs;
}): Promise<ApiResponse<void>> => {
  try {
    const res = await api$.put(`/admin/locations/${id}`, payload);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const useUpdateLocation = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof updateLocation, ApiResponse<void>>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation<
    ApiResponse<void>,
    ApiResponse<void>,
    { id: string; payload: UpdateLocationInputs }
  >({
    mutationFn: updateLocation,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: LOCATION_KEYS.lists(), exact: false });
      qc.invalidateQueries({
        queryKey: LOCATION_KEYS.list_options(),
        exact: false,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
