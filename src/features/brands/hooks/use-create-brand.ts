"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createBrand } from "../api"
import { brandKeys } from "../keys"
import type { CreateBrandRequest } from "../types"

export function useCreateBrand() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string }, unknown, CreateBrandRequest>({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.list() })
    },
  })
}
