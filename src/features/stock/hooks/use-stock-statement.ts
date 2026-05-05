"use client"

import { useQuery } from "@tanstack/react-query"

import { getStockStatement } from "../api"
import { stockKeys } from "../keys"
import type { StockStatementParams } from "../types"

export function useStockStatement(
  params: StockStatementParams,
  enabled: boolean
) {
  return useQuery({
    queryKey: stockKeys.statement(params),
    queryFn: () => getStockStatement(params),
    enabled,
  })
}
