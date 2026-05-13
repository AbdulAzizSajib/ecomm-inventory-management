import type { BadgeStatus } from "@/components/dashboard/StatusBadge"

export interface OrderStatusOption {
  id: number
  label: string
  badge: BadgeStatus
}

export const OUT_FOR_DELIVERY_STATUS_ID = 6

export const ORDER_STATUSES: readonly OrderStatusOption[] = [
  { id: 1,  label: "Pending",          badge: "pending"          },
  { id: 2,  label: "Confirmed",        badge: "confirmed"        },
  { id: 3,  label: "Processing",       badge: "processing"       },
  { id: 4,  label: "Packed",           badge: "packed"           },
  { id: 5,  label: "Shipped",          badge: "shipped"          },
  { id: 6,  label: "Out for Delivery", badge: "out_for_delivery" },
  { id: 7,  label: "Delivered",        badge: "delivered"        },
  { id: 8,  label: "Cancelled",        badge: "cancelled"        },
  { id: 9,  label: "Returned",         badge: "returned"         },
  { id: 10, label: "Refunded",         badge: "refunded"         },
] as const

const badgeById = new Map(ORDER_STATUSES.map((s) => [s.id, s.badge]))

export function badgeForStatusId(id: number): BadgeStatus {
  return badgeById.get(id) ?? "pending"
}

export function badgeForStatusName(name: string): BadgeStatus {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, "_")
  const match = ORDER_STATUSES.find((s) => s.badge === normalized)
  return match?.badge ?? "pending"
}

const STATUS_COLOR: Record<BadgeStatus, string> = {
  pending:          "#f59e0b",
  confirmed:        "#0ea5e9",
  processing:       "#3b82f6",
  packed:           "#06b6d4",
  shipped:          "#6366f1",
  out_for_delivery: "#8b5cf6",
  delivered:        "#10b981",
  cancelled:        "#ef4444",
  returned:         "#f97316",
  refunded:         "#a855f7",
  in_stock:         "#10b981",
  low_stock:        "#f59e0b",
  out_of_stock:     "#ef4444",
  active:           "#10b981",
  inactive:         "#9ca3af",
  expired:          "#ef4444",
  paid:             "#10b981",
  failed:           "#ef4444",
}

export function colorForStatusName(name: string): string {
  return STATUS_COLOR[badgeForStatusName(name)] ?? "#9ca3af"
}
