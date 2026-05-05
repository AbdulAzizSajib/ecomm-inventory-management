"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteBrand } from "../api"
import { brandKeys } from "../keys"

export function useDeleteBrand() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string }, unknown, number | string>({
    mutationFn: deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.list() })
    },
  })
}
