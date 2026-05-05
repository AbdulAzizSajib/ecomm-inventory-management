"use client"

import Cookies from "js-cookie"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import { AUTH_COOKIE_MAX_AGE_DAYS, AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/lib/config"

import type { AuthUser } from "./types"

interface AuthState {
  user: AuthUser | null
  token: string | null
  hydrated: boolean
  setAuth: (params: { user: AuthUser; token: string }) => void
  clearAuth: () => void
  setHydrated: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hydrated: false,
      setAuth: ({ user, token }) => {
        Cookies.set(AUTH_TOKEN_KEY, token, {
          expires: AUTH_COOKIE_MAX_AGE_DAYS,
          sameSite: "lax",
        })
        set({ user, token })
      },
      clearAuth: () => {
        Cookies.remove(AUTH_TOKEN_KEY)
        set({ user: null, token: null })
      },
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: AUTH_USER_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
