export interface StockStatementParams {
  plant: string
  business: string
  fromDate: string
  toDate: string
}

export interface StockStatementRow {
  ProductCode: string
  VariantId: number
  ProductName: string
  SKU: string | null
  PackSize: string
  Opening: number
  Receive: number
  Issue: number
  Adjustment: number
  Closing: number
}

export interface CurrentStockParams {
  plant: string
  business: string
}

export interface CurrentStockRow {
  ProductCode: string
  NotRelease: number
  SB_Balance: number
  NotRelease_SBBalance: number
  TradePrice: number
  ProductName: string
  SKU: string | null
}

export interface CurrentStockResponse {
  message?: string
  data: CurrentStockRow[]
}
