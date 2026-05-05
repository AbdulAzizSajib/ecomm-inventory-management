"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuthStore } from "@/features/auth"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const token = useAuthStore((s) => s.token)
  const hydrated = useAuthStore((s) => s.hydrated)

  useEffect(() => {
    if (hydrated && token) {
      router.replace("/")
    }
  }, [hydrated, token, router])

  return <>{children}</>
}
