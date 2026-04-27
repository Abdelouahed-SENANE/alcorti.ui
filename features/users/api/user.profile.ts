import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { Profile, userKeys } from "../user.type";

const getUserProfile = async (id: string): Promise<ApiResponse<Profile>> => {
  const response = await api$.get<ApiResponse<Profile>>(`users/${id}`);
  return response.data;
};

export const getUserProfileQueryOptions = (id: string) => {
  return {
    queryKey: [...userKeys.detail(id), "profile"],
    queryFn: () => getUserProfile(id),
  };
};

type UseUserProfileOptions = {
  id: string;
  queryConfig?: Partial<QueryConfig<typeof getUserProfileQueryOptions>>;
};

export const useUserProfile = ({ id, queryConfig }: UseUserProfileOptions) => {
  return useQuery({
    ...getUserProfileQueryOptions(id),
    ...queryConfig,
    enabled: !!id,
  });
};
