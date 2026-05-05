"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createSupplier } from "../api"
import { supplierKeys } from "../keys"
import type { CreateSupplierRequest } from "../types"

export function useCreateSupplier() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string }, unknown, CreateSupplierRequest>({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.list() })
    },
  })
}
