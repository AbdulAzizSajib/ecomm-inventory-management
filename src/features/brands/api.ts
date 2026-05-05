import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"

import type {
  Brand,
  CreateBrandRequest,
  UpdateBrandRequest,
} from "./types"

interface MessageResponse {
  message?: string
}

export async function getBrands(): Promise<Brand[]> {
  const { data } = await apiClient.get<Brand[]>(endpoints.brand.base)
  return Array.isArray(data) ? data : []
}

export async function getBrandById(id: number | string): Promise<Brand> {
  const { data } = await apiClient.get<Brand>(endpoints.brand.byId(id))
  return data
}

export async function createBrand(
  payload: CreateBrandRequest
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(
    endpoints.brand.base,
    payload
  )
  return data ?? {}
}

export async function updateBrand(
  id: number | string,
  payload: UpdateBrandRequest
): Promise<MessageResponse> {
  const { data } = await apiClient.put<MessageResponse>(
    endpoints.brand.byId(id),
    payload
  )
  return data ?? {}
}

export async function deleteBrand(
  id: number | string
): Promise<MessageResponse> {
  const { data } = await apiClient.delete<MessageResponse>(
    endpoints.brand.byId(id)
  )
  return data ?? {}
}
