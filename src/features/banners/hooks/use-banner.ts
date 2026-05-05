"use client"

import { useQuery } from "@tanstack/react-query"

import { getBannerById } from "../api"
import { bannerKeys } from "../keys"

export function useBanner(id: number | string | null | undefined) {
  return useQuery({
    queryKey: bannerKeys.detail(id ?? ""),
    queryFn: () => getBannerById(id as number | string),
    enabled: id !== null && id !== undefined && id !== "",
  })
}
