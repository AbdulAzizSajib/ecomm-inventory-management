import type { CurrentStockParams, StockStatementParams } from "./types"

export const stockKeys = {
  all: ["stock"] as const,
  statement: (params: StockStatementParams) =>
    [...stockKeys.all, "statement", params] as const,
  current: (params: CurrentStockParams) =>
    [...stockKeys.all, "current", params] as const,
}
