import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"

import type {
  CurrentStockParams,
  CurrentStockResponse,
  CurrentStockRow,
  StockStatementParams,
  StockStatementRow,
} from "./types"

export async function getStockStatement(
  params: StockStatementParams
): Promise<StockStatementRow[]> {
  const { data } = await apiClient.get<StockStatementRow[]>(
    endpoints.stock.statement,
    { params }
  )
  return Array.isArray(data) ? data : []
}

export async function getCurrentStock(
  params: CurrentStockParams
): Promise<CurrentStockRow[]> {
  const { data } = await apiClient.get<CurrentStockResponse>(
    endpoints.stock.current,
    { params }
  )
  return Array.isArray(data?.data) ? data.data : []
}
