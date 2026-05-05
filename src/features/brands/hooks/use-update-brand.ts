"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateBrand } from "../api"
import { brandKeys } from "../keys"
import type { UpdateBrandRequest } from "../types"

interface UpdateBrandArgs {
  id: number | string
  payload: UpdateBrandRequest
}

export function useUpdateBrand() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string }, unknown, UpdateBrandArgs>({
    mutationFn: ({ id, payload }) => updateBrand(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.list() })
    },
  })
}
