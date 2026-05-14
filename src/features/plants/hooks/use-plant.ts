"use client"

import { useQuery } from "@tanstack/react-query"

import { getPlantByCode } from "../api"
import { plantKeys } from "../keys"

export function usePlant(code: string) {
  return useQuery({
    queryKey: plantKeys.detail(code),
    queryFn: () => getPlantByCode(code),
    enabled: !!code,
  })
}
