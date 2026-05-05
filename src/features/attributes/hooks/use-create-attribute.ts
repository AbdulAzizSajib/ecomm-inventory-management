"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createAttribute } from "../api"
import { attributeKeys } from "../keys"
import type { Attribute, CreateAttributeRequest } from "../types"

export function useCreateAttribute() {
  const queryClient = useQueryClient()

  return useMutation<Attribute | null, unknown, CreateAttributeRequest>({
    mutationFn: createAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.list() })
    },
  })
}
