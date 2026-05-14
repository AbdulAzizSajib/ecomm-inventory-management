import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"

import type {
  CreateReceivePayload,
  ProductSearchResult,
  ReceiveDetail,
  ReceiveListResponse,
  UpdateReceivePayload,
} from "./types"

interface MessageResponse {
  message?: string
}

export interface GetReceivesParams {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
}

export async function getReceives(
  params: GetReceivesParams = {}
): Promise<ReceiveListResponse> {
  const { page = 1, limit = 10, startDate, endDate } = params
  const query: Record<string, string | number> = { page, limit }
  if (startDate) query.startDate = startDate
  if (endDate) query.endDate = endDate
  const { data } = await apiClient.get<ReceiveListResponse>(
    endpoints.receive.base,
    { params: query }
  )
  return data
}

export async function getReceiveById(id: string): Promise<ReceiveDetail> {
  const { data } = await apiClient.get<ReceiveDetail>(
    endpoints.receive.byId(id)
  )
  return data
}

export async function searchProducts(
  keyword: string
): Promise<ProductSearchResult[]> {
  const { data } = await apiClient.get<ProductSearchResult[]>(
    endpoints.receive.search,
    { params: { keyword } }
  )
  return Array.isArray(data) ? data : []
}

export async function createReceive(
  payload: CreateReceivePayload
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(
    endpoints.receive.base,
    payload
  )
  return data ?? {}
}

export async function updateReceive(
  id: string,
  payload: UpdateReceivePayload
): Promise<MessageResponse> {
  const { data } = await apiClient.put<MessageResponse>(
    endpoints.receive.byId(id),
    payload
  )
  return data ?? {}
}

export async function deleteReceive(id: string): Promise<MessageResponse> {
  const { data } = await apiClient.delete<MessageResponse>(
    endpoints.receive.byId(id)
  )
  return data ?? {}
}
