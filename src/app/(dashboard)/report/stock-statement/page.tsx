"use client"

import { useMemo, useState } from "react"
import { Loader2 } from "lucide-react"

import { PageHeader } from "@/components/dashboard/PageHeader"
import { cn } from "@/lib/utils"
import { getApiErrorMessage } from "@/lib/api/client"
import { usePlants } from "@/features/plants"
import { useStockStatement, type StockStatementParams } from "@/features/stock"

interface FilterState {
  plant: string
  business: string
  fromDate: string
  toDate: string
}

const todayIso = () => new Date().toISOString().slice(0, 10)
const firstOfMonthIso = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`
}

const inputCls = (hasError?: boolean) =>
  cn(
    "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors",
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
      : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
  )

export default function StockStatementPage() {
  const plantsQuery = usePlants()

  const [filters, setFilters] = useState<FilterState>({
    plant: "",
    business: "F",
    fromDate: firstOfMonthIso(),
    toDate: todayIso(),
  })
  const [applied, setApplied] = useState<StockStatementParams | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reportQuery = useStockStatement(
    applied ?? { plant: "", business: "", fromDate: "", toDate: "" },
    !!applied
  )

  const rows = useMemo(() => reportQuery.data ?? [], [reportQuery.data])
  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, r) => ({
          opening: acc.opening + r.Opening,
          receive: acc.receive + r.Receive,
          issue: acc.issue + r.Issue,
          adjustment: acc.adjustment + r.Adjustment,
          closing: acc.closing + r.Closing,
        }),
        { opening: 0, receive: 0, issue: 0, adjustment: 0, closing: 0 }
      ),
    [rows]
  )

  const onRun = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!filters.plant) return setError("Plant is required.")
    if (!filters.business.trim()) return setError("Business is required.")
    if (!filters.fromDate) return setError("From date is required.")
    if (!filters.toDate) return setError("To date is required.")
    if (filters.fromDate > filters.toDate)
      return setError("From date must be before or equal to To date.")
    setApplied({
      plant: filters.plant,
      business: filters.business.trim(),
      fromDate: filters.fromDate,
      toDate: filters.toDate,
    })
  }

  return (
    <div>
      <PageHeader
        title="Stock Statement"
        description="Period-based opening, receive, issue, adjustment, and closing"
      />

      <form
        onSubmit={onRun}
        className="bg-white rounded-lg border border-gray-200 p-5 mb-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Plant</label>
            <select
              value={filters.plant}
              onChange={(e) => setFilters((f) => ({ ...f, plant: e.target.value }))}
              disabled={plantsQuery.isPending}
              className={cn(inputCls(false), "cursor-pointer")}
            >
              <option value="">
                {plantsQuery.isPending ? "Loading…" : "Select plant"}
              </option>
              {(plantsQuery.data ?? [])
                .filter((p) => String(p.Active) === "1")
                .map((p) => (
                  <option key={p.PlantCode} value={p.PlantCode}>
                    {p.PlantName} ({p.PlantCode})
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Business</label>
            <input
              type="text"
              value={filters.business}
              onChange={(e) => setFilters((f) => ({ ...f, business: e.target.value }))}
              placeholder="e.g. F"
              className={inputCls(false)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">From Date</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))}
              className={inputCls(false)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">To Date</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))}
              className={inputCls(false)}
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={reportQuery.isFetching}
              className="h-9 w-full lg:w-auto px-4 rounded-md bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5"
            >
              {reportQuery.isFetching && <Loader2 className="size-3.5 animate-spin" />}
              Run Report
            </button>
          </div>
        </div>
        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
      </form>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Product</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">SKU</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Pack Size</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Opening</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Receive</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Issue</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Adjustment</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Closing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!applied ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-500">
                    Choose filters and click <span className="font-medium">Run Report</span>.
                  </td>
                </tr>
              ) : reportQuery.isPending ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-500">
                    <Loader2 className="size-4 animate-spin inline mr-2 align-[-2px]" />
                    Loading...
                  </td>
                </tr>
              ) : reportQuery.isError ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-red-600">
                    {getApiErrorMessage(reportQuery.error, "Failed to load stock statement")}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-500">
                    No stock movement for the selected filters.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={`${r.ProductCode}-${r.VariantId}`}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{r.ProductName}</p>
                      <p className="text-xs text-gray-500 font-mono">{r.ProductCode}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{r.SKU || "—"}</td>
                    <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{r.PackSize || "—"}</td>
                    <td className="px-5 py-3.5 text-gray-700 text-right tabular-nums">{r.Opening}</td>
                    <td className="px-5 py-3.5 text-emerald-700 text-right tabular-nums">{r.Receive}</td>
                    <td className="px-5 py-3.5 text-red-700 text-right tabular-nums">{r.Issue}</td>
                    <td className="px-5 py-3.5 text-gray-700 text-right tabular-nums">{r.Adjustment}</td>
                    <td className="px-5 py-3.5 text-gray-900 font-medium text-right tabular-nums">{r.Closing}</td>
                  </tr>
                ))
              )}
            </tbody>
            {applied && rows.length > 0 && (
              <tfoot>
                <tr className="bg-gray-50/80 border-t border-gray-200">
                  <td className="px-5 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide" colSpan={3}>
                    Total
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900 text-right tabular-nums">{totals.opening}</td>
                  <td className="px-5 py-3 text-sm font-medium text-emerald-700 text-right tabular-nums">{totals.receive}</td>
                  <td className="px-5 py-3 text-sm font-medium text-red-700 text-right tabular-nums">{totals.issue}</td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900 text-right tabular-nums">{totals.adjustment}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900 text-right tabular-nums">{totals.closing}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}
