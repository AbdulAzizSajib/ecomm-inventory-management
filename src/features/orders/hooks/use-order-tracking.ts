"use client"

import { useQuery } from "@tanstack/react-query"

import { getOrderTracking } from "../api"
import { orderKeys } from "../keys"

export function useOrderTracking(saleCode: string) {
  return useQuery({
    queryKey: orderKeys.tracking(saleCode),
    queryFn: () => getOrderTracking(saleCode),
    enabled: !!saleCode,
  })
}
