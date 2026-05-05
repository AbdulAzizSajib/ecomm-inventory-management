"use client"

import { useQuery } from "@tanstack/react-query"

import { getProducts } from "../api"
import { productKeys } from "../keys"
import type { ProductListParams } from "../types"

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getProducts(params),
    placeholderData: (prev) => prev,
  })
}
