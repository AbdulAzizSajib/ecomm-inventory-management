"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { closeMonth } from "../api"
import { monthCloseKeys } from "../keys"
import type { CloseMonthPayload, CloseMonthResponse } from "../types"

export function useCloseMonth() {
  const queryClient = useQueryClient()

  return useMutation<CloseMonthResponse, unknown, CloseMonthPayload>({
    mutationFn: closeMonth,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: monthCloseKeys.period(variables.plantCode),
      })
    },
  })
}
