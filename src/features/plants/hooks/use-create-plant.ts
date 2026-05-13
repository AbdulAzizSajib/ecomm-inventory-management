"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createPlant } from "../api"
import { plantKeys } from "../keys"

export function useCreatePlant() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string }, unknown, FormData>({
    mutationFn: createPlant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantKeys.list() })
    },
  })
}
