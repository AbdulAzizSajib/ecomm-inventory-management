"use client"

import { useQuery } from "@tanstack/react-query"

import { getAttributes } from "../api"
import { attributeKeys } from "../keys"

export function useAttributes() {
  return useQuery({
    queryKey: attributeKeys.list(),
    queryFn: getAttributes,
  })
}
