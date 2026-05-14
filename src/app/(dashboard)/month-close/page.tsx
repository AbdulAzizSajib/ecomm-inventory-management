"use client"

import { useMemo, useState } from "react"
import {
  Building2,
  CalendarCheck,
  Loader2,
  Play,
  RefreshCcw,
} from "lucide-react"

import { PageHeader } from "@/components/dashboard/PageHeader"
import { cn } from "@/lib/utils"
import { getApiErrorMessage } from "@/lib/api/client"
import { usePlants } from "@/features/plants"
import {
  useCloseMonth,
  useMonthClosePeriod,
  type MonthClosePeriod,
} from "@/features/month-close"

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const pad2 = (n: number) => String(n).padStart(2, "0")

interface PeriodInfo {
  year: number
  month: number // 1-12
  fromDate: string // YYYY-MM-DD
  toDate: string // YYYY-MM-DD
  label: string // e.g. July 2026
}

function parsePeriod(period: MonthClosePeriod | undefined): PeriodInfo | null {
  if (!period) return null
  // Period is an ISO date like 2026-07-01T00:00:00.000Z — treat the YYYY-MM
  // prefix as authoritative to avoid timezone shifting the month.
  const iso = period.Period.slice(0, 10)
  const [yStr, mStr] = iso.split("-")
  const year = Number(yStr)
  const month = Number(mStr)
  if (!year || !month) return null
  const fromDate = `${year}-${pad2(month)}-01`
  // Last day of month: day 0 of next month.
  const last = new Date(year, month, 0).getDate()
  const toDate = `${year}-${pad2(month)}-${pad2(last)}`
  const label = `${MONTH_NAMES[month - 1]} ${year}`
  return { year, month, fromDate, toDate, label }
}

export default function MonthClosePage() {
  const plantsQuery = usePlants()
  const [plantCode, setPlantCode] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const activePlants = useMemo(
    () => (plantsQuery.data ?? []).filter((p) => String(p.Active) === "1"),
    [plantsQuery.data]
  )

  // Auto-select first active plant
  const firstPlant = activePlants[0]?.PlantCode ?? ""
  const selectedPlant = plantCode || firstPlant

  const periodQuery = useMonthClosePeriod(selectedPlant)
  const closeMutation = useCloseMonth()

  const period = periodQuery.data?.data?.[0]
  const info = parsePeriod(period)

  const handleClose = () => {
    if (!info || !selectedPlant) return
    setActionError(null)
    setSuccessMsg(null)
    closeMutation.mutate(
      {
        plantCode: selectedPlant,
        fromDate: info.fromDate,
        toDate: info.toDate,
      },
      {
        onSuccess: (data) => {
          setConfirmOpen(false)
          setSuccessMsg(data.message ?? `Closed ${info.label} for ${selectedPlant}.`)
        },
        onError: (err) =>
          setActionError(getApiErrorMessage(err, "Failed to close month")),
      }
    )
  }

  return (
    <div>
      <PageHeader
        title="Month Closing"
        description="Close the current accounting period for a plant"
      />

      <div className="bg-white rounded-lg border border-gray-200 max-w-2xl">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2 bg-linear-to-r from-indigo-50/60 to-transparent">
          <CalendarCheck className="size-4 text-indigo-600" />
          <h3 className="text-sm font-semibold text-gray-900">Close Period</h3>
        </div>

        <div className="p-5 space-y-5">
          {/* Plant select */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Plant</label>
            <div className="relative">
              <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
              <select
                value={selectedPlant}
                onChange={(e) => {
                  setPlantCode(e.target.value)
                  setSuccessMsg(null)
                  setActionError(null)
                }}
                disabled={plantsQuery.isPending}
                className={cn(
                  "w-full h-9 pl-9 pr-3 text-sm rounded-md border bg-white text-gray-900 outline-none transition-colors cursor-pointer",
                  "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
                  "disabled:opacity-60 disabled:cursor-not-allowed"
                )}
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
            </div>
          </div>

          {/* Period info */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-gray-700">Next Period to Close</label>
              <button
                type="button"
                onClick={() => periodQuery.refetch()}
                disabled={!selectedPlant || periodQuery.isFetching}
                className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
              >
                <RefreshCcw className={cn("size-3", periodQuery.isFetching && "animate-spin")} />
                Refresh
              </button>
            </div>

            <div className="rounded-md border border-gray-200 bg-gray-50/60 px-4 py-3 min-h-[64px] flex items-center">
              {!selectedPlant ? (
                <p className="text-sm text-gray-400">Select a plant.</p>
              ) : periodQuery.isPending ? (
                <p className="text-sm text-gray-500 inline-flex items-center gap-1.5">
                  <Loader2 className="size-3.5 animate-spin" />
                  Loading period…
                </p>
              ) : periodQuery.isError ? (
                <p className="text-sm text-red-600">
                  {getApiErrorMessage(periodQuery.error, "Failed to load period")}
                </p>
              ) : !info ? (
                <p className="text-sm text-gray-500">
                  No open period for this plant — everything is already closed.
                </p>
              ) : (
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900">{info.label}</p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    {info.fromDate} → {info.toDate}
                  </p>
                  {period?.ManualPeriod && (
                    <p className="text-[11px] text-amber-700 mt-1">
                      Manual period: {period.ManualPeriod}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={
                !info || !selectedPlant || periodQuery.isPending || closeMutation.isPending
              }
              className="h-9 px-4 rounded-md bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-1.5 shadow-sm"
            >
              <Play className="size-3.5" />
              Close Month
            </button>
          </div>

          {successMsg && (
            <div className="rounded-md bg-emerald-50 border border-emerald-100 px-3 py-2 text-xs text-emerald-700">
              {successMsg}
            </div>
          )}
        </div>
      </div>

      {confirmOpen && info && (
        <ConfirmCloseDialog
          plantCode={selectedPlant}
          info={info}
          isPending={closeMutation.isPending}
          error={actionError}
          onCancel={() => {
            setConfirmOpen(false)
            setActionError(null)
          }}
          onConfirm={handleClose}
        />
      )}
    </div>
  )
}

function ConfirmCloseDialog({
  plantCode,
  info,
  isPending,
  error,
  onCancel,
  onConfirm,
}: {
  plantCode: string
  info: PeriodInfo
  isPending: boolean
  error: string | null
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={isPending ? undefined : onCancel}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-lg border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Close month?</h3>
        </div>
        <div className="px-5 py-4 space-y-3">
          <p className="text-sm text-gray-600">
            This will close <span className="font-medium text-gray-900">{info.label}</span>{" "}
            for plant <span className="font-mono text-gray-900">{plantCode}</span>. After closing,
            no further transactions can be posted into this period.
          </p>
          <p className="text-xs text-gray-500 font-mono">
            {info.fromDate} → {info.toDate}
          </p>
          {error && (
            <div className="rounded-md bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="h-8 px-3 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className="h-8 px-3 rounded-md bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              {isPending && <Loader2 className="size-3.5 animate-spin" />}
              Confirm Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
