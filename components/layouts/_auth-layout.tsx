"use client";
import { paths } from "@/config/paths";
import { useUser } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { Spinner } from "../ui/spinner";
export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading, isFetched } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from");

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  console.log(user);
  useEffect(() => {
    if (!isFetched || !user) return;
    const destination =
      user.role === "admin"
        ? paths.admin.dashboard.route()
        : paths.home.route();

    router.push(redirectTo || destination);
  }, [user]);

  if (!isFetched || !user || isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {children}
    </div>
  );
};
