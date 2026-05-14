"use client"

import { useState } from "react"
import { Calendar, Loader2, RotateCcw, X } from "lucide-react"

import { PageHeader } from "@/components/dashboard/PageHeader"
import { cn } from "@/lib/utils"
import { getApiErrorMessage } from "@/lib/api/client"
import { useReleases, useRelease } from "@/features/release"

const LIMIT = 10

const todayIso = () => new Date().toISOString().slice(0, 10)
const firstOfMonthIso = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`
}

function formatDate(str: string | null | undefined) {
  if (!str) return "—"
  return str.slice(0, 10)
}

export default function ReleasePage() {
  const [page, setPage] = useState(1)
  const [startDate, setStartDate] = useState(firstOfMonthIso())
  const [endDate, setEndDate] = useState(todayIso())
  const [detailId, setDetailId] = useState<string | null>(null)

  const releasesQuery = useReleases({
    page,
    limit: LIMIT,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  })

  const totalPage = releasesQuery.data?.totalPage ?? 1
  const total = releasesQuery.data?.total ?? 0
  const rows = releasesQuery.data?.data ?? []

  const onResetFilters = () => {
    setStartDate(firstOfMonthIso())
    setEndDate(todayIso())
    setPage(1)
  }

  return (
    <div>
      <PageHeader
        title="Release"
        description="Inventory release records"
      />

      <div className="bg-white rounded-lg border border-gray-200">
        {/* ── Filters ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-end gap-3 px-5 py-3.5 border-b border-gray-100">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">From Date</label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  setPage(1)
                }}
                className="h-9 w-44 pl-9 pr-3 text-sm rounded-md border border-gray-200 bg-white text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">To Date</label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  setPage(1)
                }}
                className="h-9 w-44 pl-9 pr-3 text-sm rounded-md border border-gray-200 bg-white text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={onResetFilters}
            disabled={releasesQuery.isFetching}
            className="h-9 px-3 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 inline-flex items-center gap-1.5"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </button>
          {releasesQuery.isFetching && (
            <span className="ml-auto text-xs text-gray-500 inline-flex items-center gap-1.5">
              <Loader2 className="size-3 animate-spin" />
              Loading...
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Receive No</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Plant</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Receive Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">FGTN No</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">QC Receive No</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Business</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Period</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Stored</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Created By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {releasesQuery.isPending ? (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-gray-500">
                    <Loader2 className="size-4 animate-spin inline mr-2 align-[-2px]" />
                    Loading...
                  </td>
                </tr>
              ) : releasesQuery.isError ? (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-red-600">
                    {getApiErrorMessage(releasesQuery.error, "Failed to load release records")}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-gray-500">
                    No release records.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.ReceiveNo} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setDetailId(row.ReceiveNo)}
                        className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                      >
                        {row.ReceiveNo}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{row.PlantCode}</td>
                    <td className="px-5 py-3.5 text-gray-600 tabular-nums whitespace-nowrap">
                      {formatDate(row.ReceiveDate)}
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 font-mono text-xs">{row.FgtnNo || "—"}</td>
                    <td className="px-5 py-3.5 text-gray-700 font-mono text-xs">{row.QuarantineReceiveNo || "—"}</td>
                    <td className="px-5 py-3.5 text-gray-700">{row.Business || "—"}</td>
                    <td className="px-5 py-3.5 text-gray-600 tabular-nums">{row.Period}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                          row.Stored === "Y"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        )}
                      >
                        {row.Stored === "Y" ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{row.CreateBy || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm text-gray-600">
            <span>
              {total} record{total !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || releasesQuery.isPending}
                className="h-7 px-2.5 rounded border border-gray-200 text-xs font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              <span className="text-xs tabular-nums">
                Page {page} of {totalPage}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                disabled={page >= totalPage || releasesQuery.isPending}
                className="h-7 px-2.5 rounded border border-gray-200 text-xs font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {detailId && (
        <ReleaseDetailDialog id={detailId} onClose={() => setDetailId(null)} />
      )}
    </div>
  )
}

// ─── Release detail dialog ─────────────────────────────────────────────────
function ReleaseDetailDialog({ id, onClose }: { id: string; onClose: () => void }) {
  const detailQuery = useRelease(id)
  const master = detailQuery.data?.master
  const items = detailQuery.data?.items ?? []

  const totalQty = items.reduce((s, i) => s + (i.Quantity ?? 0), 0)
  const totalReturn = items.reduce((s, i) => s + (i.ReturnQuantity ?? 0), 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-4xl rounded-lg bg-white shadow-lg border border-gray-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Release Details</h3>
            <p className="text-xs text-gray-500 mt-0.5 font-mono">{id}</p>
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
          {detailQuery.isPending ? (
            <div className="px-5 py-10 text-center text-gray-500 text-sm">
              <Loader2 className="size-4 animate-spin inline mr-2 align-[-2px]" />
              Loading details...
            </div>
          ) : detailQuery.isError ? (
            <div className="px-5 py-10 text-center text-red-600 text-sm">
              {getApiErrorMessage(detailQuery.error, "Failed to load release details")}
            </div>
          ) : (
            <>
              {/* Master info */}
              {master && (
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/40">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-3 text-sm">
                    {[
                      ["Plant", master.PlantCode],
                      ["Store", master.StoreCode],
                      ["Receive Date", formatDate(master.ReceiveDate)],
                      ["Period", master.Period],
                      ["FGTN No", master.FgtnNo || "—"],
                      ["QC Receive No", master.QuarantineReceiveNo || "—"],
                      ["Business", master.Business || "—"],
                      ["Returned", master.Returned || "—"],
                      ["Mushok", master.Mushok || "—"],
                      ["Stored", master.Stored === "Y" ? "Yes" : "No"],
                      ["Created By", master.CreateBy || "—"],
                      ["Create Date", formatDate(master.CreateDate)],
                      ["Edited By", master.EditBy || "—"],
                      ["Edit Date", formatDate(master.EditDate)],
                      ["Comment", master.Comment || "—"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-[10px] uppercase tracking-wide text-gray-500 font-medium">
                          {label}
                        </p>
                        <p className="text-sm text-gray-900 mt-0.5 wrap-break-word">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Items table */}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-800">
                    Items
                    <span className="ml-1.5 text-xs font-normal text-gray-500">
                      ({items.length})
                    </span>
                  </h4>
                </div>
                <div className="overflow-x-auto rounded-md border border-gray-200">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-3 py-2 font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">Product</th>
                        <th className="text-left px-3 py-2 font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">Variant</th>
                        <th className="text-left px-3 py-2 font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">Batch No</th>
                        <th className="text-right px-3 py-2 font-semibold text-indigo-700 uppercase tracking-wide">Qty</th>
                        <th className="text-right px-3 py-2 font-semibold text-rose-700 uppercase tracking-wide whitespace-nowrap">Returned</th>
                        <th className="text-left px-3 py-2 font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">MFG Date</th>
                        <th className="text-left px-3 py-2 font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">Expire Date</th>
                        <th className="text-left px-3 py-2 font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">New Expire</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-3 py-8 text-center text-gray-500">
                            No items.
                          </td>
                        </tr>
                      ) : (
                        items.map((it, i) => (
                          <tr key={`${it.ProductCode}-${it.VariantId}-${it.BatchNo}-${i}`} className="hover:bg-gray-50/60">
                            <td className="px-3 py-2 font-mono text-gray-800">{it.ProductCode}</td>
                            <td className="px-3 py-2 text-gray-700">{it.VariantId ?? "—"}</td>
                            <td className="px-3 py-2 font-mono text-gray-700">{it.BatchNo || "—"}</td>
                            <td className="px-3 py-2 text-right tabular-nums text-indigo-700 font-medium">{it.Quantity}</td>
                            <td className="px-3 py-2 text-right tabular-nums text-rose-700">{it.ReturnQuantity ?? 0}</td>
                            <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{formatDate(it.MFGDate)}</td>
                            <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{formatDate(it.ExpireDate)}</td>
                            <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{formatDate(it.NewExpireDate)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    {items.length > 0 && (
                      <tfoot>
                        <tr className="bg-gray-50 border-t border-gray-200 font-medium">
                          <td colSpan={3} className="px-3 py-2 text-right text-gray-600 uppercase tracking-wide text-[10px]">Total</td>
                          <td className="px-3 py-2 text-right tabular-nums text-indigo-700">{totalQty}</td>
                          <td className="px-3 py-2 text-right tabular-nums text-rose-700">{totalReturn}</td>
                          <td colSpan={3}></td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            </>
          )}
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
        </div>
      </div>
    </div>
  )
}
