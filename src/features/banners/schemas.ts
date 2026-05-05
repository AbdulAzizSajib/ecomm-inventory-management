import { z } from "zod"

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]

const fileSchema =
  typeof File === "undefined"
    ? z.any()
    : z
        .instanceof(File, { message: "Image is required" })
        .refine((f) => f.size > 0, "Image is required")
        .refine(
          (f) => f.size <= MAX_IMAGE_BYTES,
          "Image must be 5 MB or smaller"
        )
        .refine(
          (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
          "Image must be JPG, PNG, WEBP, or GIF"
        )

export const bannerFormSchema = z
  .object({
    StartDate: z.string().min(1, "Start date is required"),
    EndDate: z.string().min(1, "End date is required"),
    Active: z.boolean(),
    image: fileSchema,
  })
  .refine((v) => !v.StartDate || !v.EndDate || v.StartDate <= v.EndDate, {
    message: "End date must be on or after start date",
    path: ["EndDate"],
  })

export type BannerFormValues = z.infer<typeof bannerFormSchema>
