"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createBanner } from "../api"
import { bannerKeys } from "../keys"
import type { CreateBannerRequest } from "../types"

export function useCreateBanner() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string }, unknown, CreateBannerRequest>({
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.list() })
    },
  })
}
