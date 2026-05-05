"use client"

import { useQuery } from "@tanstack/react-query"

import { getNotReleasedItems } from "../api"
import { releaseKeys } from "../keys"

export function useNotReleasedItems(quarantineReceiveNo: string | null) {
  return useQuery({
    queryKey: releaseKeys.notReleasedItems(quarantineReceiveNo ?? ""),
    queryFn: () => getNotReleasedItems(quarantineReceiveNo as string),
    enabled: !!quarantineReceiveNo,
  })
}
