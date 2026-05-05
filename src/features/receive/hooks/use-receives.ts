"use client"

import { useQuery } from "@tanstack/react-query"

import { getReceives } from "../api"
import { receiveKeys } from "../keys"

export function useReceives(page = 1, limit = 10) {
  return useQuery({
    queryKey: receiveKeys.list(page, limit),
    queryFn: () => getReceives(page, limit),
  })
}
