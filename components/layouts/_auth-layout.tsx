"use client";
import { paths } from "@/config/paths";
import { useUser } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { Spinner } from "../ui/spinner";
export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from");

  useEffect(() => {
    if (!user || isLoading) return;

    const destination =
      user.role === "admin"
        ? paths.admin.dashboard.route()
        : paths.home.route();
    router.push(redirectTo || destination);
  }, [user, isLoading, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner size="base" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner size="base" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      {children}
    </div>
  );
};
