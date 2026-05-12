"use client"

import { useQuery } from "@tanstack/react-query"

import { getOrders } from "../api"
import { orderKeys } from "../keys"
import type { OrderListParams } from "../types"

export function useOrders(params: OrderListParams) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => getOrders(params),
    placeholderData: (prev) => prev,
  })
}
