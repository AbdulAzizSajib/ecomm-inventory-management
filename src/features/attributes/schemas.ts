import { z } from "zod"

export const attributeFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(120, "Name must be 120 characters or fewer")
    .trim(),
})

export type AttributeFormValues = z.infer<typeof attributeFormSchema>
