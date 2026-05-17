"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateBanner } from "../api"
import { bannerKeys } from "../keys"
import type { UpdateBannerRequest } from "../types"

export function useUpdateBanner() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string }, unknown, UpdateBannerRequest>({
    mutationFn: updateBanner,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.list() })
      queryClient.invalidateQueries({
        queryKey: bannerKeys.detail(variables.id),
      })
    },
  })
}
