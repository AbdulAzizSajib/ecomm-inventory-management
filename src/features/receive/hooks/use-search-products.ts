"use client"

import { useQuery } from "@tanstack/react-query"

import { searchProducts } from "../api"
import { receiveKeys } from "../keys"

export function useSearchProducts(keyword: string) {
  return useQuery({
    queryKey: receiveKeys.search(keyword),
    queryFn: () => searchProducts(keyword),
    enabled: keyword.trim().length >= 2,
  })
}
