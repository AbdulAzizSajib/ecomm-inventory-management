"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateSupplier } from "../api"
import { supplierKeys } from "../keys"
import type { UpdateSupplierRequest } from "../types"

interface UpdateSupplierArgs {
  id: string
  payload: UpdateSupplierRequest
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string }, unknown, UpdateSupplierArgs>({
    mutationFn: ({ id, payload }) => updateSupplier(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.list() })
    },
  })
}
