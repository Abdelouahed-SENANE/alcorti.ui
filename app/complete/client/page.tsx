"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CompleteProfileForm } from "@/features/client/components/complete-profile.form";
import { EnsureProfileCompleted } from "@/lib/auth/auth";
import { useTranslation } from "react-i18next";
// Note: Normally we check here if user is logged in, but ProtectedRoute might wrap this, or we handle it on client. Let's make it simple for now as an auth-like layout.

export default function CompleteClientProfilePage() {
  const { t } = useTranslation();
  return (
    <EnsureProfileCompleted>
      <div className="min-h-screen flex items-center justify-center bg-background/50">
        <Card className="w-full bg-card max-w-md space-y-4 backdrop-blur-xl p-8 rounded-md border border-border">
          <CardHeader className="text-center px-0">
            <h2 className="text-3xl font-bold tracking-tight">
              {t("client.complete.title")}
            </h2>
            <p className="text-sm text-card-foreground/70">
              {t("client.complete.desc")}
            </p>
          </CardHeader>

          <CardContent className="p-0">
            <CompleteProfileForm />
          </CardContent>
        </Card>
      </div>
    </EnsureProfileCompleted>
  );
}
