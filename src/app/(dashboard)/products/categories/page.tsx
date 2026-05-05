"use client"

import { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react"

import { PageHeader } from "@/components/dashboard/PageHeader"
import { cn } from "@/lib/utils"
import { getApiErrorMessage } from "@/lib/api/client"
import {
  categoryFormSchema,
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
  type Category,
  type CategoryFormValues,
} from "@/features/categories"
import { useAttributes } from "@/features/attributes"

type DialogMode =
  | { kind: "closed" }
  | { kind: "create" }
  | { kind: "edit"; category: Category }

export default function CategoriesPage() {
  const [search, setSearch] = useState("")
  const [dialog, setDialog] = useState<DialogMode>({ kind: "closed" })
  const [confirmDelete, setConfirmDelete] = useState<Category | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const categoriesQuery = useCategories()
  const deleteMutation = useDeleteCategory()

  const filtered = useMemo(() => {
    const list = categoriesQuery.data ?? []
    const term = search.trim().toLowerCase()
    if (!term) return list
    return list.filter((c) =>
      [c.CategoryName, String(c.CategoryCode)].some((v) =>
        v.toLowerCase().includes(term)
      )
    )
  }, [categoriesQuery.data, search])

  const handleDelete = (category: Category) => {
    setActionError(null)
    deleteMutation.mutate(category.CategoryCode, {
      onSuccess: () => setConfirmDelete(null),
      onError: (err) =>
        setActionError(getApiErrorMessage(err, "Failed to delete category")),
    })
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize your products into categories"
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
            Add Category
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
              placeholder="Search categories..."
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
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categoriesQuery.isPending ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-500">
                    <Loader2 className="size-4 animate-spin inline mr-2 align-[-2px]" />
                    Loading categories...
                  </td>
                </tr>
              ) : categoriesQuery.isError ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-red-600">
                    {getApiErrorMessage(categoriesQuery.error, "Failed to load categories")}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-500">
                    {search ? "No categories match your search." : "No categories yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((category) => (
                  <tr key={category.CategoryCode} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-gray-600 tabular-nums font-mono text-xs">
                      #{category.CategoryCode}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{category.CategoryName}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                          category.Active === "Y"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        )}
                      >
                        {category.Active === "Y" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setActionError(null)
                            setDialog({ kind: "edit", category })
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
                            setConfirmDelete(category)
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
        <CategoryFormDialog
          mode={dialog}
          onClose={() => setDialog({ kind: "closed" })}
        />
      )}

      {confirmDelete && (
        <ConfirmDeleteDialog
          category={confirmDelete}
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

function CategoryFormDialog({
  mode,
  onClose,
}: {
  mode: { kind: "create" } | { kind: "edit"; category: Category }
  onClose: () => void
}) {
  const isEdit = mode.kind === "edit"
  const [submitError, setSubmitError] = useState<string | null>(null)

  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const attributesQuery = useAttributes()
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: isEdit ? mode.category.CategoryName : "",
      attributes: [],
    },
  })

  const onSubmit = (values: CategoryFormValues) => {
    setSubmitError(null)
    if (isEdit) {
      updateMutation.mutate(
        { id: mode.category.CategoryCode, payload: values },
        {
          onSuccess: () => onClose(),
          onError: (err) =>
            setSubmitError(getApiErrorMessage(err, "Failed to update category")),
        }
      )
    } else {
      createMutation.mutate(values, {
        onSuccess: () => onClose(),
        onError: (err) =>
          setSubmitError(getApiErrorMessage(err, "Failed to create category")),
      })
    }
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">
          {isEdit ? "Edit category" : "Add category"}
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
          <label htmlFor="category-name" className="block text-xs font-medium text-gray-700 mb-1.5">
            Name
          </label>
          <input
            id="category-name"
            type="text"
            autoFocus
            placeholder="e.g. Syrup"
            aria-invalid={!!errors.name}
            className={cn(
              "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors",
              errors.name
                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            )}
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Attributes
          </label>
          <Controller
            control={control}
            name="attributes"
            render={({ field }) => {
              const selected = new Set(field.value)
              const toggle = (id: number) => {
                const next = new Set(selected)
                if (next.has(id)) next.delete(id)
                else next.add(id)
                field.onChange(Array.from(next))
              }
              return (
                <div className="rounded-md border border-gray-200 bg-gray-50/50 max-h-44 overflow-y-auto">
                  {attributesQuery.isPending ? (
                    <div className="px-3 py-3 text-xs text-gray-500 inline-flex items-center gap-1.5">
                      <Loader2 className="size-3.5 animate-spin" />
                      Loading attributes...
                    </div>
                  ) : attributesQuery.isError ? (
                    <div className="px-3 py-3 text-xs text-red-600">
                      {getApiErrorMessage(attributesQuery.error, "Failed to load attributes")}
                    </div>
                  ) : (attributesQuery.data ?? []).length === 0 ? (
                    <div className="px-3 py-3 text-xs text-gray-500">
                      No attributes available.
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {(attributesQuery.data ?? []).map((attr) => (
                        <li key={attr.AttributeId}>
                          <label className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-white">
                            <input
                              type="checkbox"
                              className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/30"
                              checked={selected.has(attr.AttributeId)}
                              onChange={() => toggle(attr.AttributeId)}
                            />
                            <span className="text-sm text-gray-700">{attr.Name}</span>
                            <span className="ml-auto text-[11px] text-gray-400 font-mono">
                              #{attr.AttributeId}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            }}
          />
          {errors.attributes && (
            <p className="mt-1 text-xs text-red-600">{errors.attributes.message}</p>
          )}
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

function ConfirmDeleteDialog({
  category,
  isDeleting,
  error,
  onCancel,
  onConfirm,
}: {
  category: Category
  isDeleting: boolean
  error: string | null
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <ModalShell onClose={isDeleting ? () => undefined : onCancel}>
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Delete category</h3>
      </div>
      <div className="px-5 py-4 space-y-3">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-900">{category.CategoryName}</span>? This action cannot be undone.
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
