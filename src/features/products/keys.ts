import type { ProductListParams } from "./types"

export const productKeys = {
  all: ["products"] as const,
  list: (params: ProductListParams) =>
    [...productKeys.all, "list", params] as const,
  detail: (code: string) => [...productKeys.all, "detail", code] as const,
  variants: (code: string) => [...productKeys.all, "variants", code] as const,
}
