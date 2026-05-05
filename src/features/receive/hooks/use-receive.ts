"use client"

import { useQuery } from "@tanstack/react-query"

import { getReceiveById } from "../api"
import { receiveKeys } from "../keys"

export function useReceive(id: string) {
  return useQuery({
    queryKey: receiveKeys.detail(id),
    queryFn: () => getReceiveById(id),
    enabled: !!id,
  })
}
