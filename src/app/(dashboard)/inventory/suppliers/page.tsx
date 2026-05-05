"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react"

import { PageHeader } from "@/components/dashboard/PageHeader"
import { cn } from "@/lib/utils"
import { getApiErrorMessage } from "@/lib/api/client"
import {
  supplierFormSchema,
  useSuppliers,
  useCreateSupplier,
  useDeleteSupplier,
  useUpdateSupplier,
  type Supplier,
  type SupplierFormValues,
} from "@/features/suppliers"

type DialogMode =
  | { kind: "closed" }
  | { kind: "create" }
  | { kind: "edit"; supplier: Supplier }

const isActive = (a: Supplier["Active"]) => String(a) === "1"

export default function SuppliersPage() {
  const [search, setSearch] = useState("")
  const [dialog, setDialog] = useState<DialogMode>({ kind: "closed" })
  const [confirmDelete, setConfirmDelete] = useState<Supplier | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const suppliersQuery = useSuppliers()
  const deleteMutation = useDeleteSupplier()

  const filtered = useMemo(() => {
    const list = suppliersQuery.data ?? []
    const term = search.trim().toLowerCase()
    if (!term) return list
    return list.filter((s) =>
      [s.SupplierCode, s.SupplierName, s.MobileNo, s.Address].some((v) =>
        (v ?? "").toLowerCase().includes(term)
      )
    )
  }, [suppliersQuery.data, search])

  const handleDelete = (supplier: Supplier) => {
    setActionError(null)
    deleteMutation.mutate(supplier.SupplierCode, {
      onSuccess: () => setConfirmDelete(null),
      onError: (err) =>
        setActionError(getApiErrorMessage(err, "Failed to delete supplier")),
    })
  }

  return (
    <div>
      <PageHeader
        title="Suppliers"
        description="Manage suppliers and vendors"
        action={
          <button
            type="button"
            onClick={() => {
              setActionError(null)
              setDialog({ kind: "create" })
            }}
            className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus className="size-3.5" />
            Add Supplier
          </button>
        }
      />

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search suppliers..."
              className="h-8 w-full rounded-md border border-gray-200 bg-gray-50 pl-8 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Code</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Mobile</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Address</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {suppliersQuery.isPending ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                    <Loader2 className="size-4 animate-spin inline mr-2 align-[-2px]" />
                    Loading suppliers...
                  </td>
                </tr>
              ) : suppliersQuery.isError ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-red-600">
                    {getApiErrorMessage(suppliersQuery.error, "Failed to load suppliers")}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                    {search ? "No suppliers match your search." : "No suppliers yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((supplier) => (
                  <tr key={supplier.SupplierCode} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-gray-600 tabular-nums font-mono text-xs">
                      {supplier.SupplierCode}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{supplier.SupplierName}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 tabular-nums">
                      {supplier.MobileNo || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {supplier.Address || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                          isActive(supplier.Active)
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        )}
                      >
                        {isActive(supplier.Active) ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setActionError(null)
                            setDialog({ kind: "edit", supplier })
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors inline-flex items-center gap-1"
                        >
                          <Pencil className="size-3" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActionError(null)
                            setConfirmDelete(supplier)
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
      </div>

      {dialog.kind !== "closed" && (
        <SupplierFormDialog
          mode={dialog}
          onClose={() => setDialog({ kind: "closed" })}
        />
      )}

      {confirmDelete && (
        <ConfirmDeleteDialog
          supplier={confirmDelete}
          isDeleting={deleteMutation.isPending}
          error={actionError}
          onCancel={() => {
            setConfirmDelete(null)
            setActionError(null)
          }}
          onConfirm={() => handleDelete(confirmDelete)}
        />
      )}
    </div>
  )
}

function SupplierFormDialog({
  mode,
  onClose,
}: {
  mode: { kind: "create" } | { kind: "edit"; supplier: Supplier }
  onClose: () => void
}) {
  const isEdit = mode.kind === "edit"
  const [submitError, setSubmitError] = useState<string | null>(null)

  const createMutation = useCreateSupplier()
  const updateMutation = useUpdateSupplier()
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      SupplierCode: isEdit ? mode.supplier.SupplierCode : "",
      SupplierName: isEdit ? mode.supplier.SupplierName : "",
      Address: isEdit ? (mode.supplier.Address ?? "") : "",
      MobileNo: isEdit ? (mode.supplier.MobileNo ?? "") : "",
      Active: isEdit ? isActive(mode.supplier.Active) : true,
    },
  })

  const onSubmit = (values: SupplierFormValues) => {
    setSubmitError(null)
    const activeFlag = (values.Active ? 1 : 0) as 0 | 1

    if (isEdit) {
      updateMutation.mutate(
        {
          id: mode.supplier.SupplierCode,
          payload: {
            SupplierName: values.SupplierName,
            Address: values.Address,
            MobileNo: values.MobileNo,
            Active: activeFlag,
          },
        },
        {
          onSuccess: () => onClose(),
          onError: (err) =>
            setSubmitError(getApiErrorMessage(err, "Failed to update supplier")),
        }
      )
    } else {
      createMutation.mutate(
        {
          SupplierCode: values.SupplierCode,
          SupplierName: values.SupplierName,
          Address: values.Address,
          MobileNo: values.MobileNo,
          Active: activeFlag,
        },
        {
          onSuccess: () => onClose(),
          onError: (err) =>
            setSubmitError(getApiErrorMessage(err, "Failed to create supplier")),
        }
      )
    }
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">
          {isEdit ? "Edit supplier" : "Add supplier"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-4 space-y-4" noValidate>
        <div>
          <label htmlFor="supplier-code" className="block text-xs font-medium text-gray-700 mb-1.5">
            Code
          </label>
          <input
            id="supplier-code"
            type="text"
            autoFocus={!isEdit}
            readOnly={isEdit}
            placeholder="e.g. SUP001"
            aria-invalid={!!errors.SupplierCode}
            className={cn(
              "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors",
              isEdit && "bg-gray-50 text-gray-500 cursor-not-allowed",
              errors.SupplierCode
                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            )}
            {...register("SupplierCode")}
          />
          {errors.SupplierCode && (
            <p className="mt-1 text-xs text-red-600">{errors.SupplierCode.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="supplier-name" className="block text-xs font-medium text-gray-700 mb-1.5">
            Name
          </label>
          <input
            id="supplier-name"
            type="text"
            autoFocus={isEdit}
            placeholder="e.g. ABC Traders"
            aria-invalid={!!errors.SupplierName}
            className={cn(
              "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors",
              errors.SupplierName
                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            )}
            {...register("SupplierName")}
          />
          {errors.SupplierName && (
            <p className="mt-1 text-xs text-red-600">{errors.SupplierName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="supplier-mobile" className="block text-xs font-medium text-gray-700 mb-1.5">
            Mobile
          </label>
          <input
            id="supplier-mobile"
            type="text"
            placeholder="e.g. 01700000000"
            aria-invalid={!!errors.MobileNo}
            className={cn(
              "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors",
              errors.MobileNo
                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            )}
            {...register("MobileNo")}
          />
          {errors.MobileNo && (
            <p className="mt-1 text-xs text-red-600">{errors.MobileNo.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="supplier-address" className="block text-xs font-medium text-gray-700 mb-1.5">
            Address
          </label>
          <input
            id="supplier-address"
            type="text"
            placeholder="e.g. Dhaka, Bangladesh"
            aria-invalid={!!errors.Address}
            className={cn(
              "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors",
              errors.Address
                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            )}
            {...register("Address")}
          />
          {errors.Address && (
            <p className="mt-1 text-xs text-red-600">{errors.Address.message}</p>
          )}
        </div>

        <label className="flex items-center gap-2 select-none">
          <input
            type="checkbox"
            className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/30"
            {...register("Active")}
          />
          <span className="text-sm text-gray-700">Active</span>
        </label>

        {submitError && (
          <div className="rounded-md bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">
            {submitError}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="h-8 px-3 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="h-8 px-3 rounded-md bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
          >
            {isPending && <Loader2 className="size-3.5 animate-spin" />}
            {isEdit ? "Save changes" : "Create"}
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

function ConfirmDeleteDialog({
  supplier,
  isDeleting,
  error,
  onCancel,
  onConfirm,
}: {
  supplier: Supplier
  isDeleting: boolean
  error: string | null
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <ModalShell onClose={isDeleting ? () => undefined : onCancel}>
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Delete supplier</h3>
      </div>
      <div className="px-5 py-4 space-y-3">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-900">{supplier.SupplierName}</span>? This action cannot be undone.
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
    </ModalShell>
  )
}

function ModalShell({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-lg border border-gray-200">
        {children}
      </div>
    </div>
  )
}
