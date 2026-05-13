"use client"

import { useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  Loader2,
  Search,
  Building2,
  Briefcase,
  Play,
  RotateCcw,
  FileBarChart,
  Inbox,
  PackageMinus,
  PackageOpen,
  Boxes,
  Wallet,
} from "lucide-react"

import { PageHeader } from "@/components/dashboard/PageHeader"
import { cn } from "@/lib/utils"
import { getApiErrorMessage } from "@/lib/api/client"
import { usePlants } from "@/features/plants"
import {
  stockKeys,
  useCurrentStock,
  type CurrentStockParams,
} from "@/features/stock"

interface FilterState {
  plant: string
  business: string
}

const DEFAULT_FILTERS: FilterState = {
  plant: "",
  business: "F",
}

const baseInputCls =
  "w-full h-9 pl-9 pr-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"

const formatMoney = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const SUMMARY_CARDS = [
  { key: "notRelease", label: "Not Released", icon: PackageMinus, bg: "bg-amber-50",   text: "text-amber-700",   accent: "border-l-amber-400",   money: false },
  { key: "sb",         label: "SB Balance",   icon: PackageOpen,  bg: "bg-slate-50",   text: "text-slate-700",   accent: "border-l-slate-300",   money: false },
  { key: "combined",   label: "Total Stock",  icon: Boxes,        bg: "bg-indigo-50",  text: "text-indigo-700",  accent: "border-l-indigo-400",  money: false },
  { key: "value",      label: "Stock Value",  icon: Wallet,       bg: "bg-emerald-50", text: "text-emerald-700", accent: "border-l-emerald-400", money: true  },
] as const

