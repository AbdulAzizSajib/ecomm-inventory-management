"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react"

import { PageHeader } from "@/components/dashboard/PageHeader"
import { cn } from "@/lib/utils"
import { getApiErrorMessage } from "@/lib/api/client"
import {
  plantFormSchema,
  usePlants,
  useCreatePlant,
  useDeletePlant,
  useUpdatePlant,
  type Plant,
  type PlantFormValues,
} from "@/features/plants"

type DialogMode =
  | { kind: "closed" }
  | { kind: "create" }
  | { kind: "edit"; plant: Plant }

export default function PlantPage() {
  const [search, setSearch] = useState("")
  const [dialog, setDialog] = useState<DialogMode>({ kind: "closed" })
  const [confirmDelete, setConfirmDelete] = useState<Plant | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const plantsQuery = usePlants()
  const deleteMutation = useDeletePlant()

  const filtered = useMemo(() => {
    const list = plantsQuery.data ?? []
    const term = search.trim().toLowerCase()
    if (!term) return list
    return list.filter((p) =>
      [
        p.PlantCode,
        p.PlantName,
        p.PlantAddress,
        p.PlantEmail,
        p.PlantPhone,
      ].some((v) => (v ?? "").toLowerCase().includes(term))
    )
  }, [plantsQuery.data, search])

  const handleDelete = (plant: Plant) => {
    setActionError(null)
    deleteMutation.mutate(plant.PlantCode, {
      onSuccess: () => setConfirmDelete(null),
      onError: (err) =>
        setActionError(getApiErrorMessage(err, "Failed to delete plant")),
    })
  }

  return (
    <div>
      <PageHeader
        title="Plants"
        description="Manage manufacturing and distribution plants"
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
            Add Plant
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
              placeholder="Search plants..."
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
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Address</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {plantsQuery.isPending ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    <Loader2 className="size-4 animate-spin inline mr-2 align-[-2px]" />
                    Loading plants...
                  </td>
                </tr>
              ) : plantsQuery.isError ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-red-600">
                    {getApiErrorMessage(plantsQuery.error, "Failed to load plants")}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    {search ? "No plants match your search." : "No plants yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((plant) => (
                  <tr key={plant.PlantCode} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-gray-600 tabular-nums font-mono text-xs">
                      {plant.PlantCode}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{plant.PlantName}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{plant.PlantAddress}</td>
                    <td className="px-5 py-3.5 text-gray-600">{plant.PlantEmail}</td>
                    <td className="px-5 py-3.5 text-gray-600 tabular-nums">{plant.PlantPhone}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                          String(plant.Active) === "1"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        )}
                      >
                        {String(plant.Active) === "1" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setActionError(null)
                            setDialog({ kind: "edit", plant })
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
                            setConfirmDelete(plant)
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
        <PlantFormDialog
          mode={dialog}
          onClose={() => setDialog({ kind: "closed" })}
        />
      )}

      {confirmDelete && (
        <ConfirmDeleteDialog
          plant={confirmDelete}
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

function PlantFormDialog({
  mode,
  onClose,
}: {
  mode: { kind: "create" } | { kind: "edit"; plant: Plant }
  onClose: () => void
}) {
  const isEdit = mode.kind === "edit"
  const [submitError, setSubmitError] = useState<string | null>(null)

  const createMutation = useCreatePlant()
  const updateMutation = useUpdatePlant()
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlantFormValues>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: {
      PlantCode: isEdit ? mode.plant.PlantCode : "",
      PlantName: isEdit ? mode.plant.PlantName : "",
      PlantAddress: isEdit ? mode.plant.PlantAddress : "",
      PlantEmail: isEdit ? mode.plant.PlantEmail : "",
      PlantPhone: isEdit ? mode.plant.PlantPhone : "",
      Active: isEdit ? String(mode.plant.Active) === "1" : true,
    },
  })

  const onSubmit = (values: PlantFormValues) => {
    setSubmitError(null)
    const active = (values.Active ? 1 : 0) as 0 | 1
    if (isEdit) {
      updateMutation.mutate(
        {
          code: mode.plant.PlantCode,
          payload: {
            PlantName: values.PlantName,
            PlantAddress: values.PlantAddress,
            PlantEmail: values.PlantEmail,
            PlantPhone: values.PlantPhone,
            Active: active,
          },
        },
        {
          onSuccess: () => onClose(),
          onError: (err) =>
            setSubmitError(getApiErrorMessage(err, "Failed to update plant")),
        }
      )
    } else {
      createMutation.mutate(
        {
          PlantCode: values.PlantCode,
          PlantName: values.PlantName,
          PlantAddress: values.PlantAddress,
          PlantEmail: values.PlantEmail,
          PlantPhone: values.PlantPhone,
          Active: active,
        },
        {
          onSuccess: () => onClose(),
          onError: (err) =>
            setSubmitError(getApiErrorMessage(err, "Failed to create plant")),
        }
      )
    }
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">
          {isEdit ? "Edit plant" : "Add plant"}
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="plant-code" className="block text-xs font-medium text-gray-700 mb-1.5">
              Code
            </label>
            <input
              id="plant-code"
              type="text"
              autoFocus={!isEdit}
              placeholder="e.g. P001"
              disabled={isEdit}
              aria-invalid={!!errors.PlantCode}
              className={cn(
                "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500",
                errors.PlantCode
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              )}
              {...register("PlantCode")}
            />
            {errors.PlantCode && (
              <p className="mt-1 text-xs text-red-600">{errors.PlantCode.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="plant-name" className="block text-xs font-medium text-gray-700 mb-1.5">
              Name
            </label>
            <input
              id="plant-name"
              type="text"
              autoFocus={isEdit}
              placeholder="e.g. Dhaka Plant"
              aria-invalid={!!errors.PlantName}
              className={cn(
                "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors",
                errors.PlantName
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              )}
              {...register("PlantName")}
            />
            {errors.PlantName && (
              <p className="mt-1 text-xs text-red-600">{errors.PlantName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="plant-address" className="block text-xs font-medium text-gray-700 mb-1.5">
            Address
          </label>
          <input
            id="plant-address"
            type="text"
            placeholder="e.g. Gazipur, Dhaka"
            aria-invalid={!!errors.PlantAddress}
            className={cn(
              "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors",
              errors.PlantAddress
                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            )}
            {...register("PlantAddress")}
          />
          {errors.PlantAddress && (
            <p className="mt-1 text-xs text-red-600">{errors.PlantAddress.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="plant-email" className="block text-xs font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              id="plant-email"
              type="email"
              placeholder="plant@company.com"
              aria-invalid={!!errors.PlantEmail}
              className={cn(
                "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors",
                errors.PlantEmail
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              )}
              {...register("PlantEmail")}
            />
            {errors.PlantEmail && (
              <p className="mt-1 text-xs text-red-600">{errors.PlantEmail.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="plant-phone" className="block text-xs font-medium text-gray-700 mb-1.5">
              Phone
            </label>
            <input
              id="plant-phone"
              type="tel"
              placeholder="01700000000"
              aria-invalid={!!errors.PlantPhone}
              className={cn(
                "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors",
                errors.PlantPhone
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              )}
              {...register("PlantPhone")}
            />
            {errors.PlantPhone && (
              <p className="mt-1 text-xs text-red-600">{errors.PlantPhone.message}</p>
            )}
          </div>
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
  plant,
  isDeleting,
  error,
  onCancel,
  onConfirm,
}: {
  plant: Plant
  isDeleting: boolean
  error: string | null
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <ModalShell onClose={isDeleting ? () => undefined : onCancel}>
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Delete plant</h3>
      </div>
      <div className="px-5 py-4 space-y-3">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-900">{plant.PlantName}</span>? This action cannot be undone.
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
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-lg border border-gray-200">
        {children}
      </div>
    </div>
  )
}
