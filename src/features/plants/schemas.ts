import { z } from "zod"

export const plantFormSchema = z.object({
  PlantCode: z
    .string()
    .min(1, "Code is required")
    .max(20, "Code must be 20 characters or fewer")
    .trim(),
  PlantName: z
    .string()
    .min(1, "Name is required")
    .max(120, "Name must be 120 characters or fewer")
    .trim(),
  PlantAddress: z
    .string()
    .min(1, "Address is required")
    .max(255, "Address must be 255 characters or fewer")
    .trim(),
  PlantEmail: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email")
    .max(120, "Email must be 120 characters or fewer")
    .trim(),
  PlantPhone: z
    .string()
    .min(1, "Phone is required")
    .max(30, "Phone must be 30 characters or fewer")
    .trim(),
  Active: z.boolean(),
})

export type PlantFormValues = z.infer<typeof plantFormSchema>
