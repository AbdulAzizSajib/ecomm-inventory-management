"use client"

import { useMemo, useState } from "react"
import { Loader2, Search } from "lucide-react"

import { PageHeader } from "@/components/dashboard/PageHeader"
import { cn } from "@/lib/utils"
import { getApiErrorMessage } from "@/lib/api/client"
import { usePlants } from "@/features/plants"
import { useCurrentStock, type CurrentStockParams } from "@/features/stock"

interface FilterState {
  plant: string
  business: string
}

const inputCls = (hasError?: boolean) =>
  cn(
    "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors",
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
      : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
  )

const formatMoney = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function CurrentStockPage() {
  const plantsQuery = usePlants()

  const [filters, setFilters] = useState<FilterState>({
    plant: "",
    business: "F",
  })
  const [applied, setApplied] = useState<CurrentStockParams | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const reportQuery = useCurrentStock(
    applied ?? { plant: "", business: "" },
    !!applied
  )

  const rows = useMemo(() => reportQuery.data ?? [], [reportQuery.data])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((r) =>
      [r.ProductCode, r.ProductName, r.SKU ?? ""].some((v) =>
        v.toLowerCase().includes(term)
      )
    )
  }, [rows, search])

  const totals = useMemo(
    () =>
      filtered.reduce(
        (acc, r) => ({
          notRelease: acc.notRelease + r.NotRelease,
          sb: acc.sb + r.SB_Balance,
          combined: acc.combined + r.NotRelease_SBBalance,
          value: acc.value + r.NotRelease_SBBalance * r.TradePrice,
        }),
        { notRelease: 0, sb: 0, combined: 0, value: 0 }
      ),
    [filtered]
  )

  const onRun = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!filters.plant) return setError("Plant is required.")
    if (!filters.business.trim()) return setError("Business is required.")
    setApplied({
      plant: filters.plant,
      business: filters.business.trim(),
    })
  }

  return (
    <div>
      <PageHeader
        title="Current Stock"
        description="Live stock balance: not-released, SB, and total stock value"
      />

      <form
        onSubmit={onRun}
        className="bg-white rounded-lg border border-gray-200 p-5 mb-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        {applied && rows.length > 0 && (
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search product, SKU..."
                className="h-8 w-full rounded-md border border-gray-200 bg-gray-50 pl-8 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
              />
            </div>
            <span className="text-xs text-gray-500 ml-auto">
              {filtered.length} row{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">SKU</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Not Released</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">SB Balance</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Total</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Trade Price</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Stock Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!applied ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    Choose filters and click <span className="font-medium">Run Report</span>.
                  </td>
                </tr>
              ) : reportQuery.isPending ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    <Loader2 className="size-4 animate-spin inline mr-2 align-[-2px]" />
                    Loading...
                  </td>
                </tr>
              ) : reportQuery.isError ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-red-600">
                    {getApiErrorMessage(reportQuery.error, "Failed to load current stock")}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    {search ? "No products match your search." : "No stock found for the selected filters."}
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr
                    key={`${r.ProductCode}-${r.SKU ?? "no-sku"}-${i}`}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{r.ProductName}</p>
                      <p className="text-xs text-gray-500 font-mono">{r.ProductCode}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">
                      {r.SKU || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-5 py-3.5 text-amber-700 text-right tabular-nums">{r.NotRelease}</td>
                    <td className="px-5 py-3.5 text-gray-700 text-right tabular-nums">{r.SB_Balance}</td>
                    <td className="px-5 py-3.5 text-gray-900 font-medium text-right tabular-nums">{r.NotRelease_SBBalance}</td>
                    <td className="px-5 py-3.5 text-gray-600 text-right tabular-nums">{formatMoney(r.TradePrice)}</td>
                    <td className="px-5 py-3.5 text-gray-900 text-right tabular-nums">
                      {formatMoney(r.NotRelease_SBBalance * r.TradePrice)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {applied && filtered.length > 0 && (
              <tfoot>
                <tr className="bg-gray-50/80 border-t border-gray-200">
                  <td className="px-5 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide" colSpan={2}>
                    Total
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-amber-700 text-right tabular-nums">{totals.notRelease}</td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900 text-right tabular-nums">{totals.sb}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900 text-right tabular-nums">{totals.combined}</td>
                  <td className="px-5 py-3" />
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900 text-right tabular-nums">{formatMoney(totals.value)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}
