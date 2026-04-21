import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORY_KEYS } from "../category.type";

export const deleteCategory = (id: string): Promise<ApiResponse<void>> => {
  return api$.delete(`admin/categories/${id}`);
};

type UseDeleteCategoryOptions = {
  mutationConfig?: MutationConfig<typeof deleteCategory>;
};

export const useDeleteCategory = ({
  mutationConfig,
}: UseDeleteCategoryOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_KEYS.lists(),
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteCategory,
  });
};
