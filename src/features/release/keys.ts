export const releaseKeys = {
  all: ["release"] as const,
  notReleasedList: (page: number, limit: number, search: string) =>
    [...releaseKeys.all, "not-released", "list", page, limit, search] as const,
  notReleasedItems: (quarantineReceiveNo: string) =>
    [...releaseKeys.all, "not-released", "items", quarantineReceiveNo] as const,
}
