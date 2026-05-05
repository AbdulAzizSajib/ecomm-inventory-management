export interface ReceiveListItem {
  QuarantineReceiveNo: string
  PlantCode: string
  QuarantineReceiveDate: string
  FgtnNo: string
  SupplierId: number
  ReferenceNo: string
  ReferenceDate: string | null
  StoreCode: string
  Business: string
  Returned: string
  Period: string
  CreateBy: string
  CreateDate: string
  EditBy: string
  EditDate: string | null
  Comment: string
  IsPaid: number
  PaidUserId: string | null
  PaidDate: string | null
  AccountingDate: string | null
}

export interface ReceiveListResponse {
  page: string
  limit: string
  total: number
  totalPage: number
  data: ReceiveListItem[]
}

export interface ReceiveDetailItem {
  ProductCode: string
  VariantId?: number
  BatchNo: string
  Quantity: number
  CostPrice?: number
  CartonPack?: number
  MFGDate?: string | null
  ExpireDate?: string | null
}

export interface ReceiveDetail extends ReceiveListItem {
  items?: ReceiveDetailItem[]
}

export interface ProductSearchResult {
  VariantId: number
  ProductCode: string
  BarCode: string
  SKU: string
  Attributes: string
}

export interface CreateReceiveItemPayload {
  ProductCode: string
  VariantId: number
  BatchNo: string
  Quantity: number
  CostPrice: number
  CartonPack: number
  MFGDate: string
  ExpireDate: string
}

export interface CreateReceivePayload {
  PlantCode: string
  StoreCode: string
  QuarantineReceiveDate: string
  Period: string
  SupplierId: string
  ReferenceNo: string
  Business: string
  CreateBy: string
  items: CreateReceiveItemPayload[]
}

export interface UpdateReceiveItemPayload {
  ProductCode: string
  BatchNo: string
  Quantity: number
}

export interface UpdateReceivePayload {
  Comment: string
  EditBy: string
  items: UpdateReceiveItemPayload[]
}
