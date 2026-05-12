"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateOrderStatus } from "../api"
import { orderKeys } from "../keys"

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all })
    },
  })
}
