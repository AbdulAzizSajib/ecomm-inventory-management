import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"

import type {
  Product,
  ProductListParams,
  ProductListResponse,
  ProductVariant,
} from "./types"

export async function getProducts(
  params: ProductListParams
): Promise<ProductListResponse> {
  const { data } = await apiClient.get<ProductListResponse>(
    endpoints.product.base,
    { params }
  )
  return data
}

export async function getProductByCode(code: string): Promise<Product> {
  const { data } = await apiClient.get<Product>(endpoints.product.byId(code))
  return data
}

export async function getProductVariants(code: string): Promise<ProductVariant[]> {
  const { data } = await apiClient.get<ProductVariant[]>(
    endpoints.product.variants(code)
  )
  return data
}

export async function createProduct(formData: FormData): Promise<unknown> {
  const { data } = await apiClient.post(endpoints.product.base, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return data
}

export async function updateProduct(
  code: string,
  formData: FormData
): Promise<unknown> {
  const { data } = await apiClient.put(endpoints.product.byId(code), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return data
}

export async function deleteProduct(code: string): Promise<unknown> {
  const { data } = await apiClient.delete(endpoints.product.byId(code))
  return data
}

export async function updateSellingPrice(payload: {
  productCode: string
  variantId: number
  SellingPrice: number
}): Promise<unknown> {
  const { data } = await apiClient.put(endpoints.product.updateSellingPrice, payload)
  return data
}
