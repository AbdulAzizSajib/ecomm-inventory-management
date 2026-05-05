"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateProduct } from "../api"
import { productKeys } from "../keys"

interface UpdateProductArgs {
  code: string
  formData: FormData
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation<unknown, unknown, UpdateProductArgs>({
    mutationFn: ({ code, formData }) => updateProduct(code, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}
