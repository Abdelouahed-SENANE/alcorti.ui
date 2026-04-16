"use client";

import { Spinner } from "@/components/ui/spinner";
import { paths } from "@/config/paths";
import { useUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GuardPage() {
  const { data: user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace(paths.auth.login.route(undefined));
      return;
    }

    const role = user.role?.toLowerCase();

    if (role === "admin") {
      router.replace(paths.admin.dashboard.route());
    }
    else if ((role === "client" || role === "shipper") && !user.is_completed) {
      router.replace(
        role === "client"
          ? paths.complete.client.route()
          : paths.complete.shipper.route(),
      );
    }
    else {
      router.replace(paths.home.root);
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Spinner size="sm" />
    </div>
  );
}
