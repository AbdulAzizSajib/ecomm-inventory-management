"use client"

import { useEffect, useMemo, useState } from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, PackageCheck, Search, X } from "lucide-react"

import { PageHeader } from "@/components/dashboard/PageHeader"
import { cn } from "@/lib/utils"
import { getApiErrorMessage } from "@/lib/api/client"
import {
  releaseHeaderSchema,
  useCreateRelease,
  useNotReleased,
  useNotReleasedItems,
  type CreateReleaseItemPayload,
  type NotReleasedItem,
  type ReleaseHeaderValues,
} from "@/features/release"

const LIMIT = 10

function formatDate(str: string | null | undefined) {
  if (!str) return "—"
  return str.slice(0, 10)
}

function periodFromDate(str: string | null | undefined) {
  if (!str) return ""
  const d = str.slice(0, 10)
  const [y, m] = d.split("-")
  if (!y || !m) return ""
  return `${y}${m}`
}

interface ItemRow {
  ProductCode: string
  VariantId: number
  BatchNo: string
  SKU: string
  Attributes: string
  RecQty: number
  Quantity: string
  MFGDate: string
  ExpireDate: string
}

interface ItemEdit {
  Quantity: string
  MFGDate: string
  ExpireDate: string
}

const itemKey = (productCode: string, variantId: number, batchNo: string) =>
  `${productCode}|${variantId}|${batchNo}`

const inputCls = (hasError?: boolean) =>
  cn(
    "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors",
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
      : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
  )

const cellInputCls =
  "w-full h-8 px-2 text-xs rounded border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white"

