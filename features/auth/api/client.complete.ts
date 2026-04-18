import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { AUTH_KEY } from "@/lib/auth";
import { ApiResponse, AuthUser } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const completeClientInputSchema = z.object({
  attachments: z.preprocess(
    (val) => val || {},
    z.object({
      CIN_FRONT: z.instanceof(File, {
        message: "client.complete.fields.cin_front.errors.required",
      }),
      CIN_BACK: z.instanceof(File, {
        message: "client.complete.fields.cin_back.errors.required",
      }),
    }),
  ),
});

export type CompleteClientInput = z.infer<typeof completeClientInputSchema>;

const completeClientProfile = async (payload: CompleteClientInput) => {
  const formData = new FormData();
  formData.append("attachments[CIN_FRONT]", payload.attachments.CIN_FRONT);
  formData.append("attachments[CIN_BACK]", payload.attachments.CIN_BACK);

  try {
    const response = await api$.post<ApiResponse<AuthUser>>(
      "/complete/client",
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

export const useCompleteClientProfile = ({
  mutationConfig,
}: {
  mutationConfig: MutationConfig<
    typeof completeClientProfile,
    ApiResponse<AuthUser>
  >;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation<
    ApiResponse<AuthUser>,
    ApiResponse<AuthUser>,
    CompleteClientInput
  >({
    mutationFn: completeClientProfile,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [AUTH_KEY], exact: true });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
