import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CATEGORY_KEYS, CategoryOption } from "../category.type";

const getCategoryOptions = async (): Promise<ApiResponse<CategoryOption[]>> => {
  const response = await api$.get<ApiResponse<CategoryOption[]>>(
    "/categories/options",
  );

  return response.data;
};

export const getCategoryOptionsQueryOptions = () => {
  return {
    queryKey: CATEGORY_KEYS.list_options(),
    queryFn: () => getCategoryOptions(),
    placeholderData: keepPreviousData,
  };
};
type UseCategoryOptionsOptions = {
  queryConfig?: Partial<QueryConfig<typeof getCategoryOptionsQueryOptions>>;
};

export const useCategoryOptions = ({
  queryConfig,
}: UseCategoryOptionsOptions = {}) => {
  return useQuery({
    ...getCategoryOptionsQueryOptions(),
    ...queryConfig,
  });
};
