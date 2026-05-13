"use client"

import { useState } from "react"
import { Filter, Download, Loader2, X } from "lucide-react"

import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { cn } from "@/lib/utils"
import { getApiErrorMessage } from "@/lib/api/client"
import {
  ORDER_STATUSES,
  OUT_FOR_DELIVERY_STATUS_ID,
  badgeForStatusId,
  useOrders,
  useDeliveryMen,
  useUpdateOrderStatus,
  type Order,
} from "@/features/orders"

const PAGE_LIMIT = 10
const DISABLED_MANAGE_STATUS_IDS = new Set([7, 8])

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function OrdersPage() {
  const [page, setPage] = useState(1)
  const [managing, setManaging] = useState<Order | null>(null)
  const ordersQuery = useOrders({ page, limit: PAGE_LIMIT })

  const orders = ordersQuery.data?.data ?? []
  const total = ordersQuery.data?.total ?? 0
  const totalPage = ordersQuery.data?.totalPage ?? 1

  const showingFrom = total === 0 ? 0 : (page - 1) * PAGE_LIMIT + 1
  const showingTo = Math.min(page * PAGE_LIMIT, total)

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Manage and track all customer orders"
        action={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="size-3.5" />
              Export
            </button>
            <button className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="size-3.5" />
              Filter
            </button>
          </div>
        }
      />

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Order No</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Plant / Store</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Period</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ordersQuery.isPending ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    <Loader2 className="size-4 animate-spin inline mr-2 align-[-2px]" />
                    Loading orders...
                  </td>
                </tr>
              ) : ordersQuery.isError ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-red-600">
                    {getApiErrorMessage(ordersQuery.error, "Failed to load orders")}
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.IssueNo}
                    className={cn(
                      "hover:bg-gray-50/50 transition-colors",
                      ordersQuery.isFetching && "opacity-60"
                    )}
                  >
                    <td className="px-5 py-3.5 font-medium text-gray-900 font-mono">
                      {order.IssueNo}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{order.CustomerCode}</p>
                      {order.OrderNo && (
                        <p className="text-xs text-gray-500 mt-0.5">Ref: {order.OrderNo}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 hidden md:table-cell font-mono text-xs">
                      {order.PlantCode} / {order.StoreCode}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 hidden lg:table-cell font-mono text-xs">
                      {order.Period}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">
                      {formatDate(order.IssueDate)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={badgeForStatusId(order.OrderStatusId)} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        disabled={DISABLED_MANAGE_STATUS_IDS.has(order.OrderStatusId)}
                        onClick={() => setManaging(order)}
                        className="text-xs font-medium transition-colors text-indigo-600 hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-gray-300"
                        title={
                          DISABLED_MANAGE_STATUS_IDS.has(order.OrderStatusId)
                            ? "This order cannot be managed after it is delivered or cancelled."
                            : "Manage order"
                        }
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {ordersQuery.data
              ? total === 0
                ? "No orders"
                : `Showing ${showingFrom}–${showingTo} of ${total} orders`
              : "—"}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-7 px-3 rounded-md border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={!ordersQuery.data || page >= totalPage}
              onClick={() => setPage((p) => p + 1)}
              className="h-7 px-3 rounded-md border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {managing && (
        <ManageOrderDialog
          key={managing.IssueNo}
          order={managing}
          onClose={() => setManaging(null)}
        />
      )}
    </div>
  )
}

