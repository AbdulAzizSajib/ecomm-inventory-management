"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deletePlant } from "../api"
import { plantKeys } from "../keys"

export function useDeletePlant() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string }, unknown, string>({
    mutationFn: deletePlant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantKeys.list() })
    },
  })
}
