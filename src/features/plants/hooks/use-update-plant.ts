"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updatePlant } from "../api"
import { plantKeys } from "../keys"

interface UpdatePlantArgs {
  code: string
  formData: FormData
}

export function useUpdatePlant() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string }, unknown, UpdatePlantArgs>({
    mutationFn: ({ code, formData }) => updatePlant(code, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantKeys.list() })
    },
  })
}
