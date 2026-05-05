"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react"

import { PageHeader } from "@/components/dashboard/PageHeader"
import { cn } from "@/lib/utils"
import { getApiErrorMessage } from "@/lib/api/client"
import {
  useReceives,
  useDeleteReceive,
  type ReceiveListItem,
} from "@/features/receive"

const LIMIT = 10

function formatDate(str: string | null) {
  if (!str) return "—"
  return str.slice(0, 10)
}

export default function ReceivePage() {
  const [page, setPage] = useState(1)
  const [confirmDelete, setConfirmDelete] = useState<ReceiveListItem | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const receivesQuery = useReceives(page, LIMIT)
  const deleteMutation = useDeleteReceive()

  const totalPage = receivesQuery.data?.totalPage ?? 1
  const total = receivesQuery.data?.total ?? 0
  const rows = receivesQuery.data?.data ?? []

  const handleDelete = (item: ReceiveListItem) => {
    setDeleteError(null)
    deleteMutation.mutate(item.QuarantineReceiveNo, {
      onSuccess: () => setConfirmDelete(null),
      onError: (err) =>
        setDeleteError(getApiErrorMessage(err, "Failed to delete receive")),
    })
  }

  return (
    <div>
      <PageHeader
        title="Receive"
        description="Manage inventory receive records"
        action={
          <Link
            href="/inventory/receive/new"
            className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus className="size-3.5" />
            New Receive
          </Link>
        }
      />

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Receive No</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Plant</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Receive Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Reference No</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Business</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Period</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Paid</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">Created By</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {receivesQuery.isPending ? (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-gray-500">
                    <Loader2 className="size-4 animate-spin inline mr-2 align-[-2px]" />
                    Loading...
                  </td>
                </tr>
              ) : receivesQuery.isError ? (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-red-600">
                    {getApiErrorMessage(receivesQuery.error, "Failed to load receive records")}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-gray-500">
                    No receive records yet.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.QuarantineReceiveNo} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-indigo-600 whitespace-nowrap">
                      {row.QuarantineReceiveNo}
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{row.PlantCode}</td>
                    <td className="px-5 py-3.5 text-gray-600 tabular-nums whitespace-nowrap">
                      {formatDate(row.QuarantineReceiveDate)}
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{row.ReferenceNo || "—"}</td>
                    <td className="px-5 py-3.5 text-gray-700">{row.Business || "—"}</td>
                    <td className="px-5 py-3.5 text-gray-600 tabular-nums">{row.Period}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                          row.IsPaid
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        )}
                      >
                        {row.IsPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{row.CreateBy || "—"}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/inventory/receive/edit?id=${encodeURIComponent(row.QuarantineReceiveNo)}`}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors inline-flex items-center gap-1"
                        >
                          <Pencil className="size-3" />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError(null)
                            setConfirmDelete(row)
                          }}
                          className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors inline-flex items-center gap-1"
                        >
                          <Trash2 className="size-3" />
                          Delete
                        </button>
                      </div>
                    </td>
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
                disabled={page <= 1 || receivesQuery.isPending}
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
                disabled={page >= totalPage || receivesQuery.isPending}
                className="h-7 px-2.5 rounded border border-gray-200 text-xs font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {confirmDelete && (
        <ConfirmDeleteDialog
          item={confirmDelete}
          isDeleting={deleteMutation.isPending}
          error={deleteError}
          onCancel={() => {
            setConfirmDelete(null)
            setDeleteError(null)
          }}
          onConfirm={() => handleDelete(confirmDelete)}
        />
      )}
    </div>
  )
}

function ConfirmDeleteDialog({
  item,
  isDeleting,
  error,
  onCancel,
  onConfirm,
}: {
  item: ReceiveListItem
  isDeleting: boolean
  error: string | null
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={isDeleting ? undefined : onCancel}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-lg border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Delete receive record</h3>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete receive{" "}
            <span className="font-medium text-gray-900">{item.QuarantineReceiveNo}</span>?
            This action cannot be undone.
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
              disabled={isDeleting}
              className="h-8 px-3 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="h-8 px-3 rounded-md bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              {isDeleting && <Loader2 className="size-3.5 animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
