import {
  DefaultOptions,
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  },
} satisfies DefaultOptions;

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  UseQueryOptions<ApiFnReturnType<ReturnType<T>["queryFn"]>>,
  "queryKey" | "queryFn"
>;

export type InfiniteQueryConfig<T extends (...args: any[]) => any> = Omit<
  UseInfiniteQueryOptions<
    ApiFnReturnType<ReturnType<T>["queryFn"]>,
    Error,
    InfiniteData<ApiFnReturnType<ReturnType<T>["queryFn"]>>,
    QueryKey,
    any
  >,
  "queryKey" | "queryFn"
>;

export type MutationConfig<
  MutationFnType extends (...args: any) => Promise<any>,
  TError = Error,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  TError,
  Parameters<MutationFnType>[0]
>;
