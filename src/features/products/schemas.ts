import { z } from "zod"

export const productFormSchema = z.object({
  ProductCode: z.string().min(1, "Product code is required").trim(),
  ProductName: z.string().min(1, "Name is required").max(200).trim(),
  CategoryCode: z.string().min(1, "Category is required"),
  BrandCode: z.string().min(1, "Brand is required"),
  PackSize: z.string().min(1, "Pack size is required").trim(),
  TradePrice: z
    .string()
    .min(1, "Trade price is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Must be a positive number"),
  MRP: z
    .string()
    .min(1, "MRP is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Must be a positive number"),
  PlantCode: z.string().min(1, "Plant code is required").trim(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