// ─── Manage dialog ───────────────────────────────────────────────────────────
function ManageOrderDialog({
  order,
  onClose,
}: {
  order: Order
  onClose: () => void
}) {
  const [statusId, setStatusId] = useState<number>(order.OrderStatusId)
  const [deliveryManId, setDeliveryManId] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const deliveryMenQuery = useDeliveryMen()
  const updateMutation = useUpdateOrderStatus()
  const isPending = updateMutation.isPending

  const requiresDeliveryMan = statusId === OUT_FOR_DELIVERY_STATUS_ID

  const handleSubmit = () => {
    if (requiresDeliveryMan && deliveryManId === "") {
      setError('Please assign a delivery man before setting status to "Out for Delivery".')
      return
    }
    setError(null)
    updateMutation.mutate(
      {
        issue_no: order.IssueNo,
        status_id: statusId,
        delivery_man_id: requiresDeliveryMan ? deliveryManId : null,
      },
      {
        onSuccess: () => onClose(),
        onError: (err) =>
          setError(getApiErrorMessage(err, "Failed to update order")),
      }
    )
  }

  const dirty =
    statusId !== order.OrderStatusId ||
    (requiresDeliveryMan && deliveryManId !== "")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={isPending ? undefined : onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-lg border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Manage Order</h3>
            <p className="text-xs text-gray-500 mt-0.5 font-mono">{order.IssueNo}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-60"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-500 mb-0.5">Customer</p>
              <p className="font-medium text-gray-900">{order.CustomerCode}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-0.5">Plant / Store</p>
              <p className="font-mono text-gray-700">
                {order.PlantCode} / {order.StoreCode}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-0.5">Issue Date</p>
              <p className="text-gray-700">{formatDate(order.IssueDate)}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-0.5">Current Status</p>
              <StatusBadge status={badgeForStatusId(order.OrderStatusId)} />
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Update Status
            </label>
            <select
              value={statusId}
              onChange={(e) => setStatusId(Number(e.target.value))}
              disabled={isPending}
              className="w-full h-9 px-3 text-sm rounded-md border border-gray-200 bg-white text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors disabled:opacity-60"
            >
              {ORDER_STATUSES.map((s) => (
                <option
                  key={s.id}
                  value={s.id}
                  disabled={s.id < order.OrderStatusId}
                >
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Assign Delivery Man
              {requiresDeliveryMan ? (
                <span className="text-red-500 ml-1">*</span>
              ) : (
                <span className="font-normal text-gray-400 ml-1">
                  (only required for &ldquo;Out for Delivery&rdquo;)
                </span>
              )}
            </label>
            {deliveryMenQuery.isPending ? (
              <div className="h-9 rounded-md border border-gray-200 bg-gray-50 px-3 flex items-center text-xs text-gray-500">
                <Loader2 className="size-3 animate-spin mr-1.5" />
                Loading delivery men...
              </div>
            ) : deliveryMenQuery.isError ? (
              <div className="h-9 rounded-md border border-red-100 bg-red-50 px-3 flex items-center text-xs text-red-700">
                {getApiErrorMessage(deliveryMenQuery.error, "Failed to load")}
              </div>
            ) : (
              <select
                value={deliveryManId}
                onChange={(e) => setDeliveryManId(e.target.value)}
                disabled={isPending || !requiresDeliveryMan}
                aria-required={requiresDeliveryMan}
                className="w-full h-9 px-3 text-sm rounded-md border border-gray-200 bg-white text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors disabled:opacity-60 disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="">— Select delivery man —</option>
                {(deliveryMenQuery.data?.data ?? [])
                  .filter((dm) => dm.Active === "Y")
                  .map((dm) => (
                    <option key={dm.UserId} value={dm.UserId}>
                      {dm.UserName} ({dm.UserId})
                    </option>
                  ))}
              </select>
            )}
            {!requiresDeliveryMan && (
              <p className="mt-1 text-xs text-gray-400">
                Set status to &ldquo;Out for Delivery&rdquo; to assign a delivery man.
              </p>
            )}
            {requiresDeliveryMan &&
              deliveryMenQuery.data &&
              deliveryMenQuery.data.data.filter((dm) => dm.Active === "Y").length === 0 && (
                <p className="mt-1 text-xs text-red-600">
                  No active delivery men available.
                </p>
              )}
          </div>

          {error && (
            <div className="rounded-md bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="h-8 px-3 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || !dirty}
              className="h-8 px-3 rounded-md bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              {isPending && <Loader2 className="size-3.5 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
