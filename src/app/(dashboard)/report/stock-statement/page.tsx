"use client"

import { useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  Loader2,
  Building2,
  Briefcase,
  Calendar,
  Play,
  RotateCcw,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Scale,
  PackageCheck,
  FileBarChart,
  Inbox,
} from "lucide-react"

import { PageHeader } from "@/components/dashboard/PageHeader"
import { cn } from "@/lib/utils"
import { getApiErrorMessage } from "@/lib/api/client"
import { usePlants } from "@/features/plants"
import {
  stockKeys,
  useStockStatement,
  type StockStatementParams,
} from "@/features/stock"

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

const DEFAULT_FILTERS: FilterState = {
  plant: "",
  business: "F",
  fromDate: firstOfMonthIso(),
  toDate: todayIso(),
}

const baseInputCls =
  "w-full h-9 pl-9 pr-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"

const SUMMARY_CARDS = [
  { key: "opening",    label: "Opening",    icon: Package,         bg: "bg-slate-50",   text: "text-slate-700",   accent: "border-l-slate-300"   },
  { key: "receive",    label: "Receive",    icon: ArrowDownToLine, bg: "bg-emerald-50", text: "text-emerald-700", accent: "border-l-emerald-400" },
  { key: "issue",      label: "Issue",      icon: ArrowUpFromLine, bg: "bg-rose-50",    text: "text-rose-700",    accent: "border-l-rose-400"    },
  { key: "adjustment", label: "Adjustment", icon: Scale,           bg: "bg-amber-50",   text: "text-amber-700",   accent: "border-l-amber-400"   },
  { key: "closing",    label: "Closing",    icon: PackageCheck,    bg: "bg-indigo-50",  text: "text-indigo-700",  accent: "border-l-indigo-400"  },
] as const

export default function StockStatementPage() {
  const plantsQuery = usePlants()
  const qc = useQueryClient()

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [applied, setApplied] = useState<StockStatementParams | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Derive: auto-select the first active plant when nothing chosen yet
  const activePlants = useMemo(
    () => (plantsQuery.data ?? []).filter((p) => String(p.Active) === "1"),
    [plantsQuery.data]
  )
  const firstPlantCode = activePlants[0]?.PlantCode ?? ""
  const selectedPlant = filters.plant || firstPlantCode

  const reportQuery = useStockStatement(
    applied ?? { plant: "", business: "", fromDate: "", toDate: "" },
    !!applied
  )

  const rows = useMemo(() => reportQuery.data ?? [], [reportQuery.data])
  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, r) => ({
          opening:    acc.opening    + r.Opening,
          receive:    acc.receive    + r.Receive,
          issue:      acc.issue      + r.Issue,
          adjustment: acc.adjustment + r.Adjustment,
          closing:    acc.closing    + r.Closing,
        }),
        { opening: 0, receive: 0, issue: 0, adjustment: 0, closing: 0 }
      ),
    [rows]
  )

  const onRun = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!selectedPlant) return setError("Plant is required.")
    if (!filters.business.trim()) return setError("Business is required.")
    if (!filters.fromDate) return setError("From date is required.")
    if (!filters.toDate) return setError("To date is required.")
    if (filters.fromDate > filters.toDate)
      return setError("From date must be before or equal to To date.")
    const params: StockStatementParams = {
      plant: selectedPlant,
      business: filters.business.trim(),
      fromDate: filters.fromDate,
      toDate: filters.toDate,
    }
    // Invalidate so an identical-params re-click still refetches.
    qc.invalidateQueries({ queryKey: stockKeys.statement(params) })
    setApplied(params)
  }

  const onReset = () => {
    setFilters(DEFAULT_FILTERS)
    setApplied(null)
    setError(null)
  }

  const showResults = !!applied
  const showSummary = showResults && !reportQuery.isPending && !reportQuery.isError && rows.length > 0

  return (
    <div>
      <PageHeader
        title="Stock Statement"
        description="Period-based opening, receive, issue, adjustment, and closing"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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

            <FilterField label="From Date" icon={Calendar}>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, fromDate: e.target.value }))
                }
                className={baseInputCls}
              />
            </FilterField>

            <FilterField label="To Date" icon={Calendar}>
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, toDate: e.target.value }))
                }
                className={baseInputCls}
              />
            </FilterField>

            <div className="flex items-end gap-2">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
          {SUMMARY_CARDS.map((c) => {
            const Icon = c.icon
            const value = totals[c.key]
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
                  {value.toLocaleString()}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Results table ───────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70">
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">Product</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">SKU</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">Pack Size</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wide">Opening</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-emerald-700 uppercase tracking-wide">Receive</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-rose-700 uppercase tracking-wide">Issue</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-amber-700 uppercase tracking-wide">Adjustment</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-indigo-700 uppercase tracking-wide">Closing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {!showResults ? (
                <EmptyRow
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
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <p className="text-sm font-medium text-red-700">
                      {getApiErrorMessage(reportQuery.error, "Failed to load stock statement")}
                    </p>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <EmptyRow
                  icon={Inbox}
                  title="No stock movement"
                  hint="No transactions for the selected plant and period."
                />
              ) : (
                rows.map((r) => (
                  <tr
                    key={`${r.ProductCode}-${r.VariantId}`}
                    className={cn(
                      "hover:bg-indigo-50/30 transition-colors",
                      reportQuery.isFetching && "opacity-60"
                    )}
                  >
                    <td className="px-3 py-2.5">
                      <p className="font-medium text-gray-900">{r.ProductName}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{r.ProductCode}</p>
                    </td>
                    <td className="px-3 py-2.5 text-gray-700 font-mono text-xs">{r.SKU || "—"}</td>
                    <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{r.PackSize || "—"}</td>
                    <td className="px-3 py-2.5 text-slate-700 text-right tabular-nums">{r.Opening}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      <span className="text-emerald-700 font-medium">{r.Receive}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      <span className="text-rose-700 font-medium">{r.Issue}</span>
                    </td>
                    <td className="px-3 py-2.5 text-amber-700 text-right tabular-nums">{r.Adjustment}</td>
                    <td className="px-3 py-2.5 text-indigo-700 font-semibold text-right tabular-nums">
                      {r.Closing}
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
              Showing <span className="font-medium text-gray-900">{rows.length}</span> products
            </span>
            <span className="font-mono">
              {applied?.plant} · {applied?.business} · {applied?.fromDate} → {applied?.toDate}
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
          <td className="px-5 py-3.5">
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </td>
          <td className="px-5 py-3.5">
            <div className="h-3 w-14 bg-gray-200 rounded" />
          </td>
          <td className="px-5 py-3.5"><div className="h-3 w-10 bg-gray-200 rounded ml-auto" /></td>
          <td className="px-5 py-3.5"><div className="h-3 w-10 bg-gray-200 rounded ml-auto" /></td>
          <td className="px-5 py-3.5"><div className="h-3 w-10 bg-gray-200 rounded ml-auto" /></td>
          <td className="px-5 py-3.5"><div className="h-3 w-10 bg-gray-200 rounded ml-auto" /></td>
          <td className="px-5 py-3.5"><div className="h-3 w-12 bg-gray-200 rounded ml-auto" /></td>
        </tr>
      ))}
    </>
  )
}

function EmptyRow({
  icon: Icon,
  title,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  hint: React.ReactNode
}) {
  return (
    <tr>
      <td colSpan={8} className="px-5 py-14 text-center">
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
