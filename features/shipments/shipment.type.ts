import { z } from "zod";

export const shipmentItemSchema = z
  .object({
    id: z.string().optional(),
    description: z
      .string()
      .min(1, "shipments.form.items.description.errors.required")
      .max(255),
    image: z.file().nullable(), // Handle File objects in the form
    length: z.number({ error: "shipments.form.items.length.errors.required" }).min(0.1, "shipments.form.items.length.errors.min"),
    width: z.number({ error: "shipments.form.items.width.errors.required" }).min(0.1, "shipments.form.items.width.errors.min"),
    height: z.number({ error: "shipments.form.items.height.errors.required" }).min(0.1, "shipments.form.items.height.errors.min"),
    weight: z.number({ error: "shipments.form.items.weight.errors.required" }).optional().nullable(),
    is_weight: z.boolean().default(false),
    unit: z.enum(["cm", "m"], "shipments.form.items.unit.required"),
    deleted: z.boolean().optional(),
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
    from_date: z.string({ error: "shipments.form.from_date.errors.required" }), // ISO string
    to_date: z.string({ error: "shipments.form.to_date.errors.required" }), // ISO string
    origin_id: z.string({ error: "shipments.form.origin.errors.required" }),
    destination_id: z.string({
      error: "shipments.form.destination.errors.required",
    }),
    items: z
      .array(shipmentItemSchema)
      .min(1, "shipments.form.items.errors.min"),
  })
  .refine((data) => data.origin_id !== data.destination_id, {
    message: "shipments.form.origin_destination_different",
    path: ["destination_id"],
  });

export type ShipmentItemInputs = z.infer<typeof shipmentItemSchema>;
export type ShipmentOrderInputs = z.infer<typeof shipmentOrderSchema>;

export const SHIPMENT_KEYS = {
  all: ["shipments"],
  lists: () => [...SHIPMENT_KEYS.all, "list"],
  list: (params: any) => [...SHIPMENT_KEYS.lists(), params],
};
