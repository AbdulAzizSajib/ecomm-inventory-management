export interface Product {
  ProductCode: string
  ProductName: string
  CategoryCode: number
  BrandCode: number
  PackSize: string
  TradePrice: number
  MRP: number
  Active: string
  PlantCode: string
  images?: string[]
}

export interface ProductListResponse {
  data: Product[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ProductListParams {
  page: number
  limit: number
  search: string
}

export interface ProductVariant {
  productCode: string
  variantId: number
  BarCode: string
  SKU: string
  SellingPrice: number
  Attributes: string
}
