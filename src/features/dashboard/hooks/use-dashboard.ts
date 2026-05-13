"use client"

import { useQuery } from "@tanstack/react-query"

import { getDashboard } from "../api"
import { dashboardKeys } from "../keys"

export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: getDashboard,
    staleTime: 30 * 1000,
  })
}
