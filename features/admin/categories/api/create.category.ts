import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { CATEGORY_KEYS } from "../category.type";

export const createCategorySchema = z.object({
  name_ar: z.string({error : "categories.form.fields.name_ar.errors.required"}).min(2 , "categories.form.fields.name_ar.errors.min").max(100 , "categories.form.fields.name_ar.errors.max"),
  name_fr: z.string({error : "categories.form.fields.name_fr.errors.required"}).min(2 , "categories.form.fields.name_fr.errors.min").max(100 , "categories.form.fields.name_fr.errors.max"),
  icon_name: z.string({error : "categories.form.fields.icon_name.errors.required"}).min(1 , "categories.form.fields.icon_name.errors.min"),
});

export type CreateCategoryInputs = z.infer<typeof createCategorySchema>;

export const createCategory = ({
  payload,
}: {
  payload: CreateCategoryInputs;
}): Promise<ApiResponse<void>> => {
  return api$.post("admin/categories", payload);
};

type UseCreateCategoryOptions = {
  mutationConfig?: MutationConfig<typeof createCategory>;
};

export const useCreateCategory = ({
  mutationConfig,
}: UseCreateCategoryOptions = {}) => {
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
    mutationFn: createCategory,
  });
};
