"use client"

import { useQuery } from "@tanstack/react-query"

import { getProductByCode } from "../api"
import { productKeys } from "../keys"

export function useProductDetail(code: string | null) {
  return useQuery({
    queryKey: productKeys.detail(code ?? ""),
    queryFn: () => getProductByCode(code!),
    enabled: !!code,
  })
}
