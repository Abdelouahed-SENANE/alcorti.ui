import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse, Paginated } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { Category, CATEGORY_KEYS } from "../category.type";

export interface CategoryParams {
  term?: string;
  page?: number;
  limit?: number;
  sort?: keyof Category;
  order?: "asc" | "desc";
}

export const defaultCategoryParams: Partial<CategoryParams> = {
  page: 1,
  limit: 10,
  sort: "created_at",
  order: "desc",
};

export const normalizeCategoryParams = (params: CategoryParams) => {
  return {
    ...defaultCategoryParams,
    ...params,
  };
};

const getCategories = async (
  params: CategoryParams,
): Promise<ApiResponse<Paginated<Category>>> => {
  const normalized = normalizeCategoryParams(params);

  const response = await api$.get<ApiResponse<Paginated<Category>>>(
    "admin/categories",
    {
      params: {
        ...normalized,
        ...(normalized.term && { term: normalized.term }),
      },
    },
  );

  return response.data;
};

export const getCategoriesQueryOptions = (params: CategoryParams) => {
  const normalized = normalizeCategoryParams(params);
  return {
    queryKey: CATEGORY_KEYS.list(normalized),
    queryFn: () => getCategories(normalized),
  };
};

type UseCategoriesOptions = {
  params?: CategoryParams;
  queryConfig?: Partial<QueryConfig<typeof getCategoriesQueryOptions>>;
};

export const useCategories = ({
  params,
  queryConfig,
}: UseCategoriesOptions) => {
  return useQuery({
    ...getCategoriesQueryOptions(params || {}),
    ...queryConfig,
  });
};
