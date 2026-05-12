"use client"

import { useQuery } from "@tanstack/react-query"

import { getDeliveryMen } from "../api"
import { orderKeys } from "../keys"

export function useDeliveryMen(enabled = true) {
  return useQuery({
    queryKey: orderKeys.deliveryMen(),
    queryFn: getDeliveryMen,
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}
