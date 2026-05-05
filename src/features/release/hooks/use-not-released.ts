"use client"

import { useQuery } from "@tanstack/react-query"

import { getNotReleased } from "../api"
import { releaseKeys } from "../keys"

export function useNotReleased(page = 1, limit = 10, search = "") {
  return useQuery({
    queryKey: releaseKeys.notReleasedList(page, limit, search),
    queryFn: () => getNotReleased(page, limit, search),
  })
}
