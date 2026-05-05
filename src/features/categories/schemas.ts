import { z } from "zod"

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(120, "Name must be 120 characters or fewer")
    .trim(),
  attributes: z.array(z.number()),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
