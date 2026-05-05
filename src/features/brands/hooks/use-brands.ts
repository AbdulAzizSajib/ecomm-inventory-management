"use client"

import { useQuery } from "@tanstack/react-query"

import { getBrands } from "../api"
import { brandKeys } from "../keys"

export function useBrands() {
  return useQuery({
    queryKey: brandKeys.list(),
    queryFn: getBrands,
  })
}
