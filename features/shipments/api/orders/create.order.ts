import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { ORDER_KEYS } from "../../shipment.type";

export const shipmentItemSchema = z
  .object({
    id: z.string().optional(),
    description: z
      .string()
      .min(1, "shipments.form.items.description.errors.required")
      .max(255),
    image: z
      .file({ error: "shipments.form.items.image.errors.required" })
      .nullable(),
    length: z
      .number({ error: "shipments.form.items.length.errors.required" })
      .min(0.1, "shipments.form.items.length.errors.min"),
    width: z
      .number({ error: "shipments.form.items.width.errors.required" })
      .min(0.1, "shipments.form.items.width.errors.min"),
    height: z
      .number({ error: "shipments.form.items.height.errors.required" })
      .min(0.1, "shipments.form.items.height.errors.min"),
    weight: z
      .number({ error: "shipments.form.items.weight.errors.required" })
      .optional()
      .nullable(),
    is_weight: z.boolean().default(false),
    unit: z.enum(["cm", "m"], "shipments.form.items.unit.required"),
    deleted: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (data.is_weight) {
        return (
          data.weight !== undefined && data.weight !== null && data.weight > 0
        );
      }
      return true;
    },
    {
      message: "shipments.form.items.weight.min",
      path: ["weight"],
    },
  );

export const shipmentOrderSchema = z
  .object({
    category_id: z
      .string({ error: "shipments.form.category.errors.required" })
      .min(1, "shipments.form.category.errors.min"),
    description: z.string().max(2000).optional(),
    from_date: z.string({
      error: "shipments.form.available_from.errors.required",
    }), // ISO string
    to_date: z.string({ error: "shipments.form.available_to.errors.required" }), // ISO string
    origin_id: z.string({ error: "shipments.form.origin.errors.required" }),
    destination_id: z.string({
      error: "shipments.form.destination.errors.required",
    }),
    items: z
      .array(shipmentItemSchema)
      .min(1, "shipments.form.items.errors.min"),
  })
  .superRefine((data, ctx) => {
    if (data.origin_id === data.destination_id) {
      ctx.addIssue({
        code: "custom",
        message: "shipments.form.origin_destination_different",
        path: ["destination_id"],
      });
    }
  });

export type ShipmentItemInputs = z.infer<typeof shipmentItemSchema>;
export type ShipmentOrderInputs = z.infer<typeof shipmentOrderSchema>;

export const createShipment = async ({
  payload,
}: {
  payload: ShipmentOrderInputs;
}): Promise<ApiResponse<void>> => {
  const formData = new FormData();
  formData.append("category_id", payload.category_id);
  if (payload.description) {
    formData.append("description", payload.description);
  }
  formData.append("from_date", payload.from_date);
  formData.append("to_date", payload.to_date);
  formData.append("origin_id", payload.origin_id);
  formData.append("destination_id", payload.destination_id);
  payload.items.forEach((item, index) => {
    formData.append(`items[${index}][description]`, item.description);
    if (item.image) {
      formData.append(`items[${index}][image]`, item.image);
    }
    formData.append(`items[${index}][length]`, item.length.toString());
    formData.append(`items[${index}][width]`, item.width.toString());
    formData.append(`items[${index}][height]`, item.height.toString());
    if (item.weight) {
      formData.append(`items[${index}][weight]`, item.weight.toString());
    }
    formData.append(`items[${index}][is_weight]`, item.is_weight ? "1" : "0");
    formData.append(`items[${index}][unit]`, item.unit);
    formData.append(`items[${index}][deleted]`, item.deleted ? "1" : "0");
  });
  const response = await api$.post<ApiResponse<void>>(
    "/shipments/orders",
    formData,
  );
  return response.data;
};

export const useCreateOrder = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createShipment, ApiResponse<void>>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createShipment,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ORDER_KEYS.all, exact: false });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
