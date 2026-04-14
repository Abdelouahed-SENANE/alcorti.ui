import { ApiResponse, BaseOption } from "@/types/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebouce } from "./use-debounce";

export type FectchOptionFn<TOptions extends BaseOption> = (params: {
  query?: string;
  limit: number;
}) => Promise<ApiResponse<TOptions>>;
export function useInfiniteOptions<TOptions extends BaseOption>({
  fetchFn,
  term,
  limit,
  queryKey,
  enabled = true,
}: {
  fetchFn: FectchOptionFn<TOptions>;
  term?: string;
  limit?: number;
  queryKey?: string;
  enabled?: boolean;
}) {
  const deboucedTerm = useDebouce(term, 500);

  const query = useInfiniteQuery({
    queryKey: [queryKey || "options", deboucedTerm],
    enabled,
    queryFn: ({  }) =>
      fetchFn({
        query: deboucedTerm || undefined,
        limit: limit || 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data?.pagination;
      if (!pagination || !pagination.has_next) return undefined;
      return pagination.page + 1;
    },
    staleTime: 1000 * 60 * 10,
  });

  const items = query.data?.pages.flatMap((page) => page.data?.items) ?? [];

  return {
    ...query,
    items,
  };
}