export default function CurrentStockPage() {
  const plantsQuery = usePlants()
  const qc = useQueryClient()

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [applied, setApplied] = useState<CurrentStockParams | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  // Auto-select first active plant when none chosen yet
  const activePlants = useMemo(
    () => (plantsQuery.data ?? []).filter((p) => String(p.Active) === "1"),
    [plantsQuery.data]
  )
  const firstPlantCode = activePlants[0]?.PlantCode ?? ""
  const selectedPlant = filters.plant || firstPlantCode

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
          sb:         acc.sb         + r.SB_Balance,
          combined:   acc.combined   + r.NotRelease_SBBalance,
          value:      acc.value      + r.NotRelease_SBBalance * r.TradePrice,
        }),
        { notRelease: 0, sb: 0, combined: 0, value: 0 }
      ),
    [filtered]
  )

  const onRun = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!selectedPlant) return setError("Plant is required.")
    if (!filters.business.trim()) return setError("Business is required.")
    const params: CurrentStockParams = {
      plant: selectedPlant,
      business: filters.business.trim(),
    }
    // Invalidate so an identical-params re-click still refetches.
    qc.invalidateQueries({ queryKey: stockKeys.current(params) })
    setApplied(params)
  }

  const onReset = () => {
    setFilters(DEFAULT_FILTERS)
    setApplied(null)
    setSearch("")
    setError(null)
  }

  const showResults = !!applied
  const showSummary =
    showResults && !reportQuery.isPending && !reportQuery.isError && filtered.length > 0

  return (
    <div>
      <PageHeader
        title="Current Stock"
        description="Live stock balance: not-released, SB, and total stock value"
      />

      {/* ── Filters ─────────────────────────────────────────────── */}
      <form
        onSubmit={onRun}
        className="bg-white rounded-lg border border-gray-200 mb-5 overflow-hidden"
      >
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2 bg-linear-to-r from-indigo-50/60 to-transparent">
          <FileBarChart className="size-4 text-indigo-600" />
          <h3 className="text-sm font-semibold text-gray-900">Report Filters</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FilterField label="Plant" icon={Building2}>
              <select
                value={selectedPlant}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, plant: e.target.value }))
                }
                disabled={plantsQuery.isPending}
                className={cn(baseInputCls, "cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed")}
              >
                {plantsQuery.isPending ? (
                  <option value="">Loading plants…</option>
                ) : activePlants.length === 0 ? (
                  <option value="">No plants available</option>
                ) : (
                  activePlants.map((p) => (
                    <option key={p.PlantCode} value={p.PlantCode}>
                      {p.PlantName} ({p.PlantCode})
                    </option>
                  ))
                )}
              </select>
            </FilterField>

            <FilterField label="Business" icon={Briefcase}>
              <input
                type="text"
                value={filters.business}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, business: e.target.value }))
                }
                placeholder="e.g. F"
                className={baseInputCls}
              />
            </FilterField>

            <div className="flex items-end gap-2 lg:col-span-2">
              <button
                type="button"
                onClick={onReset}
                disabled={reportQuery.isFetching}
                className="h-9 px-3 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 inline-flex items-center gap-1.5"
              >
                <RotateCcw className="size-3.5" />
                Reset
              </button>
              <button
                type="submit"
                disabled={reportQuery.isFetching || plantsQuery.isPending}
                className="h-9 flex-1 px-4 rounded-md bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5 shadow-sm"
              >
                {reportQuery.isFetching ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Play className="size-3.5" />
                )}
                Run Report
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-3 rounded-md bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}
        </div>
      </form>

      {/* ── Summary cards ───────────────────────────────────────── */}
      {showSummary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {SUMMARY_CARDS.map((c) => {
            const Icon = c.icon
            const raw = totals[c.key]
            const value = c.money ? formatMoney(raw) : raw.toLocaleString()
            return (
              <div
                key={c.key}
                className={cn(
                  "rounded-lg border border-gray-200 bg-white p-4 border-l-4",
                  c.accent
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {c.label}
                  </span>
                  <span className={cn("size-7 rounded-md flex items-center justify-center", c.bg)}>
                    <Icon className={cn("size-3.5", c.text)} />
                  </span>
                </div>
                <p className={cn("text-2xl font-semibold tabular-nums", c.text)}>
                  {c.money && "৳"}
                  {value}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Results table ───────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-gray-200">
        {showResults && (rows.length > 0 || search) && (
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
              <span className="font-medium text-gray-900">{filtered.length}</span> row
              {filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70">
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">Product</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">SKU</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-amber-700 uppercase tracking-wide whitespace-nowrap">Not Released</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">SB Balance</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-indigo-700 uppercase tracking-wide whitespace-nowrap">Total</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">Trade Price</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-emerald-700 uppercase tracking-wide whitespace-nowrap">Stock Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {!showResults ? (
                <EmptyRow
                  colSpan={7}
                  icon={FileBarChart}
                  title="No report run yet"
                  hint={
                    <>
                      Adjust filters and click{" "}
                      <span className="font-medium text-gray-700">Run Report</span> to load data.
                    </>
                  }
                />
              ) : reportQuery.isPending ? (
                <SkeletonRows rows={6} />
              ) : reportQuery.isError ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <p className="text-sm font-medium text-red-700">
                      {getApiErrorMessage(reportQuery.error, "Failed to load current stock")}
                    </p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <EmptyRow
                  colSpan={7}
                  icon={Inbox}
                  title={search ? "No matches" : "No stock"}
                  hint={
                    search
                      ? "No products match your search."
                      : "No stock found for the selected plant."
                  }
                />
              ) : (
                filtered.map((r, i) => (
                  <tr
                    key={`${r.ProductCode}-${r.SKU ?? "no-sku"}-${i}`}
                    className={cn(
                      "hover:bg-indigo-50/30 transition-colors",
                      reportQuery.isFetching && "opacity-60"
                    )}
                  >
                    <td className="px-3 py-2.5">
                      <p className="font-medium text-gray-900">{r.ProductName}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{r.ProductCode}</p>
                    </td>
                    <td className="px-3 py-2.5 text-gray-700 font-mono text-xs">
                      {r.SKU || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      <span className="text-amber-700 font-medium">{r.NotRelease}</span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 text-right tabular-nums">{r.SB_Balance}</td>
                    <td className="px-3 py-2.5 text-indigo-700 font-semibold text-right tabular-nums">
                      {r.NotRelease_SBBalance}
                    </td>
                    <td className="px-3 py-2.5 text-gray-600 text-right tabular-nums">
                      ৳{formatMoney(r.TradePrice)}
                    </td>
                    <td className="px-3 py-2.5 text-emerald-700 font-medium text-right tabular-nums">
                      ৳{formatMoney(r.NotRelease_SBBalance * r.TradePrice)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {showSummary && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-gray-50/40">
            <span>
              Showing <span className="font-medium text-gray-900">{filtered.length}</span> of{" "}
              <span className="font-medium text-gray-900">{rows.length}</span> products
            </span>
            <span className="font-mono">
              {applied?.plant} · {applied?.business}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Small helpers ───────────────────────────────────────────────────────────

function FilterField({
  label,
  icon: Icon,
  children,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
        {children}
      </div>
    </div>
  )
}

function SkeletonRows({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-5 py-3.5">
            <div className="h-3.5 w-44 bg-gray-200 rounded" />
            <div className="h-2.5 w-24 bg-gray-100 rounded mt-2" />
          </td>
          <td className="px-5 py-3.5"><div className="h-3 w-16 bg-gray-200 rounded" /></td>
          <td className="px-5 py-3.5"><div className="h-3 w-12 bg-gray-200 rounded ml-auto" /></td>
          <td className="px-5 py-3.5"><div className="h-3 w-12 bg-gray-200 rounded ml-auto" /></td>
          <td className="px-5 py-3.5"><div className="h-3 w-12 bg-gray-200 rounded ml-auto" /></td>
          <td className="px-5 py-3.5"><div className="h-3 w-16 bg-gray-200 rounded ml-auto" /></td>
          <td className="px-5 py-3.5"><div className="h-3 w-20 bg-gray-200 rounded ml-auto" /></td>
        </tr>
      ))}
    </>
  )
}

function EmptyRow({
  colSpan,
  icon: Icon,
  title,
  hint,
}: {
  colSpan: number
  icon: React.ComponentType<{ className?: string }>
  title: string
  hint: React.ReactNode
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-14 text-center">
        <div className="inline-flex flex-col items-center gap-2">
          <div className="size-10 rounded-full bg-gray-50 flex items-center justify-center">
            <Icon className="size-5 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700">{title}</p>
          <p className="text-xs text-gray-500">{hint}</p>
        </div>
      </td>
    </tr>
  )
}
