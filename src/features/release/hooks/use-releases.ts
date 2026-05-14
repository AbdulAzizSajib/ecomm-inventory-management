"use client"

import { useQuery } from "@tanstack/react-query"

import { getReleases } from "../api"
import { releaseKeys } from "../keys"

interface UseReleasesParams {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
}

export function useReleases({
  page = 1,
  limit = 10,
  startDate,
  endDate,
}: UseReleasesParams = {}) {
  return useQuery({
    queryKey: releaseKeys.list({ page, limit, startDate, endDate }),
    queryFn: () => getReleases({ page, limit, startDate, endDate }),
  })
}
