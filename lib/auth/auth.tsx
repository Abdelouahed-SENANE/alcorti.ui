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
  requireCompleted = false,
}: AuthGuardProps) => {
  const { data: user, isLoading, isError } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const resolution = React.useMemo(() => {
    if (isLoading) return { status: "loading" as const };
    if (!user || isError) {
      return {
        status: "redirect" as const,
        to: paths.auth.login.route(pathname),
      };
    }

    if (user.is_active === false) {
      return { status: "banned" as const };
    }

    if (role) {
      const allowedRoles = Array.isArray(role)
        ? role.map((r) => r.toLowerCase())
        : [role.toLowerCase()];

      if (!allowedRoles.includes(user.role?.toLowerCase() || "")) {
        return { status: "redirect" as const, to: paths.home.route() };
      }
    }
    if (requireCompleted) {
      const userRole = user.role?.toLowerCase();
      const isClientOrShipper = userRole === "client" || userRole === "shipper";

      if (isClientOrShipper) {
        if (!user.is_completed) {
          return { status: "gate" as const };
        }
        if (user.status === "pending") {
          return { status: "pending" as const };
        }
        if (user.status === "rejected") {
          return { status: "rejected" as const };
        }
      }
    }

    return { status: "allow" as const };
  }, [user, isLoading, isError, role, requireCompleted]);

  useEffect(() => {
    if (resolution.status === "redirect") {
      router.replace(resolution.to);
    }
  }, [resolution, router]);

  if (resolution.status === "loading") return null;
  if (resolution.status === "redirect") return null;

  if (resolution.status === "gate") {
    const {
      CompletionGate,
    } = require("@/features/auth/components/onboarding/completion.gate");
    return <CompletionGate />;
  }

  if (resolution.status === "pending") {
    const {
      PendingApprovalGate,
    } = require("@/features/auth/components/onboarding/pending.gate");
    return <PendingApprovalGate />;
  }

  if (resolution.status === "rejected" && user) {
    const {
      RejectedProfileGate,
    } = require("@/features/auth/components/onboarding/rejected.gate");
    return <RejectedProfileGate reason={user.rejection_reason} />;
  }

  if (resolution.status === "banned") {
    const {
      BannedGate,
    } = require("@/features/auth/components/onboarding/banned.gate");
    return <BannedGate />;
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
