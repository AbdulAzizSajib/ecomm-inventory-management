export const supplierKeys = {
  all: ["suppliers"] as const,
  list: () => [...supplierKeys.all, "list"] as const,
  detail: (id: string) => [...supplierKeys.all, "detail", id] as const,
}
