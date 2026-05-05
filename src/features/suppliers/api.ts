import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"

import type {
  CreateSupplierRequest,
  Supplier,
  UpdateSupplierRequest,
} from "./types"

interface MessageResponse {
  message?: string
}

export async function getSuppliers(): Promise<Supplier[]> {
  const { data } = await apiClient.get<Supplier[]>(endpoints.supplier.base)
  return Array.isArray(data) ? data : []
}

export async function getSupplierById(id: string): Promise<Supplier> {
  const { data } = await apiClient.get<Supplier>(endpoints.supplier.byId(id))
  return data
}

export async function createSupplier(
  payload: CreateSupplierRequest
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(
    endpoints.supplier.base,
    payload
  )
  return data ?? {}
}

export async function updateSupplier(
  id: string,
  payload: UpdateSupplierRequest
): Promise<MessageResponse> {
  const { data } = await apiClient.put<MessageResponse>(
    endpoints.supplier.byId(id),
    payload
  )
  return data ?? {}
}

export async function deleteSupplier(id: string): Promise<MessageResponse> {
  const { data } = await apiClient.delete<MessageResponse>(
    endpoints.supplier.byId(id)
  )
  return data ?? {}
}
