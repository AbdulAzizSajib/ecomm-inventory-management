import { z } from "zod"

export const releaseHeaderSchema = z.object({
  PlantCode: z.string().min(1, "Plant code is required").trim(),
  StoreCode: z.string().min(1, "Store code is required").trim(),
  FgtnNo: z.string().trim(),
  ReceiveDate: z.string().min(1, "Receive date is required"),
  Period: z.string().min(1, "Period is required").trim(),
  Business: z.string().min(1, "Business is required").trim(),
  CreateBy: z.string().min(1, "Created by is required").trim(),
})

export type ReleaseHeaderValues = z.infer<typeof releaseHeaderSchema>
