export interface NotReleasedItem {
  QuarantineReceiveNo: string
  QuarantineReceiveDate: string
  FgtnNo: string
  Business: string
  ReferenceNo: string
  supplierId: number
}

export interface NotReleasedListResponse {
  page: number
  limit: number
  total: number
  totalPage: number
  data: NotReleasedItem[]
}

export interface NotReleasedDetailItem {
  QuarantineReceiveNo: string
  QuarantineReceiveDate: string
  FgtnNo: string
  Business: string
  ReferenceNo: string
  ProductCode: string
  variantId: number
  batchNo: string
  SKU: string
  BarCode: string
  Attributes: string
  RecQty: number
}

export interface NotReleasedDetailResponse {
  message?: string
  data: NotReleasedDetailItem[]
}

export interface CreateReleaseItemPayload {
  ProductCode: string
  VariantId: number
  BatchNo: string
  Quantity: number
  MFGDate: string
  ExpireDate: string
}

export interface CreateReleasePayload {
  PlantCode: string
  StoreCode: string
  FgtnNo: string
  ReceiveDate: string
  Period: string
  QuarantineReceiveNo: string
  Business: string
  CreateBy: string
  items: CreateReleaseItemPayload[]
}
