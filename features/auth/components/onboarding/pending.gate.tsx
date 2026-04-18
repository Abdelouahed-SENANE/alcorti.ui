"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SwitchLanguage } from "@/components/ui/language/switch-language";
import { ThemeToggle } from "@/components/ui/theme";
import { useLogout, useUser } from "@/lib/auth";
import { Clock, LogOutIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export const PendingApprovalGate = () => {
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
        <CardHeader className="text-center px-0 flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t(`${userRole}.complete.pending.title`, "Account Pending Approval")}
          </h2>
          <p className="text-sm text-card-foreground/70 mt-4">
            {t(
              `${userRole}.complete.pending.desc`,
              "Your profile has been completed and is currently being reviewed by our team. You will be notified once your account is approved.",
            )}
          </p>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <Button
            variant={"outline"}
            className="w-full gap-1"
            onClick={() => logout.mutate(undefined, { onSuccess: () => {} })}
            isLoading={logout.isPending}
          >
            <LogOutIcon className="h-4 w-4" />
            {t("navigation.logout", "Log Out")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
