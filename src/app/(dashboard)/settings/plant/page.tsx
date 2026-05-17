"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Building2,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react"

import { PageHeader } from "@/components/dashboard/PageHeader"
import { cn } from "@/lib/utils"
import { env } from "@/lib/config"
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

function buildImageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  const base = (env as { assetBaseUrl?: string }).assetBaseUrl ?? env.apiBaseUrl
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`
}

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
        p.Remarks ?? "",
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
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Plant</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Address</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Email</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">Phone</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {plantsQuery.isPending ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                    <Loader2 className="size-4 animate-spin inline mr-2 align-[-2px]" />
                    Loading plants...
                  </td>
                </tr>
              ) : plantsQuery.isError ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-red-600">
                    {getApiErrorMessage(plantsQuery.error, "Failed to load plants")}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                    {search ? "No plants match your search." : "No plants yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((plant) => {
                  const imgUrl = buildImageUrl(plant.ImagePath)
                  return (
                    <tr key={plant.PlantCode} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="size-10 shrink-0 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
                            {imgUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={imgUrl}
                                alt={plant.PlantName}
                                className="size-full object-cover"
                              />
                            ) : (
                              <Building2 className="size-4 text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{plant.PlantName}</p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">{plant.PlantCode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 hidden md:table-cell">
                        {plant.PlantAddress}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 hidden lg:table-cell">{plant.PlantEmail}</td>
                      <td className="px-5 py-3.5 text-gray-600 tabular-nums hidden sm:table-cell">{plant.PlantPhone}</td>
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
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {dialog.kind !== "closed" && (
        <PlantFormDialog
          key={dialog.kind === "edit" ? dialog.plant.PlantCode : "create"}
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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [newPreview, setNewPreview] = useState<string | null>(null)
  const [removeExisting, setRemoveExisting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const existingImage =
    isEdit && !removeExisting ? buildImageUrl(mode.plant.ImagePath) : null
  const previewUrl = newPreview ?? existingImage

  const createMutation = useCreatePlant()
  const updateMutation = useUpdatePlant()
  const isPending = createMutation.isPending || updateMutation.isPending

  // Revoke blob URL on unmount
  useEffect(() => {
    return () => {
      if (newPreview) URL.revokeObjectURL(newPreview)
    }
  }, [newPreview])

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
      Remarks: isEdit ? (mode.plant.Remarks ?? "") : "",
    },
  })

  const pickFile = (file: File) => {
    if (!file.type.startsWith("image/")) return
    if (newPreview) URL.revokeObjectURL(newPreview)
    setImageFile(file)
    setNewPreview(URL.createObjectURL(file))
    setRemoveExisting(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) pickFile(file)
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) pickFile(file)
  }

  const clearImage = () => {
    if (newPreview) URL.revokeObjectURL(newPreview)
    setNewPreview(null)
    setImageFile(null)
    if (isEdit) setRemoveExisting(true)
  }

  const onSubmit = (values: PlantFormValues) => {
    setSubmitError(null)
    const fd = new FormData()
    fd.append("PlantName", values.PlantName)
    fd.append("PlantAddress", values.PlantAddress)
    fd.append("PlantEmail", values.PlantEmail)
    fd.append("PlantPhone", values.PlantPhone)
    if (values.Remarks && values.Remarks.trim() !== "") {
      fd.append("Remarks", values.Remarks.trim())
    }
    if (imageFile) fd.append("image", imageFile)

    if (isEdit) {
      updateMutation.mutate(
        { code: mode.plant.PlantCode, formData: fd },
        {
          onSuccess: () => onClose(),
          onError: (err) =>
            setSubmitError(getApiErrorMessage(err, "Failed to update plant")),
        }
      )
    } else {
      fd.append("PlantCode", values.PlantCode)
      createMutation.mutate(fd, {
        onSuccess: () => onClose(),
        onError: (err) =>
          setSubmitError(getApiErrorMessage(err, "Failed to create plant")),
      })
    }
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">
          {isEdit ? `Edit plant · ${mode.plant.PlantCode}` : "Add plant"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-60"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-5 py-4 space-y-4 max-h-[80vh] overflow-y-auto"
        noValidate
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Code" error={errors.PlantCode?.message}>
            <input
              type="text"
              autoFocus={!isEdit}
              placeholder="e.g. P001"
              disabled={isEdit}
              aria-invalid={!!errors.PlantCode}
              className={inputCn(!!errors.PlantCode, isEdit)}
              {...register("PlantCode")}
            />
          </Field>

          <Field label="Name" error={errors.PlantName?.message}>
            <input
              type="text"
              autoFocus={isEdit}
              placeholder="e.g. Dhaka Plant"
              aria-invalid={!!errors.PlantName}
              className={inputCn(!!errors.PlantName)}
              {...register("PlantName")}
            />
          </Field>
        </div>

        <Field label="Address" error={errors.PlantAddress?.message}>
          <input
            type="text"
            placeholder="e.g. Gazipur, Dhaka"
            aria-invalid={!!errors.PlantAddress}
            className={inputCn(!!errors.PlantAddress)}
            {...register("PlantAddress")}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Email" error={errors.PlantEmail?.message}>
            <input
              type="email"
              placeholder="plant@company.com"
              aria-invalid={!!errors.PlantEmail}
              className={inputCn(!!errors.PlantEmail)}
              {...register("PlantEmail")}
            />
          </Field>

          <Field label="Phone" error={errors.PlantPhone?.message}>
            <input
              type="tel"
              placeholder="01700000000"
              aria-invalid={!!errors.PlantPhone}
              className={inputCn(!!errors.PlantPhone)}
              {...register("PlantPhone")}
            />
          </Field>
        </div>

        <Field label="Remarks" error={errors.Remarks?.message}>
          <textarea
            rows={2}
            placeholder="Any additional notes..."
            aria-invalid={!!errors.Remarks}
            className={cn(
              "w-full px-3 py-2 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors resize-none",
              errors.Remarks
                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            )}
            {...register("Remarks")}
          />
        </Field>

        {/* Image section */}
        <div>
          <p className="block text-xs font-medium text-gray-700 mb-1.5">
            Image
            <span className="font-normal text-gray-400 ml-1">(optional)</span>
            {isEdit && imageFile && (
              <span className="ml-1.5 inline-flex items-center rounded-full bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600">
                new
              </span>
            )}
            {isEdit && removeExisting && !imageFile && (
              <span className="ml-1.5 inline-flex items-center rounded-full bg-red-50 border border-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-600">
                removed
              </span>
            )}
          </p>

          {previewUrl ? (
            <div className="flex items-start gap-3">
              <div className="relative size-24 rounded-md overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Plant"
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-1 right-1 size-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="size-3" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-9 px-3 rounded-md border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center gap-1.5"
              >
                <ImageIcon className="size-3.5" />
                Replace
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed p-5 cursor-pointer transition-colors",
                isDragging
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/50"
              )}
            >
              <Upload
                className={cn(
                  "size-5",
                  isDragging ? "text-indigo-500" : "text-gray-400"
                )}
              />
              <p className="text-xs font-medium text-gray-600">
                Drop image here or{" "}
                <span className="text-indigo-600">click to browse</span>
              </p>
              <p className="text-[10px] text-gray-400">PNG, JPG, WEBP</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

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
      <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

function inputCn(hasError: boolean, disabled = false) {
  return cn(
    "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors",
    disabled && "disabled:bg-gray-50 disabled:text-gray-500",
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
      : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-lg border border-gray-200">
        {children}
      </div>
    </div>
  )
}
