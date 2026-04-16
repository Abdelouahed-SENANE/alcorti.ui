"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RouterLink } from "@/components/ui/link";
import { paths } from "@/config/paths";
import { LoginForm } from "@/features/auth/components/login.form";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full min-w-sm">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">
            {t("auth.login.title", "Welcome back")}
          </CardTitle>
          <CardDescription>
            {t(
              "auth.login.description",
              "Enter your credentials to access your account",
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <div>
          <p className="text-center text-sm text-muted-foreground">
            {t("auth.login.no_account", "Don't have an account?")}{" "}
            <RouterLink
              to={paths.auth.register.route(undefined)}
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {t("auth.register.title", "Sign up")}
            </RouterLink>
          </p>
        </div>
      </Card>
    </div>
  );
}
