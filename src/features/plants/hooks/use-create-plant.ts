"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createPlant } from "../api"
import { plantKeys } from "../keys"
import type { CreatePlantRequest } from "../types"

export function useCreatePlant() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string }, unknown, CreatePlantRequest>({
    mutationFn: createPlant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantKeys.list() })
    },
  })
}
