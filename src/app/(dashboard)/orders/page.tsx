"use client"

import { useState } from "react"
import { Filter, Download, Loader2, Printer, X } from "lucide-react"

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
  useOrderTracking,
  type Order,
  type OrderTrackingData,
} from "@/features/orders"
import { usePlant } from "@/features/plants"
import type { Plant } from "@/features/plants"

const PAGE_LIMIT = 10
const DISABLED_MANAGE_STATUS_IDS = new Set([7, 8])
const IMAGE_BASE_URL = "https://ec.mis.digital"

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
  const [printing, setPrinting] = useState<Order | null>(null)
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
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setPrinting(order)}
                          className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
                          title="Print invoice"
                        >
                          <Printer className="size-3" />
                          Print
                        </button>
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
                      </div>
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

      {printing && (
        <InvoiceDialog
          key={`invoice-${printing.IssueNo}`}
          order={printing}
          onClose={() => setPrinting(null)}
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

// ─── Invoice dialog ─────────────────────────────────────────────────────────
function buildImageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`
}

const formatBdt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function InvoiceDialog({
  order,
  onClose,
}: {
  order: Order
  onClose: () => void
}) {
  const trackingQuery = useOrderTracking(order.IssueNo)
  const plantQuery = usePlant(order.PlantCode)

  const data = trackingQuery.data?.data
  const plant = plantQuery.data

  const isLoading = trackingQuery.isPending || plantQuery.isPending
  const isError = trackingQuery.isError || plantQuery.isError
  const errorMsg = trackingQuery.isError
    ? getApiErrorMessage(trackingQuery.error, "Failed to load order")
    : plantQuery.isError
    ? getApiErrorMessage(plantQuery.error, "Failed to load plant")
    : null

  const handlePrint = () => {
    if (!data || !plant) return
    printInvoice(data, plant)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-3xl rounded-lg bg-white shadow-lg border border-gray-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Invoice Preview</h3>
            <p className="text-xs text-gray-500 mt-0.5 font-mono">{order.IssueNo}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {isLoading ? (
            <div className="px-5 py-10 text-center text-gray-500 text-sm">
              <Loader2 className="size-4 animate-spin inline mr-2 align-[-2px]" />
              Loading invoice...
            </div>
          ) : isError ? (
            <div className="px-5 py-10 text-center text-red-600 text-sm">
              {errorMsg}
            </div>
          ) : data && plant ? (
            <InvoiceBody data={data} plant={plant} />
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-3 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            disabled={isLoading || isError || !data || !plant}
            className="h-8 px-3 rounded-md bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
          >
            <Printer className="size-3.5" />
            Print
          </button>
        </div>
      </div>
    </div>
  )
}

function InvoiceBody({ data, plant }: { data: OrderTrackingData; plant: Plant }) {
  const subtotal = data.Items.reduce((s, i) => s + (i.Net ?? 0) * (i.Quantity ?? 1), 0)
  const shipping = data.ShippingCost ?? 0
  const total = subtotal + shipping
  const logoUrl = buildImageUrl(plant.ImagePath)

  return (
    <div className="px-6 py-2 text-sm text-gray-800">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-2 border-b border-gray-200">
        <div className="flex items-start gap-3">
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={plant.PlantName} className="size-14 rounded object-contain" />
          )}
          <div>
            <p className="text-lg font-bold text-gray-900">{plant.PlantName}</p>
            <p className="text-xs text-gray-600 mt-0.5 whitespace-pre-line">{plant.PlantAddress}</p>
            <p className="text-xs text-gray-600 mt-0.5">{plant.PlantPhone} · {plant.PlantEmail}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-base font-semibold text-gray-900">INVOICE</p>
          <p className="text-xs text-gray-500 font-mono mt-1">{data.IssueNo}</p>
          <p className="text-xs text-gray-500 mt-0.5">{formatDate(data.IssueDate)}</p>
        </div>
      </div>

      {/* Billing */}
      <div className="grid grid-cols-2 gap-6 py-2 border-b border-gray-200">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">Bill To</p>
          <p className="text-sm font-medium text-gray-900">{data.BillingAddress.full_name}</p>
          <p className="text-xs text-gray-600 mt-0.5">{data.BillingAddress.mobile}</p>
          <p className="text-xs text-gray-600 mt-0.5 whitespace-pre-line">{data.BillingAddress.address}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">Order Info</p>
          <p className="text-xs text-gray-600">
            <span className="text-gray-500">Customer:</span>{" "}
            <span className="font-mono">{data.CustomerCode}</span>
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            <span className="text-gray-500">Status:</span> {data.OrderStatus}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            <span className="text-gray-500">Payment Method ID:</span> {data.PaymentMethodId}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="py-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 font-semibold text-gray-600 uppercase tracking-wide">#</th>
              <th className="text-left py-2 font-semibold text-gray-600 uppercase tracking-wide">Product</th>
              <th className="text-left py-2 font-semibold text-gray-600 uppercase tracking-wide">SKU</th>
              <th className="text-right py-2 font-semibold text-gray-600 uppercase tracking-wide">Qty</th>
              <th className="text-right py-2 font-semibold text-gray-600 uppercase tracking-wide">Unit Price</th>
              <th className="text-right py-2 font-semibold text-gray-600 uppercase tracking-wide">Net</th>
            </tr>
          </thead>
          <tbody>
            {data.Items.map((it, i) => {
              const qty = it.Quantity ?? 1
              const lineTotal = (it.Net ?? 0) * qty
              return (
                <tr key={`${it.ProductCode}-${it.VariantId}-${i}`}>
                  <td className="py-2 text-gray-500 tabular-nums">{i + 1}</td>
                  <td className="py-2">
                    <p className="font-medium text-gray-900">{it.ProductName}</p>
                  </td>
                  <td className="py-2 font-mono text-gray-700">{it.SKU}</td>
                  <td className="py-2 text-right tabular-nums">{qty}</td>
                  <td className="py-2 text-right tabular-nums">৳{formatBdt(it.UnitPrice)}</td>
                  <td className="py-2 text-right tabular-nums font-medium">৳{formatBdt(lineTotal)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end pt-2">
        <div className="w-64 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="tabular-nums">৳{formatBdt(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className="tabular-nums">৳{formatBdt(shipping)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold text-gray-900">
            <span>Total</span>
            <span className="tabular-nums">৳{formatBdt(total)}</span>
          </div>
        </div>
      </div>

      {plant.Remarks && (
        <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500 whitespace-pre-line">
          {plant.Remarks}
        </div>
      )}
    </div>
  )
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function printInvoice(data: OrderTrackingData, plant: Plant) {
  const logoUrl = buildImageUrl(plant.ImagePath)
  const subtotal = data.Items.reduce((s, i) => s + (i.Net ?? 0) * (i.Quantity ?? 1), 0)
  const shipping = data.ShippingCost ?? 0
  const total = subtotal + shipping

  const itemsHtml = data.Items.map((it, i) => {
    const qty = it.Quantity ?? 1
    const lineTotal = (it.Net ?? 0) * qty
    return `
      <tr>
        <td class="num">${i + 1}</td>
        <td>
          <div class="pname">${escapeHtml(it.ProductName)}</div>
        </td>
        <td class="mono">${escapeHtml(it.SKU)}</td>
        <td class="num">${qty}</td>
        <td class="num">৳${formatBdt(it.UnitPrice)}</td>
        <td class="num">৳${formatBdt(lineTotal)}</td>
      </tr>`
  }).join("")

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Invoice ${escapeHtml(data.IssueNo)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1f2937; margin: 0; padding: 20px; font-size: 13px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding-bottom: 10px; border-bottom: 1.5px solid #1f2937; }
  .brand { display: flex; gap: 10px; align-items: flex-start; }
  .brand img { width: 48px; height: 48px; object-fit: contain; }
  .brand h1 { font-size: 16px; margin: 0 0 2px 0; }
  .brand p { font-size: 10px; color: #4b5563; margin: 0 0 1px 0; white-space: pre-line; line-height: 1.3; }
  .meta { text-align: right; }
  .meta .title { font-size: 16px; font-weight: 700; letter-spacing: 0.05em; }
  .meta .no { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; color: #6b7280; margin-top: 2px; }
  .meta .date { font-size: 11px; color: #6b7280; margin-top: 1px; }
  .section { padding: 10px 0; border-bottom: none; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 2px; }
  .name { font-weight: 600; font-size: 12px; }
  .meta-line { font-size: 10px; color: #4b5563; margin-top: 1px; line-height: 1.3; }
  table { width: 100%; border-collapse: collapse; border: none; margin-top: 4px; }
  th, td { padding: 5px 4px; text-align: left; font-size: 11px; }
  td { border: none; }
  th { font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #d1d5db; }
  tbody tr { border-bottom: none; }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; }
  .pname { font-weight: 500; font-size: 11px; }
  .pcode { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 9px; color: #6b7280; margin-top: 1px; }
  .totals { display: flex; justify-content: flex-end; padding-top: 10px; }
  .totals-inner { width: 220px; }
  .totals .row { display: flex; justify-content: space-between; font-size: 11px; color: #4b5563; padding: 2px 0; }
  .totals .grand { border-top: 1px solid #d1d5db; padding-top: 4px; margin-top: 2px; font-weight: 700; color: #111827; font-size: 13px; }
  .footer { margin-top: 12px; padding-top: 10px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #6b7280; white-space: pre-line; line-height: 1.3; }
  @media print {
    body { padding: 12px; }
  }
</style>
</head>
<body>
  <div class="header">
    <div class="brand">
      ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="" />` : ""}
      <div>
        <h1>${escapeHtml(plant.PlantName)}</h1>
        <p>${escapeHtml(plant.PlantAddress || "")}</p>
        <p>${escapeHtml(plant.PlantPhone || "")} · ${escapeHtml(plant.PlantEmail || "")}</p>
      </div>
    </div>
    <div class="meta">
      <div class="title">INVOICE</div>
      <div class="no">${escapeHtml(data.IssueNo)}</div>
      <div class="date">${escapeHtml(formatDate(data.IssueDate))}</div>
    </div>
  </div>

  <div class="section grid2">
    <div>
      <div class="label">Bill To</div>
      <div class="name">${escapeHtml(data.BillingAddress.full_name)}</div>
      <div class="meta-line">${escapeHtml(data.BillingAddress.mobile)}</div>
      <div class="meta-line">${escapeHtml(data.BillingAddress.address)}</div>
    </div>
    <div>
      <div class="label">Order Info</div>
      <div class="meta-line"><span style="color:#6b7280">Customer:</span> <span class="mono">${escapeHtml(data.CustomerCode)}</span></div>
      <div class="meta-line"><span style="color:#6b7280">Status:</span> ${escapeHtml(data.OrderStatus)}</div>
      <div class="meta-line"><span style="color:#6b7280">Payment Method ID:</span> ${data.PaymentMethodId}</div>
    </div>
  </div>

  <div class="section">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Product</th>
          <th>SKU</th>
          <th class="num">Qty</th>
          <th class="num">Unit Price</th>
          <th class="num">Net</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>
  </div>

  <div class="totals">
    <div class="totals-inner">
      <div class="row"><span>Subtotal</span><span class="num">৳${formatBdt(subtotal)}</span></div>
      <div class="row"><span>Shipping</span><span class="num">৳${formatBdt(shipping)}</span></div>
      <div class="row grand"><span>Total</span><span class="num">৳${formatBdt(total)}</span></div>
    </div>
  </div>

  ${plant.Remarks ? `<div class="footer">${escapeHtml(plant.Remarks)}</div>` : ""}

  <script>
    window.addEventListener("load", function() {
      setTimeout(function() { window.print(); }, 200);
    });
  </script>
</body>
</html>`

  const w = window.open("", "_blank", "width=900,height=700")
  if (!w) return
  w.document.open()
  w.document.write(html)
  w.document.close()
}
