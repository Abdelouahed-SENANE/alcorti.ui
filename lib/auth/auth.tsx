"use client";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Spinner } from "@/components/ui/spinner";
import { api$ } from "@/config/axios";
import { paths } from "@/config/paths";
import { ApiResponse, AuthUser } from "@/types/api";
import { AxiosError } from "axios";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { configureAuth } from "react-query-auth";
import { z } from "zod";
import { normalizeToE164 } from "../utils";

export const loginSchema = z.object({
  email: z
    .email("auth.fields.email.errors.invalid")
    .min(1, "auth.fields.email.errors.required"), // required
  password: z
    .string()
    .min(1, "auth.fields.password.errors.required")
    .min(8, "auth.fields.password.errors.min"), // min length
});

export const AUTH_KEY = "authenticated-user";

export async function getMe(): Promise<AuthUser | null> {
  try {
    const { data } = await api$.get<ApiResponse<AuthUser>>("/me");
    return data.data ?? null;
  } catch (e) {
    const err = e as AxiosError;
    console.error(err.message.toString());
    if (err.response?.status === 401) {
      return null;
    }
    return null;
  }
}

const logout = (): Promise<void> => {
  return api$.post("/logout");
};

export type LoginInputs = z.infer<typeof loginSchema>;
const login = async (payload: LoginInputs): Promise<ApiResponse<AuthUser>> => {
  const res = await api$.post<ApiResponse<AuthUser>>("/login", payload);
  return res.data;
};

export const createTranslationSchema = (key?: string) => {
  return z.object({
    ar: z.string().min(1, `${key}.ar`),
    fr: z.string().min(1, `${key}.fr`),
  });
};

export const registerSchema = z.object({
  first_name: z.string().min(1, "user.first_name.errors.required"),
  last_name: z.string().min(1, "user.last_name.errors.required"),
  email: z
    .email("auth.fields.email.errors.invalid")
    .min(1, "auth.fields.email.errors.required"), // required
  password: z
    .string()
    .min(1, "auth.fields.password.errors.required")
    .min(8, "auth.fields.password.errors.min"),
  phone: z
    .string()
    .optional()
    .transform((value) => normalizeToE164(value || "", "+212"))
    .refine(
      (value) => !value || /^\+[1-9]\d{7,14}$/.test(value),
      "user.phone.errors.invalid",
    ),
});

export type RegisterInputs = z.infer<typeof registerSchema>;
export const register = (
  payload: RegisterInputs,
): Promise<ApiResponse<AuthUser>> => {
  return api$.post("/register", payload);
};

const authConfig = {
  userFn: getMe,
  loginFn: async (payload: LoginInputs) => {
    const res = await login(payload);
    return res.data;
  },
  registerFn: async (payload: RegisterInputs) => {
    await register(payload);
    return null;
  },
  logoutFn: logout,
};
export const { useUser, useLogin, useRegister, useLogout, AuthLoader } =
  configureAuth(authConfig);

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data: user, isLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(paths.auth.login.route(pathname));
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner size="base" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner size="base" />
      </div>
    );
  }

  return children;
};

export const useAuthorization = () => {
  let user = useUser();

  const unauthorized = !user.data || !user.data.role;

  const hasRole = React.useCallback(
    ({ role }: { role: string }) => {
      if (role && user.data) {
        return user.data.role === role;
      }
      return true;
    },
    [user.data],
  );

  return { hasRole, unauthorized };
};

type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode;
  children: React.ReactNode;
} & {
  role: string;
};

export const Authorization = ({
  role,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { hasRole, unauthorized } = useAuthorization();
  const router = useRouter();

  React.useEffect(() => {
    if (unauthorized) {
      router.replace(paths.home.root);
    }
  }, [unauthorized, router]);

  if (unauthorized) {
    return null;
  }

  let canAccess = false;

  if (role) {
    canAccess = hasRole({ role });
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};

// export const POLICIES = {
//   "comment:delete": (user: User) => {
//     if (user.role === "ADMIN") {
//       return true;
//     }

//     // if (user.role === 'USER' && comment.author?.id === user.id) {
//     //   return true;
//     // }

//     return false;
//   },
// };
