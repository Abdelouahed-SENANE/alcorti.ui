import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { CATEGORY_KEYS } from "../category.type";

export const updateCategorySchema = z.object({
  name_ar: z.string().min(2).max(100).optional(),
  name_fr: z.string().min(2).max(100).optional(),
  icon_name: z.string().min(1).optional(),
});

export type UpdateCategoryInputs = z.infer<typeof updateCategorySchema>;

export const updateCategory = ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateCategoryInputs;
}): Promise<ApiResponse<void>> => {
  return api$.put(`admin/categories/${id}`, payload);
};

type UseUpdateCategoryOptions = {
  mutationConfig?: MutationConfig<typeof updateCategory>;
};

export const useUpdateCategory = ({
  mutationConfig,
}: UseUpdateCategoryOptions = {}) => {
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
    mutationFn: updateCategory,
  });
};
