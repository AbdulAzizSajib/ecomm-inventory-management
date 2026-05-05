"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateAttribute } from "../api"
import { attributeKeys } from "../keys"
import type { Attribute, UpdateAttributeRequest } from "../types"

interface UpdateAttributeArgs {
  id: number | string
  payload: UpdateAttributeRequest
}

export function useUpdateAttribute() {
  const queryClient = useQueryClient()

  return useMutation<Attribute | null, unknown, UpdateAttributeArgs>({
    mutationFn: ({ id, payload }) => updateAttribute(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.list() })
    },
  })
}
