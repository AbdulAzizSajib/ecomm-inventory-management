export const receiveKeys = {
  all: ["receives"] as const,
  list: (page: number, limit: number) =>
    [...receiveKeys.all, "list", page, limit] as const,
  detail: (id: string) => [...receiveKeys.all, "detail", id] as const,
  search: (keyword: string) => [...receiveKeys.all, "search", keyword] as const,
}
