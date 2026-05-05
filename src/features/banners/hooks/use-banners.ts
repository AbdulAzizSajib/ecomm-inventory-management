"use client"

import { useQuery } from "@tanstack/react-query"

import { getBanners } from "../api"
import { bannerKeys } from "../keys"

export function useBanners() {
  return useQuery({
    queryKey: bannerKeys.list(),
    queryFn: getBanners,
  })
}
