"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateReceive } from "../api"
import { receiveKeys } from "../keys"
import type { UpdateReceivePayload } from "../types"

interface UpdateReceiveArgs {
  id: string
  payload: UpdateReceivePayload
}

export function useUpdateReceive() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string }, unknown, UpdateReceiveArgs>({
    mutationFn: ({ id, payload }) => updateReceive(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: receiveKeys.all })
      queryClient.invalidateQueries({ queryKey: receiveKeys.detail(id) })
    },
  })
}
