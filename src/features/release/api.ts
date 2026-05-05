import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"

import type {
  CreateReleasePayload,
  NotReleasedDetailResponse,
  NotReleasedListResponse,
} from "./types"

interface MessageResponse {
  message?: string
}

export async function getNotReleased(
  page = 1,
  limit = 10,
  search = ""
): Promise<NotReleasedListResponse> {
  const { data } = await apiClient.get<NotReleasedListResponse>(
    endpoints.receive.notReleased,
    { params: { page, limit, search } }
  )
  return data
}

export async function getNotReleasedItems(
  quarantineReceiveNo: string
): Promise<NotReleasedDetailResponse> {
  const { data } = await apiClient.get<NotReleasedDetailResponse>(
    endpoints.receive.notReleasedItems(quarantineReceiveNo)
  )
  return data
}

export async function createRelease(
  payload: CreateReleasePayload
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(
    endpoints.release.base,
    payload
  )
  return data ?? {}
}
