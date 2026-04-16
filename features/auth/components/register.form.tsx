"use client";

import { Button } from "@/components/ui/button";
import { Form, Input } from "@/components/ui/form";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import { registerSchema, useRegister } from "@/lib/auth/auth";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const RegisterForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const register = useRegister({
    mutationConfig: {
      onSuccess: () => {
        router.replace(paths.auth.login.route(undefined));
      },
      onError: () => {
        toast({
          title: t("auth.register.error", "Register failed"),
          description: t("auth.register.error", "Register failed"),
          type: "error",
        });
      },
    },
  });

  const typeOptions: { label: string; value: "shipper" | "client" }[] = useMemo(
    () => [
      { label: t("users.fields.type.shipper", "Shipper"), value: "shipper" },
      { label: t("users.fields.type.client", "Client"), value: "client" },
    ],
    [t],
  );
  return (
    <Form
      schema={registerSchema}
      onSubmit={(values) => {
        register.mutate(values);
      }}
      className="space-y-4"
    >
      {(form) => (
        <>
          <div className="flex items-center justify-center gap-2">
            {typeOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => form.setValue("type", option.value)}
                type="button"
                className="flex-1"
                variant={
                  form.watch("type") === option.value ? "default" : "outline"
                }
              >
                {option.label}
              </Button>
            ))}
          </div>
          <Input
            label={t("users.fields.first_name.label", "First Name")}
            registration={form.register("first_name")}
            error={t(form.formState.errors.first_name?.message || "")}
          />
          <Input
            label={t("users.fields.last_name.label", "Last Name")}
            registration={form.register("last_name")}
            error={t(form.formState.errors.last_name?.message || "")}
          />
          <Input
            label={t("users.fields.cin.label", "CIN")}
            registration={form.register("cin")}
            error={t(form.formState.errors.cin?.message || "")}
          />
          <Input
            label={t("users.fields.phone.label", "Phone")}
            registration={form.register("phone")}
            error={t(form.formState.errors.phone?.message || "")}
          />
          <Input
            type="email"
            label={t("users.fields.email.label", "Email")}
            registration={form.register("email")}
            error={t(form.formState.errors.email?.message || "")}
          />
          <Input
            type="password"
            label={t("users.fields.password.label", "Password")}
            registration={form.register("password")}
            error={t(form.formState.errors.password?.message || "")}
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={register.isPending}
          >
            {t("auth.buttons.register", "Register")}
          </Button>
        </>
      )}
    </Form>
  );
};
