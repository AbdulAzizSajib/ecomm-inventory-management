export const bannerKeys = {
  all: ["banners"] as const,
  list: () => [...bannerKeys.all, "list"] as const,
  detail: (id: number | string) => [...bannerKeys.all, "detail", id] as const,
}
