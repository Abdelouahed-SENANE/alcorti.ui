"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SwitchLanguage } from "@/components/ui/language/switch-language";
import { ThemeToggle } from "@/components/ui/theme";
import { CompleteProfileForm as ClientForm } from "@/features/auth/components/onboarding/client-complete.form";
import { CompleteProfileForm as ShipperForm } from "@/features/auth/components/onboarding/shipper-complete.form";
import { useLogout, useUser } from "@/lib/auth";
import { LogOutIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export const CompletionGate = () => {
  const { t } = useTranslation();
  const logout = useLogout();
  const { data: user } = useUser();
  const userRole = user?.role?.toLowerCase();

  return (
    <div className="flex relative items-center w-full h-screen justify-center bg-background/50 p-4">
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
      <Card className="w-full bg-card max-w-md space-y-4 backdrop-blur-xl p-8 rounded-md border border-border mt-10">
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
        </CardContent>
      </Card>
    </div>
  );
};
