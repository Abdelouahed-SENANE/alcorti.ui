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
    mutationConfig: {
      onSuccess: (res) => {
        const user = res.data;
        const role = user?.role?.toLowerCase();
        if (role === "client") {
          router.replace(paths.client.shipments.orders.route());
        } else if (role === "admin") {
          router.replace(paths.admin.dashboard.route());
        } else if (role === "shipper") {
          router.replace(paths.shipper.shipments.orders.available.route());
        } else {
          router.replace(paths.home.root);
        }
      },
      onError: (res: any) => {
        toast({
          title: res.response.data.message,
          type: "error",
        });
      },
    },
  });

  return (
    <Form
      schema={loginSchema}
      onSubmit={(values) => {
        login.mutate(values);
      }}
      className="space-y-2 "
    >
      {(form) => (
        <>
          <Input
            type="text"
            label={t("auth.fields.login.label", "Email/CNI")}
            registration={form.register("login")}
            error={t(form.formState.errors.login?.message || "")}
          />
          <Input
            type="password"
            label={t("auth.fields.password.label", "Password")}
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
