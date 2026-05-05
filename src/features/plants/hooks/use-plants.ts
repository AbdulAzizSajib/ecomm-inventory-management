"use client"

import { useQuery } from "@tanstack/react-query"

import { getPlants } from "../api"
import { plantKeys } from "../keys"

export function usePlants() {
  return useQuery({
    queryKey: plantKeys.list(),
    queryFn: getPlants,
  })
}
