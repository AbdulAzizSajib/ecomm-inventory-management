import { z } from "zod"

export const brandFormSchema = z.object({
  BrandName: z
    .string()
    .min(1, "Name is required")
    .max(120, "Name must be 120 characters or fewer")
    .trim(),
  Active: z.boolean(),
})

export type BrandFormValues = z.infer<typeof brandFormSchema>
