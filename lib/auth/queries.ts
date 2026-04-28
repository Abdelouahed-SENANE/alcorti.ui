"use client";

import { MutationConfig } from "@/config/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserQueryOptions,
  login,
  logout,
  register,
  userQueryKey,
} from "./api";
import { paths } from "@/config/paths";
import { useRouter } from "next/navigation";

export const useUser = () => useQuery(getUserQueryOptions());

export const useLogin = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof login>;
} = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: login,
    onSuccess: (data, ...args) => {
      queryClient.setQueryData(userQueryKey, data.data);
      onSuccess?.(data, ...args);
    },
    ...restConfig,
  });
};

export const useRegister = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof register>;
} = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: register,
    onSuccess: (data, ...args) => {
      queryClient.setQueryData(userQueryKey, data.data);
      onSuccess?.(data, ...args);
    },
    ...restConfig,
  });
};

export const useLogout = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof logout>;
} = {}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: logout,
    onSuccess: (...args) => {
      queryClient.setQueryData(userQueryKey, null);
      queryClient.clear();
      router.replace(paths.auth.login.root);
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
