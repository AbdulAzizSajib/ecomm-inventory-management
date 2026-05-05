"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createCategory } from "../api"
import { categoryKeys } from "../keys"
import type { Category, CreateCategoryRequest } from "../types"

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation<Category | null, unknown, CreateCategoryRequest>({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() })
    },
  })
}
