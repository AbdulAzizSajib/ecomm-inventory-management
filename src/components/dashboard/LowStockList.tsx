import { AlertTriangle, PackageCheck } from "lucide-react"

export interface LowStockEntry {
  name: string
  stock: number
}

interface Props {
  items: LowStockEntry[]
  threshold?: number
}

export function LowStockList({ items, threshold = 10 }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Low Stock</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Below {threshold} units
          </p>
        </div>
        <a
          href="/report/current-stock"
          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          View stock →
        </a>
      </div>
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 px-5 py-10">
          <div className="size-10 rounded-full bg-emerald-50 flex items-center justify-center">
            <PackageCheck className="size-5 text-emerald-600" />
          </div>
          <p className="text-xs text-gray-500">All products well-stocked.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50 flex-1">
          {items.map((p, i) => {
            const critical = p.stock <= Math.max(1, Math.floor(threshold / 2))
            return (
              <li key={`${p.name}-${i}`} className="flex items-center gap-3 px-5 py-3">
                <span
                  className={
                    critical
                      ? "size-7 shrink-0 rounded-md flex items-center justify-center bg-red-50 text-red-600"
                      : "size-7 shrink-0 rounded-md flex items-center justify-center bg-amber-50 text-amber-600"
                  }
                >
                  <AlertTriangle className="size-3.5" />
                </span>
                <p
                  className="text-sm font-medium text-gray-900 line-clamp-2 flex-1 min-w-0"
                  title={p.name}
                >
                  {p.name}
                </p>
                <span
                  className={
                    critical
                      ? "text-sm font-semibold tabular-nums text-red-700"
                      : "text-sm font-semibold tabular-nums text-amber-700"
                  }
                >
                  {p.stock}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
