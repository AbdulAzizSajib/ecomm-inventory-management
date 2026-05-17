export type ActiveFlag = "0" | "1"

export interface Banner {
  BannerId: number
  ImageUrl?: string | null
  Image?: string | null
  Path?: string | null
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

export interface UpdateBannerRequest {
  id: number | string
  Active: 0 | 1
  StartDate: string
  EndDate: string
  image?: File
}
