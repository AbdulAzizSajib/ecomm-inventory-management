"use client"

import { useQuery } from "@tanstack/react-query"

import { getProductVariants } from "../api"
import { productKeys } from "../keys"

export function useProductVariants(code: string | null) {
  return useQuery({
    queryKey: productKeys.variants(code ?? ""),
    queryFn: () => getProductVariants(code!),
    enabled: !!code,
  })
}
