"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowLeft,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { getApiErrorMessage } from "@/lib/api/client"
import {
  receiveHeaderSchema,
  useCreateReceive,
  useSearchProducts,
  type CreateReceiveItemPayload,
  type ProductSearchResult,
  type ReceiveHeaderValues,
} from "@/features/receive"
import { useSuppliers } from "@/features/suppliers"

interface FormItem extends CreateReceiveItemPayload {
  SKU: string
  Attributes: string
}

interface PendingItemForm {
  product: ProductSearchResult
  BatchNo: string
  Quantity: string
  CostPrice: string
  CartonPack: string
  MFGDate: string
  ExpireDate: string
}

const emptyPending = (product: ProductSearchResult): PendingItemForm => ({
  product,
  BatchNo: "",
  Quantity: "",
  CostPrice: "",
  CartonPack: "",
  MFGDate: "",
  ExpireDate: "",
})

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

const inputCls = (hasError?: boolean) =>
  cn(
    "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors",
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
      : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
  )

export default function NewReceivePage() {
  const router = useRouter()
  const createMutation = useCreateReceive()
  const suppliersQuery = useSuppliers()

  const [items, setItems] = useState<FormItem[]>([])
  const [itemsError, setItemsError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Product search state
  const [searchInput, setSearchInput] = useState("")
  const [debouncedKeyword, setDebouncedKeyword] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [pendingItem, setPendingItem] = useState<PendingItemForm | null>(null)
  const [pendingItemError, setPendingItemError] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const searchQuery = useSearchProducts(debouncedKeyword)

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedKeyword(searchInput)
      if (searchInput.trim().length >= 2) setShowResults(true)
    }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  // Close results on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReceiveHeaderValues>({
    resolver: zodResolver(receiveHeaderSchema),
    defaultValues: {
      PlantCode: "",
      StoreCode: "",
      QuarantineReceiveDate: "",
      Period: "",
      SupplierId: undefined,
      ReferenceNo: "",
      Business: "",
      CreateBy: "",
    },
  })

  const selectProduct = (product: ProductSearchResult) => {
    setPendingItem(emptyPending(product))
    setPendingItemError(null)
    setShowResults(false)
    setSearchInput("")
    setDebouncedKeyword("")
  }

  const addItem = () => {
    if (!pendingItem) return
    const qty = Number(pendingItem.Quantity)
    const cost = Number(pendingItem.CostPrice)
    const carton = Number(pendingItem.CartonPack)
    if (!pendingItem.BatchNo.trim()) {
      setPendingItemError("Batch No is required")
      return
    }
    if (!qty || qty <= 0) {
      setPendingItemError("Quantity must be greater than 0")
      return
    }
    setItems((prev) => [
      ...prev,
      {
        ProductCode: pendingItem.product.ProductCode,
        VariantId: pendingItem.product.VariantId,
        SKU: pendingItem.product.SKU,
        Attributes: pendingItem.product.Attributes,
        BatchNo: pendingItem.BatchNo.trim(),
        Quantity: qty,
        CostPrice: cost || 0,
        CartonPack: carton || 0,
        MFGDate: pendingItem.MFGDate,
        ExpireDate: pendingItem.ExpireDate,
      },
    ])
    setPendingItem(null)
    setPendingItemError(null)
    setItemsError(null)
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = (values: ReceiveHeaderValues) => {
    if (items.length === 0) {
      setItemsError("At least one item is required")
      return
    }
    setSubmitError(null)
    createMutation.mutate(
      {
        ...values,
        items: items.map(
          ({ ProductCode, VariantId, BatchNo, Quantity, CostPrice, CartonPack, MFGDate, ExpireDate }) => ({
            ProductCode,
            VariantId,
            BatchNo,
            Quantity,
            CostPrice,
            CartonPack,
            MFGDate,
            ExpireDate,
          })
        ),
      },
      {
        onSuccess: () => router.push("/inventory/receive"),
        onError: (err) =>
          setSubmitError(getApiErrorMessage(err, "Failed to create receive record")),
      }
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/inventory/receive"
          className="flex items-center justify-center size-8 rounded-md border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h2 className="text-base font-semibold text-gray-900">New Receive</h2>
          <p className="text-sm text-gray-500 mt-0.5">Create a new inventory receive record</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Header Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Receive Information</h3>
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
            <Field label="Receive Date" error={errors.QuarantineReceiveDate?.message}>
              <input
                type="date"
                className={inputCls(!!errors.QuarantineReceiveDate)}
                {...register("QuarantineReceiveDate")}
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
            <Field label="Supplier" error={errors.SupplierId?.message}>
              <select
                className={cn(
                  inputCls(!!errors.SupplierId),
                  "cursor-pointer"
                )}
                disabled={suppliersQuery.isPending}
                {...register("SupplierId")}
              >
                <option value="">
                  {suppliersQuery.isPending ? "Loading…" : "Select supplier"}
                </option>
                {(suppliersQuery.data ?? [])
                  .filter((s) => String(s.Active) === "1")
                  .map((s) => (
                    <option key={s.SupplierCode} value={s.SupplierCode}>
                      {s.SupplierName} ({s.SupplierCode})
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="Reference No" error={errors.ReferenceNo?.message}>
              <input
                type="text"
                placeholder="e.g. INV-001"
                className={inputCls(!!errors.ReferenceNo)}
                {...register("ReferenceNo")}
              />
            </Field>
            <Field label="Business" error={errors.Business?.message}>
              <input
                type="text"
                placeholder="e.g. BB"
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
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Items</h3>

          {/* Product Search */}
          <div className="mb-5" ref={searchRef}>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Search Product (SKU / Barcode)
            </label>
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value)
                  if (e.target.value.trim().length >= 2) setShowResults(true)
                  else setShowResults(false)
                }}
                onFocus={() => {
                  if (debouncedKeyword.trim().length >= 2) setShowResults(true)
                }}
                placeholder="Type SKU or barcode…"
                className="h-9 w-full rounded-md border border-gray-200 bg-gray-50 pl-8 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
              />
              {searchQuery.isFetching && (
                <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 animate-spin" />
              )}
              {showResults && debouncedKeyword.trim().length >= 2 && (
                <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white rounded-md border border-gray-200 shadow-lg overflow-hidden">
                  {searchQuery.isPending ? (
                    <div className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
                      <Loader2 className="size-3.5 animate-spin" />
                      Searching…
                    </div>
                  ) : searchQuery.isError ? (
                    <div className="px-4 py-3 text-sm text-red-600">
                      {getApiErrorMessage(searchQuery.error, "Search failed")}
                    </div>
                  ) : (searchQuery.data ?? []).length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No products found.
                    </div>
                  ) : (
                    (searchQuery.data ?? []).map((p) => (
                      <button
                        key={p.VariantId}
                        type="button"
                        onClick={() => selectProduct(p)}
                        className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-indigo-50 text-left transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">{p.SKU}</p>
                          <p className="text-xs text-gray-500">
                            {p.ProductCode} · {p.Attributes || "—"} · {p.BarCode}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pending Item Form */}
          {pendingItem && (
            <div className="mb-5 rounded-lg border border-indigo-200 bg-indigo-50/40 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{pendingItem.product.SKU}</p>
                  <p className="text-xs text-gray-500">
                    {pendingItem.product.ProductCode} · {pendingItem.product.Attributes || "—"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setPendingItem(null); setPendingItemError(null) }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Batch No <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={pendingItem.BatchNo}
                    onChange={(e) => setPendingItem((p) => p && { ...p, BatchNo: e.target.value })}
                    placeholder="B001"
                    className="w-full h-8 px-2 text-xs rounded border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Quantity <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min={1}
                    value={pendingItem.Quantity}
                    onChange={(e) => setPendingItem((p) => p && { ...p, Quantity: e.target.value })}
                    placeholder="100"
                    className="w-full h-8 px-2 text-xs rounded border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Cost Price</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={pendingItem.CostPrice}
                    onChange={(e) => setPendingItem((p) => p && { ...p, CostPrice: e.target.value })}
                    placeholder="0.00"
                    className="w-full h-8 px-2 text-xs rounded border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Carton Pack</label>
                  <input
                    type="number"
                    min={0}
                    value={pendingItem.CartonPack}
                    onChange={(e) => setPendingItem((p) => p && { ...p, CartonPack: e.target.value })}
                    placeholder="10"
                    className="w-full h-8 px-2 text-xs rounded border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">MFG Date</label>
                  <input
                    type="date"
                    value={pendingItem.MFGDate}
                    onChange={(e) => setPendingItem((p) => p && { ...p, MFGDate: e.target.value })}
                    className="w-full h-8 px-2 text-xs rounded border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Expire Date</label>
                  <input
                    type="date"
                    value={pendingItem.ExpireDate}
                    onChange={(e) => setPendingItem((p) => p && { ...p, ExpireDate: e.target.value })}
                    className="w-full h-8 px-2 text-xs rounded border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white"
                  />
                </div>
              </div>
              {pendingItemError && (
                <p className="mt-2 text-xs text-red-600">{pendingItemError}</p>
              )}
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-indigo-600 text-xs font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="size-3.5" />
                  Add to List
                </button>
              </div>
            </div>
          )}

          {/* Items Error */}
          {itemsError && (
            <p className="mb-3 text-xs text-red-600">{itemsError}</p>
          )}

          {/* Items Table */}
          {items.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200">
                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">#</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">SKU</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Attributes</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Batch No</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Qty</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Cost Price</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Carton</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">MFG Date</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Expire Date</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-3 py-2.5 text-xs text-gray-400 tabular-nums">{i + 1}</td>
                      <td className="px-3 py-2.5">
                        <p className="text-sm font-medium text-gray-900 whitespace-nowrap">{item.SKU}</p>
                        <p className="text-xs text-gray-500">{item.ProductCode}</p>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-gray-600">{item.Attributes || "—"}</td>
                      <td className="px-3 py-2.5 text-sm text-gray-700 font-mono">{item.BatchNo}</td>
                      <td className="px-3 py-2.5 text-sm text-gray-700 text-right tabular-nums">{item.Quantity}</td>
                      <td className="px-3 py-2.5 text-sm text-gray-700 text-right tabular-nums">{item.CostPrice}</td>
                      <td className="px-3 py-2.5 text-sm text-gray-700 text-right tabular-nums">{item.CartonPack}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-600 whitespace-nowrap">{item.MFGDate || "—"}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-600 whitespace-nowrap">{item.ExpireDate || "—"}</td>
                      <td className="px-3 py-2.5">
                        <button
                          type="button"
                          onClick={() => removeItem(i)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 py-10 text-center text-sm text-gray-400">
              No items added yet. Search for a product above.
            </div>
          )}
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="rounded-md bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pb-6">
          <Link
            href="/inventory/receive"
            className="h-9 px-4 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="h-9 px-4 rounded-md bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
          >
            {createMutation.isPending && <Loader2 className="size-3.5 animate-spin" />}
            Create Receive
          </button>
        </div>
      </form>
    </div>
  )
}
