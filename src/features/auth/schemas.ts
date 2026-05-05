import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(4, "Password must be at least 4 characters"),
})

export type LoginFormValues = z.infer<typeof loginSchema>
