export interface ReceiveListKeyParams {
  page: number
  limit: number
  startDate?: string
  endDate?: string
}

export const receiveKeys = {
  all: ["receives"] as const,
  list: (params: ReceiveListKeyParams) =>
    [...receiveKeys.all, "list", params] as const,
  detail: (id: string) => [...receiveKeys.all, "detail", id] as const,
  search: (keyword: string) => [...receiveKeys.all, "search", keyword] as const,
}
