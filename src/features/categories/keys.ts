export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
  detail: (id: string | number) => [...categoryKeys.all, "detail", id] as const,
}
