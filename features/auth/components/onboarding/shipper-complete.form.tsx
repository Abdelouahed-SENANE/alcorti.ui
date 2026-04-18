"use client";

import { Button } from "@/components/ui/button";
import { Form, ImageUpload, Input } from "@/components/ui/form";
import { toast } from "@/components/ui/toast/use-toast";
import { VehicleSelector } from "@/features/admin/vehicles/components/vehicle.selector";
import {
  completeShipperInputSchema,
  useCompleteShipperProfile,
} from "@/features/auth/api/shipper.complete";
import { ApiResponse, AuthUser } from "@/types/api";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const CompleteProfileForm = () => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const completeProfile = useCompleteShipperProfile({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: t("shipper.complete.success.title", "Profile Completed"),
          description: t(
            "shipper.complete.success.desc",
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
      schema={completeShipperInputSchema}
      onSubmit={(payload) => {
        completeProfile.mutate({ payload });
      }}
      className="space-y-4"
    >
      {(form) => (
        <>
          <div className="space-y-2">
            <div>
              <Controller
                name="vehicle_id"
                control={form.control}
                render={({ field }) => (
                  <VehicleSelector
                    isRequired
                    onSelect={(option) => {
                      field.onChange(option.value);
                    }}
                    error={
                      (form.formState.errors.vehicle_id?.message &&
                        t(form.formState.errors.vehicle_id?.message)) ||
                      errors["vehicle_id"]?.[0]
                    }
                  />
                )}
              />
            </div>
            <div>
              <Input
                type="text"
                isRequired
                label={t(
                  "shipper.complete.fields.plate_number.label",
                  "Plate Number",
                )}
                {...form.register("plate_number")}
                error={t(
                  form.formState.errors.plate_number?.message ||
                    errors["plate_number"]?.[0] ||
                    "",
                )}
              />
            </div>
            <div>
              <label
                htmlFor="cin_front"
                className="text-sm flex items-center  ltr:text-left rtl:text-right"
              >
                <span>
                  {t(
                    "shipper.complete.fields.attachments.cin_front.label",
                    "CIN Front",
                  )}
                </span>
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
            </div>

            <div>
              {" "}
              <label
                htmlFor="cin_back"
                className="text-sm flex items-center  ltr:text-left rtl:text-right"
              >
                <span>
                  {t(
                    "shipper.complete.fields.attachments.cin_back.label",
                    "CIN Back",
                  )}
                </span>
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
                  undefined
                }
              />
            </div>

            <div>
              <label
                htmlFor="driver_license"
                className="text-sm flex items-center  ltr:text-left rtl:text-right"
              >
                <span>
                  {t(
                    "shipper.complete.fields.attachments.driver_license.label",
                    "Driver License",
                  )}
                </span>
                <span className="mx-0.5 text-destructive">*</span>
              </label>
              <ImageUpload
                accept="image/*"
                onChange={(file) => {
                  if (!file) return;
                  form.setValue("attachments.DRIVER_LICENSE", file, {
                    shouldValidate: true,
                  });
                }}
                error={
                  (form.formState.errors.attachments?.DRIVER_LICENSE?.message &&
                    t(
                      form.formState.errors.attachments?.DRIVER_LICENSE
                        ?.message,
                    )) ||
                  undefined
                }
              />
            </div>
            <div>
              <label
                htmlFor="registration_document"
                className="text-sm flex items-center tr:text-left rtl:text-right"
              >
                <span>
                  {t(
                    "shipper.complete.fields.attachments.registration_document.label",
                    "Registration Document",
                  )}
                </span>
                <span className="mx-0.5 text-destructive">*</span>
              </label>
              <ImageUpload
                accept="image/*"
                onChange={(file) => {
                  if (!file) return;
                  form.setValue("attachments.REGISTRATION_DOCUMENT", file, {
                    shouldValidate: true,
                  });
                }}
                error={
                  (form.formState.errors.attachments?.REGISTRATION_DOCUMENT
                    ?.message &&
                    t(
                      form.formState.errors.attachments?.REGISTRATION_DOCUMENT
                        ?.message,
                    )) ||
                  undefined
                }
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={completeProfile.isPending}
          >
            {t("shipper.complete.submit", "Complete Profile")}
          </Button>
        </>
      )}
    </Form>
  );
};
