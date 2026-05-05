"use client"

import { useQuery } from "@tanstack/react-query"

import { getCurrentStock } from "../api"
import { stockKeys } from "../keys"
import type { CurrentStockParams } from "../types"

export function useCurrentStock(
  params: CurrentStockParams,
  enabled: boolean
) {
  return useQuery({
    queryKey: stockKeys.current(params),
    queryFn: () => getCurrentStock(params),
    enabled,
  })
}
