"use client"

import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

import { useAuthStore } from "../store"

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  return () => {
    clearAuth()
    queryClient.clear()
    router.replace("/login")
  }
}
