"use client";

import { paths } from "@/config/paths";
import { ROLES } from "@/types/api";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { z } from "zod";

// Re-export queries, mutations, and API artifacts natively
export * from "./api";
export * from "./queries";

// Compatibility aliases
import { userQueryKey } from "./api";
import { useUser } from "./queries";
export const AUTH_KEY = userQueryKey[0];

export const createTranslationSchema = (key?: string) => {
  return z.object({
    ar: z.string().min(1, `${key}.ar`),
    fr: z.string().min(1, `${key}.fr`),
  });
};

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

  if (isLoading || !user) {
    return null;
  }

  return children;
};

export const EnsureProfileCompleted = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: user, isLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace(paths.auth.login.route(undefined));
      return;
    }

    if (user.is_completed) {
      if (pathname.includes("/complete")) {
        router.replace(paths.home.route());
      }
      return;
    }

    const role = user.role?.toLowerCase();

    if (role === "client" && !pathname.includes("/complete/client")) {
      router.replace(paths.complete.client.route());
    } else if (role === "shipper" && !pathname.includes("/complete/shipper")) {
      router.replace(paths.complete.shipper.route());
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading || !user) return null;
  if (user.is_completed && pathname.includes("/complete")) return null;
  if (
    !user.is_completed &&
    user.role &&
    !pathname.includes(`/complete/${user.role.toLowerCase()}`)
  )
    return null;

  return children;
};

export const EnsureRole = ({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) => {
  const { data: user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !user) return;
    if (user.role?.toLowerCase() !== role.toLowerCase()) {
      router.replace(paths.home.route());
    }
  }, [user, isLoading, router, role]);

  if (isLoading || !user || user.role?.toLowerCase() !== role.toLowerCase())
    return null;

  return <>{children}</>;
};

export const useAuthorization = () => {
  const user = useUser();

  const hasRole = React.useCallback(
    ({ role }: { role: ROLES | string }) => {
      if (role && user.data?.role) {
        return user.data.role.toLowerCase() === role.toLowerCase();
      }
      return !role;
    },
    [user.data],
  );

  return { hasRole };
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
  const { hasRole } = useAuthorization();

  let canAccess = false;

  if (role) {
    canAccess = hasRole({ role });
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};
