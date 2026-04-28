"use client";

import { Spinner } from "@/components/ui/spinner";
import { paths } from "@/config/paths";
import { CompletionGate } from "@/features/auth/components/onboarding/completion.gate";
import { PendingApprovalGate } from "@/features/auth/components/onboarding/pending.gate";
import { RejectedProfileGate } from "@/features/auth/components/onboarding/rejected.gate";
import { AuthGuard, useUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function OnBoardingPage() {
  const { t } = useTranslation();
  const { data: user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.is_completed && user.status === "approved") {
      const role = user.role?.toLowerCase();
      const dashboard =
        role === "admin"
          ? paths.admin.dashboard.route()
          : role === "client"
            ? paths.client.route()
            : role === "shipper"
              ? paths.shipper.route()
              : paths.home.root;
      router.replace(dashboard);
    }
  }, [user, isLoading, router]);


  if (!user) return null;

  return (
    <AuthGuard>
      {!user.is_completed && <CompletionGate />}
      {user.status?.toLowerCase() === "pending" && <PendingApprovalGate />}
      {user.status?.toLowerCase() === "rejected" && (
        <RejectedProfileGate reason={user.rejection_reason} />
      )}
    </AuthGuard>
  );
}
