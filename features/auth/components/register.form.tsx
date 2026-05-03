"use client";

import { Button } from "@/components/ui/button";
import { Form, Input } from "@/components/ui/form";
import { RadioCards } from "@/components/ui/form/radio-cards";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import { RegisterInputs, registerSchema, useRegister } from "@/lib/auth/auth";
import { Truck, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export const RegisterForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [errors, setErrors] =
    useState<Record<keyof RegisterInputs, string[]>>();
  const register = useRegister({
    mutationConfig: {
      onSuccess: () => {
        router.replace(paths.auth.login.route(undefined));
      },
      onError: (res: any) => {
        if (res.status === 422) {
          setErrors(res.response.data.errors);
          toast({
            title: t("auth.register.err_validation"),
            type: "error",
          });
        } else {
          toast({
            title: t("auth.register.error", "Register failed"),
            description: t("auth.register.error", "Register failed"),
            type: "error",
          });
        }
      },
    },
  });

  const typeOptions = useMemo(
    () => [
      {
        title: t("users.fields.role.shipper", "Shipper"),
        value: "shipper",
        icon: <Truck />,
      },
      {
        title: t("users.fields.role.client", "Client"),
        value: "client",
        icon: <User />,
      },
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
          <RadioCards
            options={typeOptions}
            value={form.watch("type")}
            onChange={(val) =>
              form.setValue("type", val as "shipper" | "client")
            }
            error={t(
              form.formState.errors.type?.message || errors?.type?.[0] || "",
            )}
          />
          <Input
            label={t("users.fields.first_name.label", "First Name")}
            registration={form.register("first_name")}
            error={t(
              form.formState.errors.first_name?.message ||
                errors?.first_name?.[0] ||
                "",
            )}
          />
          <Input
            label={t("users.fields.last_name.label", "Last Name")}
            registration={form.register("last_name")}
            error={t(
              form.formState.errors.last_name?.message ||
                errors?.last_name?.[0] ||
                "",
            )}
          />
          <Input
            label={t("users.fields.cin.label", "CIN")}
            registration={form.register("cin")}
            error={t(
              form.formState.errors.cin?.message || errors?.cin?.[0] || "",
            )}
          />
          <Input
            label={t("users.fields.phone.label", "Phone")}
            registration={form.register("phone")}
            error={t(
              form.formState.errors.phone?.message || errors?.phone?.[0] || "",
            )}
          />
          <Input
            type="email"
            label={t("users.fields.email.label", "Email")}
            registration={form.register("email")}
            error={t(
              form.formState.errors.email?.message ||
                errors?.email?.[0] ||
                "",
            )}
          />
          <Input
            type="password"
            label={t("users.fields.password.label", "Password")}
            registration={form.register("password")}
            error={t(
              form.formState.errors.password?.message ||
                errors?.password?.[0] ||
                "",
            )}
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
