import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"

import type {
  DeliveryManListResponse,
  OrderListParams,
  OrderListResponse,
  UpdateOrderStatusPayload,
} from "./types"

export async function getOrders(
  params: OrderListParams
): Promise<OrderListResponse> {
  const { data } = await apiClient.get<OrderListResponse>(
    endpoints.order.base,
    { params }
  )
  return data
}

export async function getDeliveryMen(): Promise<DeliveryManListResponse> {
  const { data } = await apiClient.get<DeliveryManListResponse>(
    endpoints.order.deliveryMen
  )
  return data
}

export async function updateOrderStatus(
  payload: UpdateOrderStatusPayload
): Promise<unknown> {
  const { data } = await apiClient.post(endpoints.order.statusUpdate, payload)
  return data
}
