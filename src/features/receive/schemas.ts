import { z } from "zod"

export const receiveHeaderSchema = z.object({
  PlantCode: z.string().min(1, "Plant code is required").trim(),
  StoreCode: z.string().min(1, "Store code is required").trim(),
  QuarantineReceiveDate: z.string().min(1, "Date is required"),
  Period: z.string().min(1, "Period is required").trim(),
  SupplierId: z.string().min(1, "Supplier is required"),
  ReferenceNo: z.string().min(1, "Reference No is required").trim(),
  Business: z.string().min(1, "Business is required").trim(),
  CreateBy: z.string().min(1, "Created by is required").trim(),
})

export type ReceiveHeaderValues = z.infer<typeof receiveHeaderSchema>

export const receiveEditSchema = z.object({
  Comment: z.string().trim(),
  EditBy: z.string().min(1, "Edited by is required").trim(),
})

export type ReceiveEditValues = z.infer<typeof receiveEditSchema>
