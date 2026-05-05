"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateCategory } from "../api"
import { categoryKeys } from "../keys"
import type { Category, UpdateCategoryRequest } from "../types"

interface UpdateCategoryArgs {
  id: number | string
  payload: UpdateCategoryRequest
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation<Category | null, unknown, UpdateCategoryArgs>({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() })
    },
  })
}
