"use client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { paths } from "@/config/paths";
import { RegisterForm } from "@/features/auth/components/register.form";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const { t } = useTranslation();
  return (
    <Card className="w-full bg-card max-w-md space-y-4  backdrop-blur-xl p-8 rounded-md border border-border">
      <CardHeader className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          {t("auth.register.title", "Create an account")}
        </h2>
        <p className=" text-sm text-card-foreground/70">
          {t(
            "auth.register.description",
            "Join Alcorti and manage your business efficiently.",
          )}
        </p>
      </CardHeader>

      <CardContent className="p-0">
        <RegisterForm />
      </CardContent>

      <CardFooter className="text-center text-sm justify-center">
        <p className="text-card-foreground/70">
          {t("auth.register.already_have_account", "Already have an account?")}{" "}
          <Link
            href={paths.auth.login.route(undefined)}
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {t("auth.login.title", "Sign in")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
