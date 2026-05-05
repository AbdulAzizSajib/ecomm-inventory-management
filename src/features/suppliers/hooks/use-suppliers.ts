"use client"

import { useQuery } from "@tanstack/react-query"

import { getSuppliers } from "../api"
import { supplierKeys } from "../keys"

export function useSuppliers() {
  return useQuery({
    queryKey: supplierKeys.list(),
    queryFn: getSuppliers,
  })
}
