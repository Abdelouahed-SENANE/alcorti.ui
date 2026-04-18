"use client";

import { Button } from "@/components/ui/button";
import { Form, ImageUpload } from "@/components/ui/form";
import { toast } from "@/components/ui/toast/use-toast";
import {
  completeClientInputSchema,
  useCompleteClientProfile,
} from "@/features/auth/api/client.complete";
import { ApiResponse, AuthUser } from "@/types/api";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const CompleteProfileForm = () => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const completeProfile = useCompleteClientProfile({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: t(
            "client.profile.complete.success.title",
            "Profile Completed",
          ),
          description: t(
            "client.profile.complete.success.desc",
            "Your profile has been completed successfully.",
          ),
          type: "success",
        });
      },
      onError: (error: ApiResponse<AuthUser>) => {
        const serverErrors = error.errors;
        if (serverErrors) {
          setErrors(serverErrors);
        } else {
          toast({
            title: error.message || t("global.errors.something_went_wrong"),
            type: "error",
          });
        }
      },
    },
  });

  return (
    <Form
      schema={completeClientInputSchema}
      onSubmit={(values) => {
        completeProfile.mutate(values);
      }}
      className="space-y-4"
    >
      {(form) => (
        <>
          <div className="space-y-4">
            <label htmlFor="cin_front" className="text-sm">
              {t("client.complete.fields.cin_front.label", "CIN Front")}
              <span className="mx-0.5 text-destructive">*</span>
            </label>
            <ImageUpload
              accept="image/*"
              onChange={(file) => {
                if (!file) return;
                form.setValue("attachments.CIN_FRONT", file, {
                  shouldValidate: true,
                });
              }}
              error={
                (form.formState.errors.attachments?.CIN_FRONT?.message &&
                  t(form.formState.errors.attachments?.CIN_FRONT?.message)) ||
                errors["attachments.CIN_FRONT"]?.[0]
              }
            />

            <label htmlFor="cin_back" className="text-sm">
              {t("client.complete.fields.cin_back.label", "CIN Back")}
              <span className="mx-0.5 text-destructive">*</span>
            </label>
             <ImageUpload
                accept="image/*"
                onChange={(file) => {
                  if (!file) return;
                  form.setValue("attachments.CIN_BACK", file, {
                    shouldValidate: true,
                  });
                }}
                error={
                  (form.formState.errors.attachments?.CIN_BACK?.message &&
                    t(form.formState.errors.attachments?.CIN_BACK?.message)) ||
                  errors["attachments.CIN_BACK"]?.[0]
                }
              />
          </div>

          <Button
            type="submit"
            className="w-full gap-1"
            isLoading={completeProfile.isPending}
          >
            <CheckCircle className="size-4" />
            {t("auth.buttons.complete", "Complete Profile")}
          </Button>
        </>
      )}
    </Form>
  );
};
