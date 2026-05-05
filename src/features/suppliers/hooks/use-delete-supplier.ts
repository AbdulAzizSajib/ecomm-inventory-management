"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteSupplier } from "../api"
import { supplierKeys } from "../keys"

export function useDeleteSupplier() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string }, unknown, string>({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.list() })
    },
  })
}
