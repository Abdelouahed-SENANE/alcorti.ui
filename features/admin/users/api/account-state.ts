import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User, userKeys } from "../user.type";

export type ToggleAccountStateInput = {
  id: string;
};

export const toggleAccountState = ({
  id,
}: ToggleAccountStateInput): Promise<ApiResponse<User>> => {
  return api$.patch(`/admin/users/${id}/account`);
};

type UseToggleAccountStateOptions = {
  mutationConfig?: MutationConfig<typeof toggleAccountState>;
};

export const useToggleAccountState = ({
  mutationConfig,
}: UseToggleAccountStateOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...mutationConfig,
    mutationFn: toggleAccountState,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.collections(),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.details(),
        exact: false,
      });
      mutationConfig?.onSuccess?.(...args);
    },
  });
};
