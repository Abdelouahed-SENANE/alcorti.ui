import { api$ } from "@/config/axios";
import { ApiResponse, AuthUser } from "@/types/api";
import { queryOptions } from "@tanstack/react-query";
import { AxiosError, AxiosRequestConfig } from "axios";
import { z } from "zod";

export const loginSchema = z.object({
  login: z
    .string()
    .min(1, "auth.fields.login.errors.required")
    .refine(
      (value) => {
        const isEmail = z
          .email("auth.fields.login.errors.invalid")
          .safeParse(value);
        const cinRegex = /^[a-zA-Z]{1,2}\d+$/;
        return isEmail.success || cinRegex.test(value);
      },
      { message: "auth.fields.login.errors.invalid" },
    )
    .transform((val) =>
      val.includes("@") ? val.toLowerCase() : val.toUpperCase(),
    ),
  password: z
    .string()
    .min(1, "auth.fields.password.errors.required")
    .min(8, "auth.fields.password.errors.min"),
});

export type LoginInputs = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  first_name: z
    .string()
    .min(2, "users.fields.first_name.errors.min")
    .max(255, "users.fields.first_name.errors.max"),
  last_name: z
    .string()
    .min(2, "users.fields.last_name.errors.min")
    .max(255, "users.fields.last_name.errors.max"),
  cin: z
    .string()
    .min(5, "users.fields.cin.errors.min")
    .max(50, "users.fields.cin.errors.max")
    .regex(/^[a-zA-Z]{1,2}[0-9]+$/, "users.fields.cin.errors.invalid"),
  phone: z
    .string()
    .min(1, "users.fields.phone.errors.required")
    .max(20, "users.fields.phone.errors.max"),
  email: z
    .email("users.fields.email.errors.invalid")
    .max(255, "users.fields.email.errors.max")
    .min(1, "users.fields.email.errors.required"),
  password: z
    .string()
    .min(8, "users.fields.password.errors.min")
    .min(1, "users.fields.password.errors.required"),
  type: z.enum(["shipper", "client"]).refine((val) => !!val, {
    message: "users.fields.type.errors.required",
  }),
});

export type RegisterInputs = z.infer<typeof registerSchema>;

export const userQueryKey = ["authenticated-user"];

export async function getMe(
  config?: AxiosRequestConfig,
): Promise<AuthUser | null> {
  try {
    const { data } = await api$.get<ApiResponse<AuthUser>>("/me", config);
    return data.data ?? null;
  } catch (e) {
    const err = e as AxiosError;
    if (err.response?.status === 401) {
      return null;
    }
    return null;
  }
}

export const login = async (
  payload: LoginInputs,
): Promise<ApiResponse<AuthUser>> => {
  const res = await api$.post<ApiResponse<AuthUser>>("/login", payload);
  return res.data;
};

export const register = async (
  payload: RegisterInputs,
): Promise<ApiResponse<AuthUser>> => {
  const res = await api$.post<ApiResponse<AuthUser>>("/register", payload);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api$.post<ApiResponse<void>>("/logout");
};

export const getUserQueryOptions = (config?: AxiosRequestConfig) => {
  return queryOptions({
    queryKey: userQueryKey,
    queryFn: () => getMe(config),
    staleTime: 0, // Always re-fetch on mount so SSR null never blocks client auth
  });
};
