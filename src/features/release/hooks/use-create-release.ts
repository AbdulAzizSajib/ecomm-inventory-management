"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createRelease } from "../api"
import { releaseKeys } from "../keys"
import type { CreateReleasePayload } from "../types"

export function useCreateRelease() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string }, unknown, CreateReleasePayload>({
    mutationFn: createRelease,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: releaseKeys.all })
    },
  })
}
