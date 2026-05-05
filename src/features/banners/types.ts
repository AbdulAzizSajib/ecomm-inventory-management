export type ActiveFlag = "0" | "1"

export interface Banner {
  BannerId: number
  ImageUrl?: string | null
  Image?: string | null
  StartDate: string
  EndDate: string
  Active: ActiveFlag
  [key: string]: unknown
}

export interface CreateBannerRequest {
  Active: 0 | 1
  StartDate: string
  EndDate: string
  image: File
}
