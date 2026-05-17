"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteBanner } from "../api"
import { bannerKeys } from "../keys"

export function useDeleteBanner() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string }, unknown, number | string>({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.list() })
    },
  })
}
