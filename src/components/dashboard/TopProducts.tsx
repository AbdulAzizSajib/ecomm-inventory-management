import { Package } from "lucide-react"

export interface TopProductItem {
  name: string
  qty: number
  revenue: number
}

interface Props {
  items: TopProductItem[]
}

const formatMoney = (n: number) =>
  n.toLocaleString(undefined, { maximumFractionDigits: 2 })

export function TopProducts({ items }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Top Products</h3>
          <p className="text-xs text-gray-500 mt-0.5">Best sellers this period</p>
        </div>
        <a
          href="/products"
          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          View all →
        </a>
      </div>
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 px-5 py-10">
          <div className="size-10 rounded-full bg-gray-50 flex items-center justify-center">
            <Package className="size-5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500">No sales recorded yet.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50 flex-1">
          {items.map((p, i) => (
            <li key={`${p.name}-${i}`} className="flex items-center gap-3 px-5 py-3">
              <span className="size-7 shrink-0 rounded-md bg-gray-50 text-gray-500 text-xs font-semibold flex items-center justify-center">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className="text-sm font-medium text-gray-900 line-clamp-2"
                  title={p.name}
                >
                  {p.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {p.qty} sold
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-gray-900 tabular-nums">
                  ৳{formatMoney(p.revenue)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
