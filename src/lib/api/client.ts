import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"
import Cookies from "js-cookie"

import { AUTH_TOKEN_KEY, env } from "@/lib/config"

export const apiClient = axios.create({
  baseURL: `${env.apiBaseUrl}/api`,
  timeout: 20_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get(AUTH_TOKEN_KEY)
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      Cookies.remove(AUTH_TOKEN_KEY)
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export type ApiError = AxiosError<{ message?: string; status?: string }>

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    return data?.message ?? error.message ?? fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}
