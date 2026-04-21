import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { User, userKeys } from "../user.type";

const getUser = async (id: string): Promise<ApiResponse<User>> => {
  const response = await api$.get<ApiResponse<User>>(`admin/users/${id}`);

  return response.data;
};

export const getUserQueryOptions = (id: string) => {
  return {
    queryKey: [...userKeys.detail(id)],
    queryFn: () => getUser(id),
  };
};

type UseUserDetailsOptions = {
  id: string;
  queryConfig?: Partial<QueryConfig<typeof getUserQueryOptions>>;
};

export const useUserDetails = ({ id, queryConfig }: UseUserDetailsOptions) => {
  return useQuery({
    ...getUserQueryOptions(id),
    ...queryConfig,
  });
};
