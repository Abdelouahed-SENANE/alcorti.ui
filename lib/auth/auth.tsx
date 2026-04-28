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

/* ═══════════════════════════════════════════════════════════════
   UNIFIED AUTH GUARD
   Replaces ProtectedRoute + EnsureProfileCompleted + EnsureRole
   
   Examples:
     <AuthGuard>                              → just needs auth
     <AuthGuard requireCompleted>             → auth + profile complete
     <AuthGuard role="admin">                 → auth + admin only
     <AuthGuard role="client" requireCompleted>
   ═══════════════════════════════════════════════════════════════ */

export interface AuthGuardProps {
  children: React.ReactNode;
  role?: (ROLES | string) | (ROLES | string)[];
  requireCompleted?: boolean;
  loadingFallback?: React.ReactNode;
}

export const AuthGuard = ({
  children,
  role,
}: AuthGuardProps) => {
  const { data: user, isLoading, isError } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user || isError) {
      router.replace(paths.auth.login.route(pathname));
      return;
    }

    const isApproved =
      user.is_completed && user.status?.toLowerCase() === "approved";

    const normalizedPathname = pathname.replace(/\/$/, "") || "/";
    const onboardingPath = paths.profile.onboarding.root.replace(/\/$/, "");
    const bannedPath = paths.profile.banned.root.replace(/\/$/, "");

    if (user.is_active === false && normalizedPathname !== bannedPath) {
      router.replace(paths.profile.banned.root);
    } else if (!isApproved && normalizedPathname !== onboardingPath) {
      router.replace(paths.profile.onboarding.root);
    }
  }, [user, isLoading, isError, pathname, router]);

  if (isLoading || !user || isError) return null;

  const normalizedPathname = pathname.replace(/\/$/, "") || "/";
  const onboardingPath = paths.profile.onboarding.root.replace(/\/$/, "");
  const bannedPath = paths.profile.banned.root.replace(/\/$/, "");

  if (user.is_active === false && normalizedPathname !== bannedPath)
    return null;
  const isApproved =
    user.is_completed && user.status?.toLowerCase() === "approved";
  if (!isApproved && normalizedPathname !== onboardingPath) return null;

  // Role check
  if (role) {
    const userRole = user.role?.toLowerCase();
    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!allowedRoles.map((r) => r.toLowerCase()).includes(userRole || "")) {
      return null;
    }
  }

  return <>{children}</>;
};

/* ═══════════════════════════════════════════════════════════════
   BACKWARD COMPATIBILITY
   Keep these working while you migrate call sites.
   Delete once all usages are replaced with <AuthGuard>.
   ═══════════════════════════════════════════════════════════════ */

/** @deprecated Use <AuthGuard> */
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard>{children}</AuthGuard>
);

/** @deprecated Use <AuthGuard requireCompleted> */
export const EnsureProfileCompleted = ({
  children,
}: {
  children: React.ReactNode;
}) => <AuthGuard requireCompleted>{children}</AuthGuard>;

/** @deprecated Use <AuthGuard role={role}> */
export const EnsureRole = ({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) => <AuthGuard role={role}>{children}</AuthGuard>;

/* ═══════════════════════════════════════════════════════════════
   UI-LEVEL AUTHORIZATION (different purpose from AuthGuard)
   - AuthGuard blocks route rendering + redirects
   - Authorization conditionally shows/hides UI elements
   ═══════════════════════════════════════════════════════════════ */

export const useAuthorization = () => {
  const { data } = useUser();

  const hasRole = React.useCallback(
    ({ role }: { role: ROLES | string }) => {
      if (role && data?.role) {
        return data.role.toLowerCase() === role.toLowerCase();
      }
      return !role;
    },
    [data],
  );

  return { hasRole };
};

type AuthorizationProps = {
  role: string;
  forbiddenFallback?: React.ReactNode;
  children: React.ReactNode;
};

export const Authorization = ({
  role,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { hasRole } = useAuthorization();
  const canAccess = role ? hasRole({ role }) : false;
  return <>{canAccess ? children : forbiddenFallback}</>;
};
