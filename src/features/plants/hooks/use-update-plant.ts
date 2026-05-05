"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updatePlant } from "../api"
import { plantKeys } from "../keys"
import type { UpdatePlantRequest } from "../types"

interface UpdatePlantArgs {
  code: string
  payload: UpdatePlantRequest
}

export function useUpdatePlant() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string }, unknown, UpdatePlantArgs>({
    mutationFn: ({ code, payload }) => updatePlant(code, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantKeys.list() })
    },
  })
}
