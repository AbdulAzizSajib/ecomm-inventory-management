import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"

import type {
  CreatePlantRequest,
  Plant,
  UpdatePlantRequest,
} from "./types"

interface MessageResponse {
  message?: string
}

interface PlantListResponse {
  data?: Plant[]
}

export async function getPlants(): Promise<Plant[]> {
  const { data } = await apiClient.get<Plant[] | PlantListResponse>(
    endpoints.plant.base
  )
  if (Array.isArray(data)) return data
  return Array.isArray(data?.data) ? data.data : []
}

interface PlantDetailResponse {
  data?: Plant
}

export async function getPlantByCode(code: string): Promise<Plant> {
  const { data } = await apiClient.get<Plant | PlantDetailResponse>(
    endpoints.plant.byCode(code)
  )
  if (data && typeof data === "object" && "data" in data && data.data) {
    return data.data
  }
  return data as Plant
}

export async function createPlant(
  payload: CreatePlantRequest
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(
    endpoints.plant.base,
    payload
  )
  return data ?? {}
}

export async function updatePlant(
  code: string,
  payload: UpdatePlantRequest
): Promise<MessageResponse> {
  const { data } = await apiClient.put<MessageResponse>(
    endpoints.plant.byCode(code),
    payload
  )
  return data ?? {}
}

export async function deletePlant(code: string): Promise<MessageResponse> {
  const { data } = await apiClient.delete<MessageResponse>(
    endpoints.plant.byCode(code)
  )
  return data ?? {}
}
