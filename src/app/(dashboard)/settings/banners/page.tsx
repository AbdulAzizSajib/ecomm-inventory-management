"use client"

import { useMemo, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
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
  bannerFormSchema,
  bannerUpdateFormSchema,
  useBanners,
  useCreateBanner,
  useDeleteBanner,
  useUpdateBanner,
  type Banner,
  type BannerFormValues,
  type BannerUpdateFormValues,
} from "@/features/banners"

function getBannerImage(banner: Banner): string | null {
  const candidate =
    (banner.ImageUrl as string | undefined) ??
    (banner.Image as string | undefined) ??
    ((banner as Record<string, unknown>).image as string | undefined) ??
    ((banner as Record<string, unknown>).ImagePath as string | undefined) ??
    ((banner as Record<string, unknown>).Path as string | undefined)
  if (!candidate) return null
  if (/^https?:\/\//i.test(candidate)) return candidate
  const base = (env as { assetBaseUrl?: string }).assetBaseUrl ?? env.apiBaseUrl
  return `${base}${candidate.startsWith("/") ? "" : "/"}${candidate}`
}

function formatDate(value: string): string {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function BannersPage() {
  const [search, setSearch] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState<Banner | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null)

  const bannersQuery = useBanners()

  const filtered = useMemo(() => {
    const list = bannersQuery.data ?? []
    const term = search.trim().toLowerCase()
    if (!term) return list
    return list.filter((b) =>
      [String(b.BannerId), b.StartDate, b.EndDate].some((v) =>
        (v ?? "").toLowerCase().includes(term)
      )
    )
  }, [bannersQuery.data, search])

  return (
    <div>
      <PageHeader
        title="Banner Management"
        description="Create and schedule promotional banners"
        action={
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus className="size-3.5" />
            New Banner
          </button>
        }
      />

      <div className="bg-white rounded-lg border border-gray-200 mb-4">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search banners..."
              className="h-8 w-full rounded-md border border-gray-200 bg-gray-50 pl-8 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
            />
          </div>
        </div>
      </div>

      {bannersQuery.isPending ? (
        <div className="bg-white rounded-lg border border-gray-200 px-5 py-12 text-center text-gray-500">
          <Loader2 className="size-4 animate-spin inline mr-2 align-[-2px]" />
          Loading banners...
        </div>
      ) : bannersQuery.isError ? (
        <div className="bg-white rounded-lg border border-gray-200 px-5 py-12 text-center text-red-600">
          {getApiErrorMessage(bannersQuery.error, "Failed to load banners")}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 px-5 py-12 text-center text-gray-500">
          {search ? "No banners match your search." : "No banners yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((banner) => {
            const imgUrl = getBannerImage(banner)
            const isActive = String(banner.Active) === "1"
            return (
              <div
                key={banner.BannerId}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {imgUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgUrl}
                      alt={`Banner ${banner.BannerId}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="size-8 text-gray-300" />
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-gray-500">
                      #{banner.BannerId}
                    </span>
                    <div className="flex items-center gap-1">
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          isActive ? "bg-emerald-500" : "bg-gray-300"
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs font-medium",
                          isActive ? "text-emerald-600" : "text-gray-400"
                        )}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>
                      <p className="text-gray-400 mb-0.5">Start</p>
                      <p className="font-medium text-gray-700">
                        {formatDate(banner.StartDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-0.5">End</p>
                      <p className="font-medium text-gray-700">
                        {formatDate(banner.EndDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 mt-3 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setEditTarget(banner)}
                      className="inline-flex items-center gap-1 h-7 px-2 rounded-md border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Pencil className="size-3" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(banner)}
                      className="inline-flex items-center gap-1 h-7 px-2 rounded-md border border-red-200 bg-white text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="size-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showCreate && (
        <CreateBannerDialog onClose={() => setShowCreate(false)} />
      )}

      {editTarget && (
        <EditBannerDialog
          banner={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteBannerDialog
          banner={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

function CreateBannerDialog({ onClose }: { onClose: () => void }) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const createMutation = useCreateBanner()
  const isPending = createMutation.isPending

  const today = new Date().toISOString().slice(0, 10)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      StartDate: today,
      EndDate: today,
      Active: true,
      // image filled by Controller
      image: undefined as unknown as File,
    },
  })

  const onSubmit = (values: BannerFormValues) => {
    setSubmitError(null)
    createMutation.mutate(
      {
        Active: values.Active ? 1 : 0,
        StartDate: values.StartDate,
        EndDate: values.EndDate,
        image: values.image,
      },
      {
        onSuccess: () => onClose(),
        onError: (err) =>
          setSubmitError(getApiErrorMessage(err, "Failed to create banner")),
      }
    )
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Add banner</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-5 py-4 space-y-4"
        noValidate
      >
        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Image
              </label>
              <label
                className={cn(
                  "flex items-center justify-center gap-2 h-32 rounded-md border-2 border-dashed cursor-pointer transition-colors overflow-hidden",
                  errors.image
                    ? "border-red-300 bg-red-50/40 hover:bg-red-50"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                )}
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-500">
                    <Upload className="size-4" />
                    <span className="text-xs">Click to upload image</span>
                    <span className="text-[10px] text-gray-400">
                      JPG, PNG, WEBP, GIF up to 5 MB
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      field.onChange(file)
                      setPreview(URL.createObjectURL(file))
                    }
                  }}
                />
              </label>
              {errors.image && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.image.message as string}
                </p>
              )}
            </div>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="banner-start"
              className="block text-xs font-medium text-gray-700 mb-1.5"
            >
              Start date
            </label>
            <input
              id="banner-start"
              type="date"
              aria-invalid={!!errors.StartDate}
              className={cn(
                "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 outline-none transition-colors",
                errors.StartDate
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              )}
              {...register("StartDate")}
            />
            {errors.StartDate && (
              <p className="mt-1 text-xs text-red-600">
                {errors.StartDate.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="banner-end"
              className="block text-xs font-medium text-gray-700 mb-1.5"
            >
              End date
            </label>
            <input
              id="banner-end"
              type="date"
              aria-invalid={!!errors.EndDate}
              className={cn(
                "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 outline-none transition-colors",
                errors.EndDate
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              )}
              {...register("EndDate")}
            />
            {errors.EndDate && (
              <p className="mt-1 text-xs text-red-600">
                {errors.EndDate.message}
              </p>
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
            Create
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

function EditBannerDialog({
  banner,
  onClose,
}: {
  banner: Banner
  onClose: () => void
}) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const initialImage = getBannerImage(banner)
  const [preview, setPreview] = useState<string | null>(initialImage)

  const updateMutation = useUpdateBanner()
  const isPending = updateMutation.isPending

  const toDateInput = (value: string): string => {
    if (!value) return ""
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value.slice(0, 10)
    return d.toISOString().slice(0, 10)
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BannerUpdateFormValues>({
    resolver: zodResolver(bannerUpdateFormSchema),
    defaultValues: {
      StartDate: toDateInput(banner.StartDate),
      EndDate: toDateInput(banner.EndDate),
      Active: String(banner.Active) === "1",
      image: undefined,
    },
  })

  const onSubmit = (values: BannerUpdateFormValues) => {
    setSubmitError(null)
    updateMutation.mutate(
      {
        id: banner.BannerId,
        Active: values.Active ? 1 : 0,
        StartDate: values.StartDate,
        EndDate: values.EndDate,
        image: values.image,
      },
      {
        onSuccess: () => onClose(),
        onError: (err) =>
          setSubmitError(getApiErrorMessage(err, "Failed to update banner")),
      }
    )
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">
          Edit banner #{banner.BannerId}
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-5 py-4 space-y-4"
        noValidate
      >
        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Image{" "}
                <span className="text-gray-400 font-normal">
                  (optional — leave to keep current)
                </span>
              </label>
              <label
                className={cn(
                  "flex items-center justify-center gap-2 h-32 rounded-md border-2 border-dashed cursor-pointer transition-colors overflow-hidden",
                  errors.image
                    ? "border-red-300 bg-red-50/40 hover:bg-red-50"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                )}
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-500">
                    <Upload className="size-4" />
                    <span className="text-xs">Click to upload image</span>
                    <span className="text-[10px] text-gray-400">
                      JPG, PNG, WEBP, GIF up to 5 MB
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      field.onChange(file)
                      setPreview(URL.createObjectURL(file))
                    }
                  }}
                />
              </label>
              {errors.image && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.image.message as string}
                </p>
              )}
            </div>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="banner-edit-start"
              className="block text-xs font-medium text-gray-700 mb-1.5"
            >
              Start date
            </label>
            <input
              id="banner-edit-start"
              type="date"
              aria-invalid={!!errors.StartDate}
              className={cn(
                "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 outline-none transition-colors",
                errors.StartDate
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              )}
              {...register("StartDate")}
            />
            {errors.StartDate && (
              <p className="mt-1 text-xs text-red-600">
                {errors.StartDate.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="banner-edit-end"
              className="block text-xs font-medium text-gray-700 mb-1.5"
            >
              End date
            </label>
            <input
              id="banner-edit-end"
              type="date"
              aria-invalid={!!errors.EndDate}
              className={cn(
                "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 outline-none transition-colors",
                errors.EndDate
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              )}
              {...register("EndDate")}
            />
            {errors.EndDate && (
              <p className="mt-1 text-xs text-red-600">
                {errors.EndDate.message}
              </p>
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
            Save
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

function DeleteBannerDialog({
  banner,
  onClose,
}: {
  banner: Banner
  onClose: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const deleteMutation = useDeleteBanner()
  const isPending = deleteMutation.isPending

  const handleConfirm = () => {
    setError(null)
    deleteMutation.mutate(banner.BannerId, {
      onSuccess: () => onClose(),
      onError: (err) =>
        setError(getApiErrorMessage(err, "Failed to delete banner")),
    })
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Delete banner</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="px-5 py-4 space-y-3">
        <p className="text-sm text-gray-700">
          Delete banner{" "}
          <span className="font-mono font-medium">#{banner.BannerId}</span>?
          This action cannot be undone.
        </p>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="h-8 px-3 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="h-8 px-3 rounded-md bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
          >
            {isPending && <Loader2 className="size-3.5 animate-spin" />}
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
