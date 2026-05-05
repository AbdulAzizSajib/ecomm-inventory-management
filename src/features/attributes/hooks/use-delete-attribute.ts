"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteAttribute } from "../api"
import { attributeKeys } from "../keys"

export function useDeleteAttribute() {
  const queryClient = useQueryClient()

  return useMutation<void, unknown, number | string>({
    mutationFn: deleteAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.list() })
    },
  })
}
