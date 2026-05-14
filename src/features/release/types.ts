export interface ReleaseListItem {
  ReceiveNo: string
  PlantCode: string
  ReceiveDate: string
  FgtnNo: string
  StoreCode: string
  Mushok: string
  Business: string
  Returned: string
  Period: string
  QuarantineReceiveNo: string
  Stored: string
  CreateBy: string
  CreateDate: string
  EditBy: string
  EditDate: string | null
  Comment: string
}

export interface ReleaseListResponse {
  page: string
  limit: string
  total: number
  totalPage: number
  data: ReleaseListItem[]
}

export interface ReleaseDetailItem {
  ReceiveNo?: string
  ProductCode: string
  VariantId?: number
  BatchNo: string
  Quantity: number
  ReturnQuantity?: number
  MFGDate?: string | null
  ExpireDate?: string | null
  NewExpireDate?: string | null
}

export interface ReleaseDetail {
  master: ReleaseListItem
  items: ReleaseDetailItem[]
}

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
