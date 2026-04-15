"use client";

import { Button } from "@/components/ui/button";
import { Form, Input } from "@/components/ui/form";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import { loginSchema, useLogin } from "@/lib/auth/auth";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export const LoginForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const login = useLogin({
    onSuccess: () => {
      router.replace(paths.admin.dashboard.route());
    },
    onError: () => {
      toast({
        title: "Login failed",
        description: "Invalid credentials",
        type: "error",
      });
    },
  });

  return (
    <Form
      schema={loginSchema}
      onSubmit={(values) => {
        login.mutate(values);
      }}
      className="space-y-2"
    >
      {(form) => (
        <>
          <Input
            type="email"
            label={t("user.email.label", "Email")}
            registration={form.register("email")}
            error={t(form.formState.errors.email?.message || "")}
          />
          <Input
            type="password"
            label={t("user.password.label", "Password")}
            registration={form.register("password")}
            error={t(form.formState.errors.password?.message || "")}
          />

          <Button type="submit" className="w-full" isLoading={login.isPending}>
            {t("auth.login.submit", "Sign in")}
          </Button>
        </>
      )}
    </Form>
  );
};
