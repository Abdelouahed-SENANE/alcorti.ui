import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse, Paginated } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { User, userKeys } from "../user.type";

export interface UserParams {
  term?: string;
  page?: number;
  limit?: number;
  sort?: keyof User;
  order?: "asc" | "desc";
  active?: boolean;
}
export const defaultUserParams: Partial<UserParams> = {
  page: 1,
  limit: 10,
  sort: "created_at",
  order: "desc",
};

export const normalizeUserParams = (params: UserParams) => {
  return {
    ...defaultUserParams,
    ...params,
  };
};

const getUsers = async (
  params: UserParams,
): Promise<ApiResponse<Paginated<User>>> => {
  const normalized = normalizeUserParams(params);

  const response = await api$.get<ApiResponse<Paginated<User>>>("admin/users", {
    params: {
      ...normalized,
      ...(normalized.term && { term: normalized.term }),
    },
  });

  return response.data;
};

export const getUsersQueryOptions = (params: UserParams) => {
  const normalized = normalizeUserParams(params);
  return {
    queryKey: userKeys.collection(normalized),
    queryFn: () => getUsers(normalized),
  };
};

type UseUsersOptions = {
  params?: UserParams;
  queryConfig?: Partial<QueryConfig<typeof getUsersQueryOptions>>;
};

export const useUsers = ({ params, queryConfig }: UseUsersOptions) => {
  return useQuery({
    ...getUsersQueryOptions(params || {}),
    ...queryConfig,
  });
};
