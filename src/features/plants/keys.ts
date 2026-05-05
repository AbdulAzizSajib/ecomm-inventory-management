export const plantKeys = {
  all: ["plants"] as const,
  list: () => [...plantKeys.all, "list"] as const,
  detail: (code: string) => [...plantKeys.all, "detail", code] as const,
}
