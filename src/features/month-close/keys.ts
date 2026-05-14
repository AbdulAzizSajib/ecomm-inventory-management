export const monthCloseKeys = {
  all: ["month-close"] as const,
  period: (plantCode: string) =>
    [...monthCloseKeys.all, "period", plantCode] as const,
}
