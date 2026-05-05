import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"

import type { Banner, CreateBannerRequest } from "./types"

interface MessageResponse {
  message?: string
}

interface BannerListResponse {
  data?: Banner[]
}

export async function getBanners(): Promise<Banner[]> {
  const { data } = await apiClient.get<Banner[] | BannerListResponse>(
    endpoints.banner.base
  )
  if (Array.isArray(data)) return data
  return Array.isArray(data?.data) ? data.data : []
}

interface BannerDetailResponse {
  data?: Banner
}

function isBannerDetailResponse(
  value: unknown
): value is BannerDetailResponse {
  return (
    !!value &&
    typeof value === "object" &&
    "data" in value &&
    !!(value as BannerDetailResponse).data
  )
}

export async function getBannerById(id: number | string): Promise<Banner> {
  const { data } = await apiClient.get<Banner | BannerDetailResponse>(
    endpoints.banner.byId(id)
  )
  if (isBannerDetailResponse(data) && data.data) {
    return data.data
  }
  return data as Banner
}

export async function createBanner(
  payload: CreateBannerRequest
): Promise<MessageResponse> {
  const form = new FormData()
  form.append("Active", String(payload.Active))
  form.append("StartDate", payload.StartDate)
  form.append("EndDate", payload.EndDate)
  form.append("image", payload.image)

  const { data } = await apiClient.post<MessageResponse>(
    endpoints.banner.base,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  )
  return data ?? {}
}
