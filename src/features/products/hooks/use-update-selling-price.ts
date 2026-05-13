"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateSellingPrice } from "../api"
import { productKeys } from "../keys"

interface UpdateSellingPricePayload {
  productCode: string
  variantId: number
  SellingPrice: number
}

export function useUpdateSellingPrice() {
  const queryClient = useQueryClient()

  return useMutation<unknown, unknown, UpdateSellingPricePayload>({
    mutationFn: updateSellingPrice,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.variants(variables.productCode),
      })
    },
  })
}