export default function NotReceivedPage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selected, setSelected] = useState<NotReleasedItem | null>(null)

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim())
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const listQuery = useNotReleased(page, LIMIT, debouncedSearch)
  const totalPage = listQuery.data?.totalPage ?? 1
  const total = listQuery.data?.total ?? 0
  const rows = listQuery.data?.data ?? []

  return (
    <div>
      <PageHeader
        title="Not Received"
        description="Quarantine receives waiting to be released into stock"
      />

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search receive no, reference..."
              className="h-8 w-full rounded-md border border-gray-200 bg-gray-50 pl-8 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Receive No</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Receive Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Reference No</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Business</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">FGTN No</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Supplier</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {listQuery.isPending ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    <Loader2 className="size-4 animate-spin inline mr-2 align-[-2px]" />
                    Loading...
                  </td>
                </tr>
              ) : listQuery.isError ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-red-600">
                    {getApiErrorMessage(listQuery.error, "Failed to load not-released receives")}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    {debouncedSearch ? "No receives match your search." : "Nothing pending release."}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.QuarantineReceiveNo} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-indigo-600 whitespace-nowrap">
                      {row.QuarantineReceiveNo}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 tabular-nums whitespace-nowrap">
                      {formatDate(row.QuarantineReceiveDate)}
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{row.ReferenceNo || "—"}</td>
                    <td className="px-5 py-3.5 text-gray-700">{row.Business || "—"}</td>
                    <td className="px-5 py-3.5 text-gray-700">{row.FgtnNo || "—"}</td>
                    <td className="px-5 py-3.5 text-gray-600 tabular-nums">{row.supplierId}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelected(row)}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors inline-flex items-center gap-1"
                      >
                        <PackageCheck className="size-3" />
                        Release
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {total > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm text-gray-600">
            <span>
              {total} record{total !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || listQuery.isPending}
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
                disabled={page >= totalPage || listQuery.isPending}
                className="h-7 px-2.5 rounded border border-gray-200 text-xs font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <ReleaseDialog
          source={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

function ReleaseDialog({
  source,
  onClose,
}: {
  source: NotReleasedItem
  onClose: () => void
}) {
  const itemsQuery = useNotReleasedItems(source.QuarantineReceiveNo)
  const createMutation = useCreateRelease()

  const [edits, setEdits] = useState<Record<string, ItemEdit>>({})
  const [itemsError, setItemsError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReleaseHeaderValues>({
    resolver: zodResolver(releaseHeaderSchema),
    defaultValues: {
      PlantCode: "",
      StoreCode: "",
      FgtnNo: source.FgtnNo ?? "",
      ReceiveDate: formatDate(source.QuarantineReceiveDate),
      Period: periodFromDate(source.QuarantineReceiveDate),
      Business: source.Business ?? "",
      CreateBy: "",
    },
  })

  const items: ItemRow[] = useMemo(() => {
    const data = itemsQuery.data?.data
    if (!data) return []
    return data.map((it) => {
      const key = itemKey(it.ProductCode, it.variantId, it.batchNo)
      const edit = edits[key]
      return {
        ProductCode: it.ProductCode,
        VariantId: it.variantId,
        BatchNo: it.batchNo,
        SKU: it.SKU,
        Attributes: it.Attributes,
        RecQty: it.RecQty,
        Quantity: edit?.Quantity ?? String(it.RecQty ?? ""),
        MFGDate: edit?.MFGDate ?? "",
        ExpireDate: edit?.ExpireDate ?? "",
      }
    })
  }, [itemsQuery.data, edits])

  const updateItem = (row: ItemRow, patch: Partial<ItemEdit>) => {
    const key = itemKey(row.ProductCode, row.VariantId, row.BatchNo)
    setEdits((prev) => {
      const current: ItemEdit = prev[key] ?? {
        Quantity: row.Quantity,
        MFGDate: row.MFGDate,
        ExpireDate: row.ExpireDate,
      }
      return { ...prev, [key]: { ...current, ...patch } }
    })
  }

  const totalQty = useMemo(
    () => items.reduce((sum, it) => sum + (Number(it.Quantity) || 0), 0),
    [items]
  )

  const onSubmit = (values: ReleaseHeaderValues) => {
    setSubmitError(null)
    setItemsError(null)
    if (items.length === 0) {
      setItemsError("No items to release.")
      return
    }
    const payloadItems: CreateReleaseItemPayload[] = []
    for (const [i, it] of items.entries()) {
      const qty = Number(it.Quantity)
      if (!qty || qty <= 0) {
        setItemsError(`Row ${i + 1}: Quantity must be greater than 0.`)
        return
      }
      if (qty > it.RecQty) {
        setItemsError(`Row ${i + 1}: Quantity cannot exceed received quantity (${it.RecQty}).`)
        return
      }
      if (!it.MFGDate) {
        setItemsError(`Row ${i + 1}: MFG Date is required.`)
        return
      }
      if (!it.ExpireDate) {
        setItemsError(`Row ${i + 1}: Expire Date is required.`)
        return
      }
      payloadItems.push({
        ProductCode: it.ProductCode,
        VariantId: it.VariantId,
        BatchNo: it.BatchNo,
        Quantity: qty,
        MFGDate: it.MFGDate,
        ExpireDate: it.ExpireDate,
      })
    }

    createMutation.mutate(
      {
        PlantCode: values.PlantCode,
        StoreCode: values.StoreCode,
        FgtnNo: values.FgtnNo,
        ReceiveDate: values.ReceiveDate,
        Period: values.Period,
        QuarantineReceiveNo: source.QuarantineReceiveNo,
        Business: values.Business,
        CreateBy: values.CreateBy,
        items: payloadItems,
      },
      {
        onSuccess: () => onClose(),
        onError: (err) =>
          setSubmitError(getApiErrorMessage(err, "Failed to release receive")),
      }
    )
  }

  const isSubmitting = createMutation.isPending

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={isSubmitting ? undefined : onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-4xl max-h-full overflow-y-auto rounded-lg bg-white shadow-lg border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Release receive</h3>
            <p className="text-xs text-gray-500 mt-0.5 font-mono">{source.QuarantineReceiveNo}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-60"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-5 py-4 space-y-5">
          <section>
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Release Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Field label="Plant Code" error={errors.PlantCode?.message}>
                <input
                  type="text"
                  placeholder="e.g. P001"
                  className={inputCls(!!errors.PlantCode)}
                  {...register("PlantCode")}
                />
              </Field>
              <Field label="Store Code" error={errors.StoreCode?.message}>
                <input
                  type="text"
                  placeholder="e.g. S1"
                  className={inputCls(!!errors.StoreCode)}
                  {...register("StoreCode")}
                />
              </Field>
              <Field label="Receive Date" error={errors.ReceiveDate?.message}>
                <input
                  type="date"
                  className={inputCls(!!errors.ReceiveDate)}
                  {...register("ReceiveDate")}
                />
              </Field>
              <Field label="Period" error={errors.Period?.message}>
                <input
                  type="text"
                  placeholder="e.g. 202604"
                  className={inputCls(!!errors.Period)}
                  {...register("Period")}
                />
              </Field>
              <Field label="FGTN No" error={errors.FgtnNo?.message}>
                <input
                  type="text"
                  placeholder="optional"
                  className={inputCls(!!errors.FgtnNo)}
                  {...register("FgtnNo")}
                />
              </Field>
              <Field label="Business" error={errors.Business?.message}>
                <input
                  type="text"
                  placeholder="e.g. F"
                  className={inputCls(!!errors.Business)}
                  {...register("Business")}
                />
              </Field>
              <Field label="Created By" error={errors.CreateBy?.message}>
                <input
                  type="text"
                  placeholder="e.g. admin"
                  className={inputCls(!!errors.CreateBy)}
                  {...register("CreateBy")}
                />
              </Field>
              <Field label="Reference No">
                <input
                  type="text"
                  value={source.ReferenceNo ?? ""}
                  readOnly
                  className={cn(inputCls(false), "bg-gray-50 text-gray-500 cursor-not-allowed")}
                />
              </Field>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Items
              </h4>
              {items.length > 0 && (
                <span className="text-xs text-gray-500 tabular-nums">
                  Total qty: <span className="font-medium text-gray-700">{totalQty}</span>
                </span>
              )}
            </div>

            {itemsQuery.isPending ? (
              <div className="rounded-lg border border-dashed border-gray-300 py-10 text-center text-sm text-gray-500">
                <Loader2 className="size-4 animate-spin inline mr-2 align-[-2px]" />
                Loading items...
              </div>
            ) : itemsQuery.isError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 py-4 px-4 text-sm text-red-700">
                {getApiErrorMessage(itemsQuery.error, "Failed to load items")}
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 py-10 text-center text-sm text-gray-400">
                No items found for this receive.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200">
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">#</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Product</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Attributes</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Batch No</th>
                      <th className="text-right px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Rec Qty</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Quantity</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">MFG Date</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Expire Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((it, i) => (
                      <tr key={`${it.ProductCode}-${it.VariantId}-${i}`} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-3 py-2.5 text-xs text-gray-400 tabular-nums">{i + 1}</td>
                        <td className="px-3 py-2.5">
                          <p className="text-sm font-medium text-gray-900 whitespace-nowrap">{it.SKU}</p>
                          <p className="text-xs text-gray-500">{it.ProductCode}</p>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-gray-600">{it.Attributes || "—"}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700 font-mono">{it.BatchNo}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700 text-right tabular-nums">{it.RecQty}</td>
                        <td className="px-3 py-2.5 w-28">
                          <input
                            type="number"
                            min={1}
                            max={it.RecQty}
                            value={it.Quantity}
                            onChange={(e) => updateItem(it, { Quantity: e.target.value })}
                            className={cellInputCls}
                          />
                        </td>
                        <td className="px-3 py-2.5 w-40">
                          <input
                            type="date"
                            value={it.MFGDate}
                            onChange={(e) => updateItem(it, { MFGDate: e.target.value })}
                            className={cellInputCls}
                          />
                        </td>
                        <td className="px-3 py-2.5 w-40">
                          <input
                            type="date"
                            value={it.ExpireDate}
                            onChange={(e) => updateItem(it, { ExpireDate: e.target.value })}
                            className={cellInputCls}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {itemsError && (
              <p className="mt-2 text-xs text-red-600">{itemsError}</p>
            )}
          </section>

          {submitError && (
            <div className="rounded-md bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">
              {submitError}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 px-4 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || itemsQuery.isPending || items.length === 0}
              className="h-9 px-4 rounded-md bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
              Release
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
