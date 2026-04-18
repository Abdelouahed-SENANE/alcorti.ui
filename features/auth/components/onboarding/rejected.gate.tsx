"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SwitchLanguage } from "@/components/ui/language/switch-language";
import { ThemeToggle } from "@/components/ui/theme";
import { CompleteProfileForm as ClientForm } from "@/features/auth/components/onboarding/client-complete.form";
import { CompleteProfileForm as ShipperForm } from "@/features/auth/components/onboarding/shipper-complete.form";
import { useLogout, useUser } from "@/lib/auth";
import { AlertCircle, CircleX, LogOutIcon, RefreshCcw, X, XCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface RejectedProfileGateProps {
  reason?: string | null;
}

export const RejectedProfileGate = ({ reason }: RejectedProfileGateProps) => {
  const { t } = useTranslation();
  const logout = useLogout();
  const { data: user } = useUser();
  const userRole = user?.role?.toLowerCase();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex relative items-center w-full h-screen justify-center bg-background/50 p-4 overflow-y-auto">
      <div className="absolute top-4 right-4 flex items-center justify-center gap-1">
        <SwitchLanguage />
        <ThemeToggle />
        <Button
          size={"icon"}
          onClick={() => logout.mutate(undefined, { onSuccess: () => {} })}
          className="rounded-full border-border border text-primary bg-transparent hover:bg-primary/10 hover:text-primary"
        >
          <LogOutIcon />
        </Button>
      </div>
      <Card className="w-full bg-card max-w-md space-y-4 backdrop-blur-xl p-8 rounded-md border border-border mt-10 my-8">
        {!showForm ? (
          <>
            <CardHeader className="text-center px-0 m-0 flex flex-col items-center">
              <div className="size-16 bg-destructive/10 rounded-full flex items-center justify-center mb-2">
                <XCircle className="size-10 text-destructive" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight">
                {t(`${userRole}.complete.rejected.title`, "Account Rejected")}
              </h2>
              {reason ? (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-2 text-left">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 mt-0.5 text-destructive shrink-0" />
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="text-sm text-destructive/90 leading-relaxed ">
                        {reason}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  {t(
                    `${userRole}.complete.rejected.desc`,
                    "Your profile was rejected. Please contact support for more information.",
                  )}
                </p>
              )}
            </CardHeader>
            <CardContent className="p-0 pt-4 space-y-3">
              <Button className="w-full gap-1" onClick={() => setShowForm(true)}>
                <RefreshCcw className="size-4" />
                {t("auth.buttons.resubmit", "Resubmit Documents")}
              </Button>
              <Button
                variant="outline"
                className="w-full gap-1"
                onClick={() =>
                  logout.mutate(undefined, { onSuccess: () => {} })
                }
                isLoading={logout.isPending}
              >
                <LogOutIcon className="size-4" />
                {t("navigation.logout", "Log Out")}
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center px-0">
              <h2 className="text-3xl font-bold tracking-tight">
                {t(`${userRole}.complete.title`, "Complete your profile")}
              </h2>
              <p className="text-sm text-card-foreground/70">
                {t(
                  `${userRole}.complete.desc`,
                  "Please provide the required information to continue.",
                )}
              </p>
            </CardHeader>
            <CardContent className="p-0">
              {userRole === "client" && <ClientForm />}
              {userRole === "shipper" && <ShipperForm />}
              <Button
                variant="outline"
                className="w-full mt-4 gap-1"
                onClick={() => setShowForm(false)}
              >
                <CircleX className="size-4" />
                {t("global.actions.cancel", "Cancel")}
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};
