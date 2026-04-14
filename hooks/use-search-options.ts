import { ApiResponse, BaseOption } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { useDebouce } from "./use-debounce";

type SearchOptionsParams = {
  query?: string;
  limit: number;
};

export function useSearchOptions<
  TOptions extends BaseOption,
  TParams extends Record<string, any> = {},
>({
  fetchFn,
  term,
  limit = 20,
  queryKey,
  enabled = true,
  minLength = 0,
  params,
}: {
  fetchFn: (
    params: SearchOptionsParams & TParams,
  ) => Promise<ApiResponse<TOptions>>;
  term?: string;
  limit?: number;
  queryKey: readonly unknown[];
  enabled?: boolean;
  minLength?: number;
  params?: TParams;
}) {
  const debouncedTerm = useDebouce(term, 400);

  const canFetch =
    enabled && (debouncedTerm ? debouncedTerm.length >= minLength : true);

  const safeParams = (params ?? {}) as TParams;

  const query = useQuery({
    queryKey: params
      ? [...queryKey, debouncedTerm, params]
      : [...queryKey, debouncedTerm],
    enabled: canFetch,
    queryFn: () =>
      fetchFn({
        query: debouncedTerm || undefined,
        limit,
        ...safeParams,
      }),
    staleTime: 1000 * 60 * 10,
  });

  return {
    ...query,
    items: query.data?.data ?? [],
  };
}
