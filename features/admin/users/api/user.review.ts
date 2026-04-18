import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User, userKeys } from "../user.type";

export type ReviewUserInput = {
  id: string;
  status: "approved" | "rejected";
  reason?: string;
};

export const reviewUser = ({
  id,
  status,
  reason,
}: ReviewUserInput): Promise<ApiResponse<User>> => {
  return api$.patch(`/admin/users/${id}/review`, { status, reason });
};

type UseReviewUserOptions = {
  mutationConfig?: MutationConfig<typeof reviewUser>;
};

export const useReviewUser = ({
  mutationConfig,
}: UseReviewUserOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...mutationConfig,
    mutationFn: reviewUser,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.collections(),
        exact: false,
      });
      mutationConfig?.onSuccess?.(...args);
    },
  });
};
