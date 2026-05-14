"use client"

import { useQuery } from "@tanstack/react-query"

import { getReceives } from "../api"
import { receiveKeys } from "../keys"

interface UseReceivesParams {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
}

export function useReceives({
  page = 1,
  limit = 10,
  startDate,
  endDate,
}: UseReceivesParams = {}) {
  return useQuery({
    queryKey: receiveKeys.list({ page, limit, startDate, endDate }),
    queryFn: () => getReceives({ page, limit, startDate, endDate }),
  })
}
