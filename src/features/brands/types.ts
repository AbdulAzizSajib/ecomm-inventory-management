export type ActiveFlag = "Y" | "N"

export interface Brand {
  BrandCode: number
  BrandName: string
  Active: ActiveFlag
}

export interface BrandRequest {
  BrandName: string
  Active: ActiveFlag
}

export type CreateBrandRequest = BrandRequest
export type UpdateBrandRequest = BrandRequest
