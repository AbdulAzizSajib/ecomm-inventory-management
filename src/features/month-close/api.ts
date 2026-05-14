import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"

import type {
  CloseMonthPayload,
  CloseMonthResponse,
  MonthClosePeriodResponse,
} from "./types"

export async function getMonthClosePeriod(
  plantCode: string
): Promise<MonthClosePeriodResponse> {
  const { data } = await apiClient.get<MonthClosePeriodResponse>(
    endpoints.monthClose.period,
    { params: { plantCode } }
  )
  return data
}

export async function closeMonth(
  payload: CloseMonthPayload
): Promise<CloseMonthResponse> {
  const { data } = await apiClient.post<CloseMonthResponse>(
    endpoints.monthClose.base,
    payload
  )
  return data ?? {}
}
