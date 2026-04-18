import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { AUTH_KEY } from "@/lib/auth";
import { ApiResponse, AuthUser } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const completeShipperInputSchema = z.object({
  vehicle_id: z
    .string({ error: "shipper.complete.fields.vehicle_id.errors.required" })
    .min(1, "shipper.complete.fields.vehicle_id.errors.required"),
  plate_number: z
    .string()
    .min(1, "shipper.complete.fields.plate_number.errors.required"),
  attachments: z.preprocess(
    (val) => val || {},
    z.object({
      CIN_FRONT: z.instanceof(File, {
        message:
          "shipper.complete.fields.attachments.cin_front.errors.required",
      }),
      CIN_BACK: z.instanceof(File, {
        message: "shipper.complete.fields.attachments.cin_back.errors.required",
      }),
      DRIVER_LICENSE: z.instanceof(File, {
        message:
          "shipper.complete.fields.attachments.driver_license.errors.required",
      }),
      REGISTRATION_DOCUMENT: z.instanceof(File, {
        message:
          "shipper.complete.fields.attachments.registration_document.errors.required",
      }),
    }),
  ),
});

export type CompleteShipperInput = z.infer<typeof completeShipperInputSchema>;

const completeShipperProfile = async ({
  payload,
}: {
  payload: CompleteShipperInput;
}): Promise<ApiResponse<AuthUser>> => {
  const formData = new FormData();

  if (payload.attachments.CIN_FRONT) {
    formData.append("attachments[CIN_FRONT]", payload.attachments.CIN_FRONT);
  }
  if (payload.attachments.CIN_BACK) {
    formData.append("attachments[CIN_BACK]", payload.attachments.CIN_BACK);
  }
  if (payload.attachments.DRIVER_LICENSE) {
    formData.append(
      "attachments[DRIVER_LICENSE]",
      payload.attachments.DRIVER_LICENSE,
    );
  }
  if (payload.attachments.REGISTRATION_DOCUMENT) {
    formData.append(
      "attachments[REGISTRATION_DOCUMENT]",
      payload.attachments.REGISTRATION_DOCUMENT,
    );
  }
  formData.append("vehicle_id", payload.vehicle_id);
  formData.append("plate_number", payload.plate_number);

  try {
    const response = await api$.post<ApiResponse<AuthUser>>(
      "/complete/shipper",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const useCompleteShipperProfile = ({
  mutationConfig,
}: {
  mutationConfig: MutationConfig<
    typeof completeShipperProfile,
    ApiResponse<AuthUser>
  >;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation<
    ApiResponse<AuthUser>,
    ApiResponse<AuthUser>,
    { payload: CompleteShipperInput }
  >({
    mutationFn: completeShipperProfile,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [AUTH_KEY], exact: true });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};
