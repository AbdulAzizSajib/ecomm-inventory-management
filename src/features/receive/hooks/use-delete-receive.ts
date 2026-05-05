"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteReceive } from "../api"
import { receiveKeys } from "../keys"

export function useDeleteReceive() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string }, unknown, string>({
    mutationFn: deleteReceive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: receiveKeys.all })
    },
  })
}
