"use client"

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ChevronDown,
  ChevronRight,
  ImagePlus,
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
import { getApiErrorMessage } from "@/lib/api/client"
import {
  productFormSchema,
  useProducts,
  useProductDetail,
  useProductVariants,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
  type Product,
  type ProductFormValues,
} from "@/features/products"
import { useCategories } from "@/features/categories"
import { useBrands } from "@/features/brands"
import { useAttributes } from "@/features/attributes"

const PAGE_LIMIT = 10

type DialogMode =
  | { kind: "closed" }
  | { kind: "create" }
  | { kind: "edit"; product: Product }

export default function ProductsPage() {
  const [page, setPage] = useState(1)
  const [rawSearch, setRawSearch] = useState("")
  const [search, setSearch] = useState("")
  const [dialog, setDialog] = useState<DialogMode>({ kind: "closed" })
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [expandedCode, setExpandedCode] = useState<string | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSearchChange = useCallback((value: string) => {
    setRawSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearch(value)
      setPage(1)
    }, 400)
  }, [])

  const productsQuery = useProducts({ page, limit: PAGE_LIMIT, search })
  const deleteMutation = useDeleteProduct()

  const products = productsQuery.data?.data ?? []
  const pagination = productsQuery.data?.pagination

  const handleDelete = (product: Product) => {
    setActionError(null)
    deleteMutation.mutate(product.ProductCode, {
      onSuccess: () => {
        setConfirmDelete(null)
        if (products.length === 1 && page > 1) setPage((p) => p - 1)
      },
      onError: (err) =>
        setActionError(getApiErrorMessage(err, "Failed to delete product")),
    })
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        action={
          <button
            type="button"
            onClick={() => setDialog({ kind: "create" })}
            className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus className="size-3.5" />
            Add Product
          </button>
        }
      />

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
            <input
              type="text"
              value={rawSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search products..."
              className="h-8 w-full rounded-md border border-gray-200 bg-gray-50 pl-8 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Pack Size</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">MRP</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">Trade Price</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Plant</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {productsQuery.isPending ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                    <Loader2 className="size-4 animate-spin inline mr-2 align-[-2px]" />
                    Loading products...
                  </td>
                </tr>
              ) : productsQuery.isError ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-red-600">
                    {getApiErrorMessage(productsQuery.error, "Failed to load products")}
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                    {search ? "No products match your search." : "No products yet."}
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isExpanded = expandedCode === product.ProductCode
                  return (
                    <Fragment key={product.ProductCode}>
                      <tr
                        onClick={() =>
                          setExpandedCode((prev) =>
                            prev === product.ProductCode ? null : product.ProductCode
                          )
                        }
                        className={cn(
                          "hover:bg-gray-50/50 transition-colors cursor-pointer",
                          isExpanded && "bg-indigo-50/40",
                          productsQuery.isFetching && "opacity-60"
                        )}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-start gap-2">
                            {isExpanded ? (
                              <ChevronDown className="size-3.5 mt-1 text-gray-400 shrink-0" />
                            ) : (
                              <ChevronRight className="size-3.5 mt-1 text-gray-400 shrink-0" />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{product.ProductName}</p>
                              <p className="text-xs text-gray-400 mt-0.5 font-mono">{product.ProductCode}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600 hidden md:table-cell">{product.PackSize}</td>
                        <td className="px-5 py-3.5 font-medium text-gray-900 tabular-nums">৳{product.MRP}</td>
                        <td className="px-5 py-3.5 text-gray-600 tabular-nums hidden sm:table-cell">৳{product.TradePrice}</td>
                        <td className="px-5 py-3.5 text-gray-600 hidden lg:table-cell font-mono text-xs">{product.PlantCode}</td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setDialog({ kind: "edit", product })
                              }}
                              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors inline-flex items-center gap-1"
                            >
                              <Pencil className="size-3" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setActionError(null)
                                setConfirmDelete(product)
                              }}
                              className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors inline-flex items-center gap-1"
                            >
                              <Trash2 className="size-3" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="px-5 py-3 bg-gray-50/60 border-t border-gray-100">
                            <ProductVariantsPanel code={product.ProductCode} />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {pagination
              ? `Showing ${(page - 1) * PAGE_LIMIT + 1}–${Math.min(page * PAGE_LIMIT, pagination.total)} of ${pagination.total} products`
              : "—"}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-7 px-3 rounded-md border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={!pagination || page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-7 px-3 rounded-md border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {dialog.kind !== "closed" && (
        <ProductFormDialog
          mode={dialog}
          onClose={() => setDialog({ kind: "closed" })}
        />
      )}

      {confirmDelete && (
        <ConfirmDeleteDialog
          product={confirmDelete}
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

// ─── Variants panel (expanded row) ───────────────────────────────────────────
function ProductVariantsPanel({ code }: { code: string }) {
  const variantsQuery = useProductVariants(code)

  if (variantsQuery.isPending) {
    return (
      <div className="text-xs text-gray-500 py-2">
        <Loader2 className="size-3.5 animate-spin inline mr-1.5 align-[-2px]" />
        Loading variants...
      </div>
    )
  }

  if (variantsQuery.isError) {
    return (
      <div className="text-xs text-red-600 py-2">
        {getApiErrorMessage(variantsQuery.error, "Failed to load variants")}
      </div>
    )
  }

  const variants = variantsQuery.data ?? []
  if (variants.length === 0) {
    return <div className="text-xs text-gray-400 py-2">No variants for this product.</div>
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-3 py-2 font-medium text-gray-500 uppercase tracking-wide">Barcode</th>
            <th className="text-left px-3 py-2 font-medium text-gray-500 uppercase tracking-wide">SKU</th>
            <th className="text-left px-3 py-2 font-medium text-gray-500 uppercase tracking-wide">Attributes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {variants.map((v, i) => (
            <tr key={`${v.BarCode}-${i}`}>
              <td className="px-3 py-2 font-mono text-gray-700">{v.BarCode}</td>
              <td className="px-3 py-2 font-mono text-gray-700">{v.SKU}</td>
              <td className="px-3 py-2 text-gray-600">{v.Attributes || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Variant types ───────────────────────────────────────────────────────────
interface VariantAttr {
  AttributeId: number
  Value: string
}

interface VariantInput {
  BarCode: string
  SKU: string
  SellingPrice: number
  attributes: VariantAttr[]
}

interface VariantFormState {
  editIndex: number | null
  BarCode: string
  SKU: string
  SellingPrice: string
  attributes: VariantAttr[]
}

function emptyVariantForm(): VariantFormState {
  return { editIndex: null, BarCode: "", SKU: "", SellingPrice: "", attributes: [] }
}

// ─── Image state ────────────────────────────────────────────────────────────
type ExistingImage = { kind: "existing"; url: string }
type NewImage = { kind: "new"; file: File; previewUrl: string }
type ImageEntry = ExistingImage | NewImage

function buildPreviews(files: File[]): NewImage[] {
  return files.map((file) => ({
    kind: "new" as const,
    file,
    previewUrl: URL.createObjectURL(file),
  }))
}

// ─── Form dialog ─────────────────────────────────────────────────────────────
function ProductFormDialog({
  mode,
  onClose,
}: {
  mode: { kind: "create" } | { kind: "edit"; product: Product }
  onClose: () => void
}) {
  const isEdit = mode.kind === "edit"
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [newImages, setNewImages] = useState<NewImage[]>([])
  const [removedUrls, setRemovedUrls] = useState<Set<string>>(new Set())
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [variants, setVariants] = useState<VariantInput[]>([])
  const [variantForm, setVariantForm] = useState<VariantFormState>(emptyVariantForm)
  const [variantError, setVariantError] = useState<string | null>(null)

  const categoriesQuery = useCategories()
  const brandsQuery = useBrands()
  const attributesQuery = useAttributes()
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const isPending = createMutation.isPending || updateMutation.isPending

  // Fetch existing images when editing
  const detailQuery = useProductDetail(isEdit ? mode.product.ProductCode : null)

  // Derive server images — no setState needed
  const serverImages = useMemo<ExistingImage[]>(() => {
    if (!isEdit) return []
    return (detailQuery.data?.images ?? []).map((url) => ({
      kind: "existing" as const,
      url,
    }))
  }, [isEdit, detailQuery.data?.images])

  // Combined display list
  const images: ImageEntry[] = [
    ...serverImages.filter((img) => !removedUrls.has(img.url)),
    ...newImages,
  ]

  // Revoke blob URLs on unmount
  useEffect(() => {
    return () => {
      newImages.forEach((img) => URL.revokeObjectURL(img.previewUrl))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"))
    if (!arr.length) return
    setNewImages((prev) => [...prev, ...buildPreviews(arr)])
  }, [])

  const removeImage = (index: number) => {
    const entry = images[index]
    if (entry.kind === "existing") {
      setRemovedUrls((prev) => new Set(prev).add(entry.url))
    } else {
      URL.revokeObjectURL(entry.previewUrl)
      setNewImages((prev) => prev.filter((_, i) => i !== images.slice(serverImages.length).indexOf(entry)))
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files)
    e.target.value = ""
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: isEdit
      ? {
          ProductCode: mode.product.ProductCode,
          ProductName: mode.product.ProductName,
          CategoryCode: String(mode.product.CategoryCode),
          BrandCode: String(mode.product.BrandCode),
          PackSize: mode.product.PackSize,
          TradePrice: String(mode.product.TradePrice),
          MRP: String(mode.product.MRP),
          PlantCode: mode.product.PlantCode,
        }
      : {
          ProductCode: "",
          ProductName: "",
          CategoryCode: "",
          BrandCode: "",
          PackSize: "",
          TradePrice: "",
          MRP: "",
          PlantCode: "",
        },
  })

  const onSubmit = (values: ProductFormValues) => {
    if (variants.length === 0) {
      setVariantError("At least one variant is required.")
      return
    }
    setVariantError(null)
    setSubmitError(null)
    const formData = new FormData()
    formData.append("ProductName", values.ProductName)
    formData.append("CategoryCode", values.CategoryCode)
    formData.append("BrandCode", values.BrandCode)
    formData.append("PackSize", values.PackSize)
    formData.append("TradePrice", values.TradePrice)
    formData.append("MRP", values.MRP)
    formData.append("PlantCode", values.PlantCode)

    if (variants.length > 0) {
      formData.append("variants", JSON.stringify(variants))
    }

    const newFiles = images.filter((img): img is NewImage => img.kind === "new")
    newFiles.forEach((img) => formData.append("images", img.file))

    if (isEdit) {
      updateMutation.mutate(
        { code: mode.product.ProductCode, formData },
        {
          onSuccess: () => onClose(),
          onError: (err) =>
            setSubmitError(getApiErrorMessage(err, "Failed to update product")),
        }
      )
    } else {
      formData.append("ProductCode", values.ProductCode)
      createMutation.mutate(formData, {
        onSuccess: () => onClose(),
        onError: (err) =>
          setSubmitError(getApiErrorMessage(err, "Failed to create product")),
      })
    }
  }

  const newCount = images.filter((i) => i.kind === "new").length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-lg rounded-lg bg-white shadow-lg border border-gray-200 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-sm font-semibold text-gray-900">
            {isEdit ? `Edit product · ${mode.product.ProductCode}` : "Add product"}
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

        {/* Scrollable body */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col overflow-hidden">
          <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1">

            {!isEdit && (
              <Field label="Product Code" error={errors.ProductCode?.message}>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. P1005"
                  aria-invalid={!!errors.ProductCode}
                  className={inputCn(!!errors.ProductCode)}
                  {...register("ProductCode")}
                />
              </Field>
            )}

            <Field label="Product Name" error={errors.ProductName?.message}>
              <input
                type="text"
                autoFocus={isEdit}
                placeholder="e.g. Napa Tablet"
                aria-invalid={!!errors.ProductName}
                className={inputCn(!!errors.ProductName)}
                {...register("ProductName")}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Category" error={errors.CategoryCode?.message}>
                <select
                  aria-invalid={!!errors.CategoryCode}
                  className={inputCn(!!errors.CategoryCode)}
                  {...register("CategoryCode")}
                >
                  <option value="">Select category</option>
                  {(categoriesQuery.data ?? []).map((c) => (
                    <option key={c.CategoryCode} value={String(c.CategoryCode)}>
                      {c.CategoryName}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Brand" error={errors.BrandCode?.message}>
                <select
                  aria-invalid={!!errors.BrandCode}
                  className={inputCn(!!errors.BrandCode)}
                  {...register("BrandCode")}
                >
                  <option value="">Select brand</option>
                  {(brandsQuery.data ?? []).map((b) => (
                    <option key={b.BrandCode} value={String(b.BrandCode)}>
                      {b.BrandName}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Trade Price" error={errors.TradePrice?.message}>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  aria-invalid={!!errors.TradePrice}
                  className={inputCn(!!errors.TradePrice)}
                  {...register("TradePrice")}
                />
              </Field>

              <Field label="MRP" error={errors.MRP?.message}>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  aria-invalid={!!errors.MRP}
                  className={inputCn(!!errors.MRP)}
                  {...register("MRP")}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Pack Size" error={errors.PackSize?.message}>
                <input
                  type="text"
                  placeholder="e.g. 10 pcs"
                  aria-invalid={!!errors.PackSize}
                  className={inputCn(!!errors.PackSize)}
                  {...register("PackSize")}
                />
              </Field>

              <Field label="Plant Code" error={errors.PlantCode?.message}>
                <input
                  type="text"
                  placeholder="e.g. P001"
                  aria-invalid={!!errors.PlantCode}
                  className={inputCn(!!errors.PlantCode)}
                  {...register("PlantCode")}
                />
              </Field>
            </div>

            {/* ── Image upload section ── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-700">
                  Images
                  {isEdit && newCount === 0 && (
                    <span className="text-gray-400 font-normal ml-1">
                      (upload new to replace existing)
                    </span>
                  )}
                  {newCount > 0 && (
                    <span className="ml-1.5 inline-flex items-center rounded-full bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600">
                      {newCount} new
                    </span>
                  )}
                </p>
                {images.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      newImages.forEach((img) => URL.revokeObjectURL(img.previewUrl))
                      setNewImages([])
                      setRemovedUrls(new Set(serverImages.map((img) => img.url)))
                    }}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Drop zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-5 cursor-pointer transition-colors",
                  isDragging
                    ? "border-indigo-400 bg-indigo-50"
                    : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/50"
                )}
              >
                <Upload className={cn("size-5", isDragging ? "text-indigo-500" : "text-gray-400")} />
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-600">
                    Drop images here or{" "}
                    <span className="text-indigo-600">click to browse</span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    PNG, JPG, WEBP, AVIF — multiple allowed
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.avif,.webp"
                onChange={handleFileInput}
                className="hidden"
              />

              {/* Preview grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative group aspect-square rounded-md overflow-hidden border border-gray-200 bg-gray-100"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.kind === "new" ? img.previewUrl : img.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {/* "new" badge */}
                      {img.kind === "new" && (
                        <span className="absolute bottom-1 left-1 rounded px-1 py-0.5 text-[9px] font-medium bg-indigo-600 text-white leading-none">
                          new
                        </span>
                      )}
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 size-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}

                  {/* Add more tile */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-md border-2 border-dashed border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-indigo-500"
                  >
                    <ImagePlus className="size-4" />
                    <span className="text-[10px] font-medium">Add</span>
                  </button>
                </div>
              )}
            </div>

            {/* ── Variants section ── */}
            <div>
              <p className="text-xs font-medium text-gray-700 mb-2">
                Variants
                {variants.length > 0 && (
                  <span className="ml-1.5 inline-flex items-center rounded-full bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600">
                    {variants.length} added
                  </span>
                )}
                <span className="ml-1 text-red-500">*</span>
              </p>

              {variants.length > 0 && (
                <div className="space-y-1.5 mb-2">
                  {variants.map((v, i) => (
                    <VariantCard
                      key={i}
                      variant={v}
                      onEdit={() =>
                        setVariantForm({
                          editIndex: i,
                          BarCode: v.BarCode,
                          SKU: v.SKU,
                          SellingPrice: String(v.SellingPrice),
                          attributes: v.attributes.map((a) => ({ ...a })),
                        })
                      }
                      onRemove={() => {
                        setVariants((prev) => prev.filter((_, idx) => idx !== i))
                        setVariantForm(emptyVariantForm())
                      }}
                    />
                  ))}
                </div>
              )}

              <VariantForm
                draft={variantForm}
                allAttributes={attributesQuery.data ?? []}
                onChange={setVariantForm}
                onSave={(saved) => {
                  setVariantError(null)
                  if (variantForm.editIndex !== null) {
                    setVariants((prev) =>
                      prev.map((x, i) => (i === variantForm.editIndex ? saved : x))
                    )
                  } else {
                    setVariants((prev) => [...prev, saved])
                  }
                  setVariantForm(emptyVariantForm())
                }}
                onCancel={() => setVariantForm(emptyVariantForm())}
              />

              {variantError && (
                <p className="mt-1.5 text-xs text-red-600">{variantError}</p>
              )}
            </div>

            {submitError && (
              <div className="rounded-md bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">
                {submitError}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 shrink-0">
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
      </div>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
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

function inputCn(hasError: boolean) {
  return cn(
    "w-full h-9 px-3 text-sm rounded-md border bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors",
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
      : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
  )
}

// ─── Variant components ───────────────────────────────────────────────────────
function VariantCard({
  variant,
  onEdit,
  onRemove,
}: {
  variant: VariantInput
  onEdit: () => void
  onRemove: () => void
}) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50/50 px-3 py-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-xs text-gray-700 font-medium">{variant.SKU}</span>
            <span className="text-xs text-gray-500">Barcode: {variant.BarCode}</span>
            <span className="text-xs font-medium text-gray-900">৳{variant.SellingPrice}</span>
          </div>
          {variant.attributes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {variant.attributes.map((a, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700"
                >
                  {a.Value}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

function VariantForm({
  draft,
  allAttributes,
  onChange,
  onSave,
  onCancel,
}: {
  draft: VariantFormState
  allAttributes: { AttributeId: number; Name: string }[]
  onChange: (state: VariantFormState) => void
  onSave: (variant: VariantInput) => void
  onCancel: () => void
}) {
  const [submitted, setSubmitted] = useState(false)

  const barCodeErr = draft.BarCode.trim() === "" ? "Required" : null
  const skuErr = draft.SKU.trim() === "" ? "Required" : null
  const priceErr =
    draft.SellingPrice === "" || isNaN(Number(draft.SellingPrice)) || Number(draft.SellingPrice) <= 0
      ? "Must be a positive number"
      : null

  const handleSave = () => {
    setSubmitted(true)
    if (barCodeErr || skuErr || priceErr) return
    const filled = draft.attributes.filter((a) => a.AttributeId > 0 && a.Value.trim() !== "")
    onSave({
      BarCode: draft.BarCode.trim(),
      SKU: draft.SKU.trim(),
      SellingPrice: Number(draft.SellingPrice),
      attributes: filled,
    })
  }

  const setAttr = (i: number, patch: Partial<VariantAttr>) =>
    onChange({
      ...draft,
      attributes: draft.attributes.map((a, idx) => (idx === i ? { ...a, ...patch } : a)),
    })

  const addAttr = () =>
    onChange({ ...draft, attributes: [...draft.attributes, { AttributeId: 0, Value: "" }] })

  const removeAttr = (i: number) =>
    onChange({ ...draft, attributes: draft.attributes.filter((_, idx) => idx !== i) })

  return (
    <div className="rounded-md border border-indigo-200 bg-indigo-50/30 p-3 space-y-3">
      <p className="text-xs font-medium text-gray-700">
        {draft.editIndex !== null ? "Edit variant" : "New variant"}
      </p>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-[10px] font-medium text-gray-600 mb-1">Barcode</label>
          <input
            type="text"
            value={draft.BarCode}
            onChange={(e) => onChange({ ...draft, BarCode: e.target.value })}
            placeholder="123456789"
            className={inputCn(submitted && !!barCodeErr)}
          />
          {submitted && barCodeErr && (
            <p className="mt-0.5 text-[10px] text-red-600">{barCodeErr}</p>
          )}
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-600 mb-1">SKU</label>
          <input
            type="text"
            value={draft.SKU}
            onChange={(e) => onChange({ ...draft, SKU: e.target.value })}
            placeholder="SHIRT-RED-M"
            className={inputCn(submitted && !!skuErr)}
          />
          {submitted && skuErr && (
            <p className="mt-0.5 text-[10px] text-red-600">{skuErr}</p>
          )}
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-600 mb-1">Selling Price</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={draft.SellingPrice}
            onChange={(e) => onChange({ ...draft, SellingPrice: e.target.value })}
            placeholder="0.00"
            className={inputCn(submitted && !!priceErr)}
          />
          {submitted && priceErr && (
            <p className="mt-0.5 text-[10px] text-red-600">{priceErr}</p>
          )}
        </div>
      </div>

      {/* Attributes */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-medium text-gray-600">Attributes</span>
          <button
            type="button"
            onClick={addAttr}
            className="text-[10px] text-indigo-600 hover:text-indigo-700 font-medium transition-colors inline-flex items-center gap-0.5"
          >
            <Plus className="size-2.5" />
            Add
          </button>
        </div>
        {draft.attributes.length === 0 ? (
          <p className="text-[10px] text-gray-400">No attributes added.</p>
        ) : (
          <div className="space-y-1.5">
            {draft.attributes.map((attr, i) => (
              <div key={i} className="flex items-center gap-2">
                <select
                  value={attr.AttributeId}
                  onChange={(e) => setAttr(i, { AttributeId: Number(e.target.value) })}
                  className="h-8 flex-1 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value={0}>Select attribute</option>
                  {allAttributes.map((a) => (
                    <option key={a.AttributeId} value={a.AttributeId}>
                      {a.Name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={attr.Value}
                  onChange={(e) => setAttr(i, { Value: e.target.value })}
                  placeholder="Value"
                  className="h-8 flex-1 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="button"
                  onClick={() => removeAttr(i)}
                  className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        {draft.editIndex !== null && (
          <button
            type="button"
            onClick={onCancel}
            className="h-7 px-3 rounded-md border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          className="h-7 px-3 rounded-md bg-indigo-600 text-xs font-medium text-white hover:bg-indigo-700 transition-colors inline-flex items-center gap-1"
        >
          {draft.editIndex === null && <Plus className="size-3" />}
          {draft.editIndex !== null ? "Update Variant" : "Add Variant"}
        </button>
      </div>
    </div>
  )
}

// ─── Confirm delete ───────────────────────────────────────────────────────────
function ConfirmDeleteDialog({
  product,
  isDeleting,
  error,
  onCancel,
  onConfirm,
}: {
  product: Product
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
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Delete product</h3>
        </div>
        <div className="px-5 py-4 space-y-3">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-900">{product.ProductName}</span>{" "}
            <span className="font-mono text-xs text-gray-400">({product.ProductCode})</span>?
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
