export interface ReleaseListKeyParams {
  page: number
  limit: number
  startDate?: string
  endDate?: string
}

export const releaseKeys = {
  all: ["release"] as const,
  list: (params: ReleaseListKeyParams) =>
    [...releaseKeys.all, "list", params] as const,
  detail: (id: string) => [...releaseKeys.all, "detail", id] as const,
  notReleasedList: (page: number, limit: number, search: string) =>
    [...releaseKeys.all, "not-released", "list", page, limit, search] as const,
  notReleasedItems: (quarantineReceiveNo: string) =>
    [...releaseKeys.all, "not-released", "items", quarantineReceiveNo] as const,
}
