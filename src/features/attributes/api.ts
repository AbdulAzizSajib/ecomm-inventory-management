import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"

import type {
  Attribute,
  CreateAttributeRequest,
  UpdateAttributeRequest,
} from "./types"

export async function getAttributes(): Promise<Attribute[]> {
  const { data } = await apiClient.get<Attribute[]>(endpoints.attribute.base)
  return Array.isArray(data) ? data : []
}

export async function getAttributeById(id: number | string): Promise<Attribute> {
  const { data } = await apiClient.get<Attribute>(endpoints.attribute.byId(id))
  return data
}

export async function createAttribute(
  payload: CreateAttributeRequest
): Promise<Attribute | null> {
  const { data } = await apiClient.post<Attribute | null>(
    endpoints.attribute.base,
    payload
  )
  return data ?? null
}

export async function updateAttribute(
  id: number | string,
  payload: UpdateAttributeRequest
): Promise<Attribute | null> {
  const { data } = await apiClient.put<Attribute | null>(
    endpoints.attribute.byId(id),
    payload
  )
  return data ?? null
}

export async function deleteAttribute(id: number | string): Promise<void> {
  await apiClient.delete(endpoints.attribute.byId(id))
}
