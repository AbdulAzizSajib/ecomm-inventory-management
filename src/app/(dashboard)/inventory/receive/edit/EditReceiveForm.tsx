"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { getApiErrorMessage } from "@/lib/api/client"
import {
  receiveEditSchema,
  useReceive,
  useUpdateReceive,
  type ReceiveEditValues,
  type UpdateReceiveItemPayload,
} from "@/features/receive"

interface EditItem extends UpdateReceiveItemPayload {
  _key: number
}

let _nextKey = 0
const newKey = () => ++_nextKey

function formatDate(str: string | null | undefined) {
  if (!str) return "—"
  return str.slice(0, 10)
}

const inputCls = (hasError?: boolean) =>
  cn(
    "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors",
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
      : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
  )

export function EditReceiveForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id") ?? ""

  const receiveQuery = useReceive(id)
  const updateMutation = useUpdateReceive()

  const [items, setItems] = useState<EditItem[]>([])
  const [itemsError, setItemsError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [newRow, setNewRow] = useState({ ProductCode: "", BatchNo: "", Quantity: "" })
  const [newRowError, setNewRowError] = useState<string | null>(null)

  useEffect(() => {
    if (receiveQuery.data?.items?.length) {
      setItems(
        receiveQuery.data.items.map((item) => ({
          _key: newKey(),
          ProductCode: item.ProductCode,
          BatchNo: item.BatchNo,
          Quantity: item.Quantity,
        }))
      )
    }
  }, [receiveQuery.data])

  const master = receiveQuery.data?.master

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReceiveEditValues>({
    resolver: zodResolver(receiveEditSchema),
    defaultValues: { Comment: "", EditBy: "" },
  })

  useEffect(() => {
    if (master) {
      reset({
        Comment: master.Comment ?? "",
        EditBy: master.EditBy ?? "",
      })
    }
  }, [master, reset])

  const addRow = () => {
    if (!newRow.ProductCode.trim()) {
      setNewRowError("Product Code is required")
      return
    }
    const qty = Number(newRow.Quantity)
    if (!qty || qty <= 0) {
      setNewRowError("Quantity must be greater than 0")
      return
    }
    setItems((prev) => [
      ...prev,
      {
        _key: newKey(),
        ProductCode: newRow.ProductCode.trim(),
        BatchNo: newRow.BatchNo.trim(),
        Quantity: qty,
      },
    ])
    setNewRow({ ProductCode: "", BatchNo: "", Quantity: "" })
    setNewRowError(null)
    setItemsError(null)
  }

  const removeItem = (key: number) => {
    setItems((prev) => prev.filter((i) => i._key !== key))
  }

  const updateItemField = (
    key: number,
    field: keyof Omit<EditItem, "_key">,
    value: string
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item._key === key
          ? {
              ...item,
              [field]: field === "Quantity" ? Number(value) || 0 : value,
            }
          : item
      )
    )
  }

  const onSubmit = (values: ReceiveEditValues) => {
    if (items.length === 0) {
      setItemsError("At least one item is required")
      return
    }
    setSubmitError(null)
    updateMutation.mutate(
      {
        id,
        payload: {
          Comment: values.Comment,
          EditBy: values.EditBy,
          items: items.map(({ ProductCode, BatchNo, Quantity }) => ({
            ProductCode,
            BatchNo,
            Quantity,
          })),
        },
      },
      {
        onSuccess: () => router.push("/inventory/receive"),
        onError: (err) =>
          setSubmitError(getApiErrorMessage(err, "Failed to update receive record")),
      }
    )
  }

  if (!id) {
    return (
      <div className="py-20 text-center text-sm text-red-600">
        Missing receive id. Return to the{" "}
        <Link href="/inventory/receive" className="text-indigo-600 hover:underline">
          receive list
        </Link>
        .
      </div>
    )
  }

  if (receiveQuery.isPending) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <Loader2 className="size-5 animate-spin mr-2" />
        Loading…
      </div>
    )
  }

  if (receiveQuery.isError) {
    return (
      <div className="py-20 text-center text-red-600 text-sm">
        {getApiErrorMessage(receiveQuery.error, "Failed to load receive record")}
      </div>
    )
  }

  const rec = master

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/inventory/receive"
          className="flex items-center justify-center size-8 rounded-md border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Edit Receive</h2>
          <p className="text-sm text-gray-500 mt-0.5 font-mono">{id}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Receive Details</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-3 text-sm">
          {[
            ["Plant", rec?.PlantCode],
            ["Store", rec?.StoreCode],
            ["Date", formatDate(rec?.QuarantineReceiveDate)],
            ["Period", rec?.Period],
            ["Supplier ID", String(rec?.SupplierId ?? "—")],
            ["Reference No", rec?.ReferenceNo || "—"],
            ["Business", rec?.Business || "—"],
            ["Returned", rec?.Returned || "—"],
            ["Created By", rec?.CreateBy || "—"],
            ["Paid", rec?.IsPaid ? "Yes" : "No"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Edit Fields</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Edited By
              </label>
              <input
                type="text"
                placeholder="e.g. admin"
                className={inputCls(!!errors.EditBy)}
                {...register("EditBy")}
              />
              {errors.EditBy && (
                <p className="mt-1 text-xs text-red-600">{errors.EditBy.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Comment
              </label>
              <input
                type="text"
                placeholder="Optional comment"
                className={inputCls(false)}
                {...register("Comment")}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Items</h3>

          {itemsError && (
            <p className="mb-3 text-xs text-red-600">{itemsError}</p>
          )}

          <div className="overflow-x-auto rounded-lg border border-gray-200 mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Product Code</th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Batch No</th>
                  <th className="text-right px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Quantity</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-sm text-gray-400">
                      No items. Add one below.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item._key} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={item.ProductCode}
                          onChange={(e) =>
                            updateItemField(item._key, "ProductCode", e.target.value)
                          }
                          className="w-full h-7 px-2 text-xs rounded border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white font-mono"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={item.BatchNo}
                          onChange={(e) =>
                            updateItemField(item._key, "BatchNo", e.target.value)
                          }
                          className="w-full h-7 px-2 text-xs rounded border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min={1}
                          value={item.Quantity}
                          onChange={(e) =>
                            updateItemField(item._key, "Quantity", e.target.value)
                          }
                          className="w-full h-7 px-2 text-xs rounded border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white text-right tabular-nums"
                        />
                      </td>
                      <td className="px-2 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(item._key)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                          aria-label="Remove"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}

                <tr className="bg-gray-50/50">
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={newRow.ProductCode}
                      onChange={(e) =>
                        setNewRow((r) => ({ ...r, ProductCode: e.target.value }))
                      }
                      placeholder="PRD001"
                      className="w-full h-7 px-2 text-xs rounded border border-dashed border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white font-mono"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={newRow.BatchNo}
                      onChange={(e) =>
                        setNewRow((r) => ({ ...r, BatchNo: e.target.value }))
                      }
                      placeholder="B001"
                      className="w-full h-7 px-2 text-xs rounded border border-dashed border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      min={1}
                      value={newRow.Quantity}
                      onChange={(e) =>
                        setNewRow((r) => ({ ...r, Quantity: e.target.value }))
                      }
                      placeholder="0"
                      className="w-full h-7 px-2 text-xs rounded border border-dashed border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white text-right tabular-nums"
                    />
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button
                      type="button"
                      onClick={addRow}
                      className="flex items-center justify-center size-7 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors mx-auto"
                      aria-label="Add row"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {newRowError && (
            <p className="text-xs text-red-600">{newRowError}</p>
          )}
        </div>

        {submitError && (
          <div className="rounded-md bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pb-6">
          <Link
            href="/inventory/receive"
            className="h-9 px-4 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="h-9 px-4 rounded-md bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
          >
            {updateMutation.isPending && <Loader2 className="size-3.5 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
