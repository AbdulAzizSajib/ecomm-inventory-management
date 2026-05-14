import type { OrderListParams } from "./types"

export const orderKeys = {
  all: ["orders"] as const,
  list: (params: OrderListParams) =>
    [...orderKeys.all, "list", params] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
  tracking: (saleCode: string) =>
    [...orderKeys.all, "tracking", saleCode] as const,
  deliveryMen: () => [...orderKeys.all, "delivery-men"] as const,
}
