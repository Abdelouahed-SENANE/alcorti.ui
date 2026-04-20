import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { LOCATION_KEYS } from "../location.type";

export const createLocationSchema = z.object({
  name_fr: z.string().min(1, "locations.form.fields.name_fr.errors.required"),
  name_en: z.string().min(1, "locations.form.fields.name_en.errors.required"),
  name_ar: z.string().min(1, "locations.form.fields.name_ar.errors.required"),
  lat: z
    .number({ error: "locations.form.fields.lat.errors.required" })
    .min(1, "locations.form.fields.lat.errors.required"),
  lng: z
    .number({ error: "locations.form.fields.lng.errors.required" })
    .min(1, "locations.form.fields.lng.errors.required"),
});

export type CreateLocationInputs = z.infer<typeof createLocationSchema>;

const createLocation = async ({
  payload,
}: {
  payload: CreateLocationInputs;
}): Promise<ApiResponse<void>> => {
  try {
    const res = await api$.post("/admin/locations", payload);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const useCreateLocation = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createLocation, ApiResponse<void>>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation<
    ApiResponse<void>,
    ApiResponse<void>,
    { payload: CreateLocationInputs }
  >({
    mutationFn: createLocation,
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
