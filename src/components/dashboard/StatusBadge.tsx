import { cn } from "@/lib/utils"

export type BadgeStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "in_stock"
  | "low_stock"
  | "out_of_stock"
  | "active"
  | "inactive"
  | "expired"
  | "paid"
  | "failed"
  | "refunded"

const statusConfig: Record<BadgeStatus, { label: string; className: string }> = {
  pending:      { label: "Pending",      className: "bg-amber-50 text-amber-700 border-amber-200" },
  processing:   { label: "Processing",   className: "bg-blue-50 text-blue-700 border-blue-200" },
  shipped:      { label: "Shipped",      className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  delivered:    { label: "Delivered",    className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled:    { label: "Cancelled",    className: "bg-red-50 text-red-700 border-red-200" },
  in_stock:     { label: "In Stock",     className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  low_stock:    { label: "Low Stock",    className: "bg-amber-50 text-amber-700 border-amber-200" },
  out_of_stock: { label: "Out of Stock", className: "bg-red-50 text-red-700 border-red-200" },
  active:       { label: "Active",       className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  inactive:     { label: "Inactive",     className: "bg-gray-50 text-gray-600 border-gray-200" },
  expired:      { label: "Expired",      className: "bg-red-50 text-red-700 border-red-200" },
  paid:         { label: "Paid",         className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  failed:       { label: "Failed",       className: "bg-red-50 text-red-700 border-red-200" },
  refunded:     { label: "Refunded",     className: "bg-purple-50 text-purple-700 border-purple-200" },
}

export function StatusBadge({ status }: { status: BadgeStatus }) {
  const { label, className } = statusConfig[status]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        className
      )}
    >
      {label}
    </span>
  )
}
