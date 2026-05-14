import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"

import type {
  CreateReleasePayload,
  NotReleasedDetailResponse,
  NotReleasedListResponse,
  ReleaseDetail,
  ReleaseListResponse,
} from "./types"

interface MessageResponse {
  message?: string
}

export interface GetReleasesParams {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
}

export async function getReleases(
  params: GetReleasesParams = {}
): Promise<ReleaseListResponse> {
  const { page = 1, limit = 10, startDate, endDate } = params
  const query: Record<string, string | number> = { page, limit }
  if (startDate) query.startDate = startDate
  if (endDate) query.endDate = endDate
  const { data } = await apiClient.get<ReleaseListResponse>(
    endpoints.release.base,
    { params: query }
  )
  return data
}

export async function getReleaseById(id: string): Promise<ReleaseDetail> {
  const { data } = await apiClient.get<ReleaseDetail>(
    endpoints.release.byId(id)
  )
  return data
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
