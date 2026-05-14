"use client"

import { useQuery } from "@tanstack/react-query"

import { getReleaseById } from "../api"
import { releaseKeys } from "../keys"

export function useRelease(id: string) {
  return useQuery({
    queryKey: releaseKeys.detail(id),
    queryFn: () => getReleaseById(id),
    enabled: !!id,
  })
}
