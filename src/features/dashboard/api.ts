import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"

import type { DashboardData, DashboardEnvelope } from "./types"

export async function getDashboard(): Promise<DashboardData> {
  const { data } = await apiClient.get<DashboardEnvelope>(
    endpoints.dashboard.base
  )
  return data.data
}
