"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FileInput } from "@/components/ui/form/file-input";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import {
  completeClientInputSchema,
  useCompleteClientProfile,
} from "@/features/client/api/complete-profile";
import { useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export const CompleteProfileForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

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

        router.replace(paths.home.route());
      },
      onError: () => {
        toast({
          title: t("client.profile.complete.error.title", "Error"),
          description: t(
            "client.profile.complete.error.desc",
            "An error occurred while completing your profile.",
          ),
          type: "error",
        });
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
              {t("client.profile.cin_front.label", "CIN Front")}
              <span className="mx-0.5 text-destructive">*</span>
            </label>
            <FileInput
              accept="image/*"
              multiple={false}
              onFilesSelect={(files) => {
                form.setValue("attachments.CIN_FRONT", files[0], {
                  shouldValidate: true,
                });
              }}
              error={
                (form.formState.errors.attachments?.CIN_FRONT?.message &&
                  t(form.formState.errors.attachments?.CIN_FRONT?.message)) ||
                undefined
              }
            />

            <label htmlFor="cin_back" className="text-sm">
              {t("client.profile.cin_back.label", "CIN Back")}
              <span className="mx-0.5 text-destructive">*</span>
            </label>
            <FileInput
              accept="image/*"
              multiple={false}
              onFilesSelect={(files) => {
                form.setValue("attachments.CIN_BACK", files[0], {
                  shouldValidate: true,
                });
              }}
              error={t(
                form.formState.errors.attachments?.CIN_BACK?.message || "",
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={completeProfile.isPending}
          >
            {t("client.profile.submit", "Complete Profile")}
          </Button>
        </>
      )}
    </Form>
  );
};
