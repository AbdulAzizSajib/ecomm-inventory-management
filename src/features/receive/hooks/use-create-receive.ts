"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createReceive } from "../api"
import { receiveKeys } from "../keys"
import type { CreateReceivePayload } from "../types"

export function useCreateReceive() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string }, unknown, CreateReceivePayload>({
    mutationFn: createReceive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: receiveKeys.all })
    },
  })
}
