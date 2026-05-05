"use client"

import { useQuery } from "@tanstack/react-query"

import { getCategories } from "../api"
import { categoryKeys } from "../keys"

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: getCategories,
  })
}
