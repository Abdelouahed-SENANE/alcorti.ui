import { z } from "zod";
export const createContactSchema = z.object({
  email: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v))

    .nullable()
    .optional()
    .refine((v) => !v || v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Invalid email address",
    }),
  mobile: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v))
    .nullable()
    .optional(),
  landline: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v))
    .nullable()
    .optional(),
  address: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v))
    .nullable()
    .optional(),
  postal: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v))
    .nullable()
    .optional(),
});

export const createLegalProfileSchema = z.object({
  business_register: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v))
    .nullable()
    .optional(),
  fiscal_id: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v))
    .nullable()
    .optional(),
  ice: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v))
    .nullable()
    .optional(),
  legal_status: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v))
    .nullable()
    .optional(),
  legal_representative: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v))
    .nullable()
    .optional(),
  legal_representative_phone: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v))
    .nullable()
    .optional(),
});
