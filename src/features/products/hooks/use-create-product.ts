"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createProduct } from "../api"
import { productKeys } from "../keys"

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation<unknown, unknown, FormData>({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}
