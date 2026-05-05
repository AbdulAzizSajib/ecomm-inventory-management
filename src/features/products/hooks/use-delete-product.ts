"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteProduct } from "../api"
import { productKeys } from "../keys"

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation<unknown, unknown, string>({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}
