import { z } from "zod"

export const supplierFormSchema = z.object({
  SupplierCode: z
    .string()
    .min(1, "Code is required")
    .max(50, "Code must be 50 characters or fewer")
    .trim(),
  SupplierName: z
    .string()
    .min(1, "Name is required")
    .max(120, "Name must be 120 characters or fewer")
    .trim(),
  Address: z
    .string()
    .max(255, "Address must be 255 characters or fewer")
    .trim(),
  MobileNo: z
    .string()
    .max(30, "Mobile must be 30 characters or fewer")
    .trim(),
  Active: z.boolean(),
})

export type SupplierFormValues = z.infer<typeof supplierFormSchema>
