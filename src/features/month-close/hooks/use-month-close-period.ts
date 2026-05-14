"use client"

import { useQuery } from "@tanstack/react-query"

import { getMonthClosePeriod } from "../api"
import { monthCloseKeys } from "../keys"

export function useMonthClosePeriod(plantCode: string) {
  return useQuery({
    queryKey: monthCloseKeys.period(plantCode),
    queryFn: () => getMonthClosePeriod(plantCode),
    enabled: !!plantCode,
  })
}
