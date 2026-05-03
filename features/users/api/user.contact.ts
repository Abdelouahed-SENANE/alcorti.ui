// import { api$ } from "@/config/axios";
// import { QueryConfig } from "@/config/react-query";
// import { ApiResponse } from "@/types/api";
// import { useQuery } from "@tanstack/react-query";
// import { Profile, userKeys } from "../user.type";

// const getUserContact= async (id: string): Promise<ApiResponse<Profile>> => {
//   const response = await api$.get<ApiResponse<Profile>>(`users/${id}/contact`);
//   return response.data;
// };

// export const getUserContactQueryOptions = (id: string) => {
//   return {
//     queryKey: [...userKeys.detail(id), "contact"],
//     queryFn: () => getUserContact(id),
//   };
// };

// type UseUserContactOptions = {
//   id: string;
//   queryConfig?: Partial<QueryConfig<typeof getUserContactQueryOptions>>;
// };

// export const useUserContact= ({ id, queryConfig }: UseUserContactOptions) => {
//   return useQuery({
//     ...getUserContactQueryOptions(id),
//     ...queryConfig,
//   });
// };
