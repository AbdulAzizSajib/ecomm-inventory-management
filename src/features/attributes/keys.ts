export const attributeKeys = {
  all: ["attributes"] as const,
  list: () => [...attributeKeys.all, "list"] as const,
  detail: (id: string | number) => [...attributeKeys.all, "detail", id] as const,
}
