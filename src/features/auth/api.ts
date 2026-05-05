import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"

import type { LoginRequest, LoginResponse } from "./types"

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(endpoints.auth.login, payload)
  return data
}
