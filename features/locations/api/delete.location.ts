import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LOCATION_KEYS } from "../location.type";

export const deleteLocation = async ({
  id,
}: {
  id: string;
}): Promise<ApiResponse<void>> => {
  return api$.delete(`/admin/locations/${id}`);
};

type UseDeleteLocationOptions = {
  mutationConfig?: MutationConfig<typeof deleteLocation>;
};

export const useDeleteLocation = ({
  mutationConfig,
}: UseDeleteLocationOptions = {}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: deleteLocation,
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
