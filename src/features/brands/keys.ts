export const brandKeys = {
  all: ["brands"] as const,
  list: () => [...brandKeys.all, "list"] as const,
  detail: (id: number | string) => [...brandKeys.all, "detail", id] as const,
}
