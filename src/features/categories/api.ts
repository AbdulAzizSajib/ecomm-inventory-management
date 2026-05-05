import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"

import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "./types"

export async function getCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>(endpoints.category.all)
  return Array.isArray(data) ? data : []
}

export async function getCategoryById(id: number | string): Promise<Category> {
  const { data } = await apiClient.get<Category>(endpoints.category.byId(id))
  return data
}

export async function createCategory(
  payload: CreateCategoryRequest
): Promise<Category | null> {
  const { data } = await apiClient.post<Category | null>(
    endpoints.category.base,
    payload
  )
  return data ?? null
}

export async function updateCategory(
  id: number | string,
  payload: UpdateCategoryRequest
): Promise<Category | null> {
  const { data } = await apiClient.put<Category | null>(
    endpoints.category.byId(id),
    payload
  )
  return data ?? null
}

export async function deleteCategory(id: number | string): Promise<void> {
  await apiClient.delete(endpoints.category.byId(id))
}
