"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuthStore } from "@/features/auth"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const token = useAuthStore((s) => s.token)
  const hydrated = useAuthStore((s) => s.hydrated)

  useEffect(() => {
    if (hydrated && !token) {
      router.replace("/login")
    }
  }, [hydrated, token, router])

  if (!hydrated || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="size-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
