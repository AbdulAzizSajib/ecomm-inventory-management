"use client"

import { useMutation } from "@tanstack/react-query"

import { login } from "../api"
import { useAuthStore } from "../store"
import type { LoginRequest, LoginResponse } from "../types"

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth({ user: data.user, token: data.token })
    },
  })
}
