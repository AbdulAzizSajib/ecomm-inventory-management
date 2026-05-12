import { TrendingUp, TrendingDown } from "lucide-react"

const products = [
  { name: "Wireless Headphones", category: "Electronics", units: 248, revenue: "৳32,224", trend: "up" as const, change: "+18%" },
  { name: "Smart Watch Pro",     category: "Electronics", units: 192, revenue: "৳28,608", trend: "up" as const, change: "+12%" },
  { name: "Organic Tea Pack",    category: "Beverages",   units: 184, revenue: "৳5,520",  trend: "up" as const, change: "+9%" },
  { name: "Running Shoes",       category: "Apparel",     units: 156, revenue: "৳14,040", trend: "down" as const, change: "-4%" },
  { name: "Yoga Mat",            category: "Fitness",     units: 132, revenue: "৳5,940",  trend: "up" as const, change: "+6%" },
]

export function TopProducts() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Top Products</h3>
          <p className="text-xs text-gray-500 mt-0.5">Best sellers this week</p>
        </div>
        <a
          href="/products"
          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          View all →
        </a>
      </div>
      <ul className="divide-y divide-gray-50 flex-1">
        {products.map((p, i) => (
          <li key={p.name} className="flex items-center gap-3 px-5 py-3">
            <span className="size-7 shrink-0 rounded-md bg-gray-50 text-gray-500 text-xs font-semibold flex items-center justify-center">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
              <p className="text-xs text-gray-500">
                {p.category} · {p.units} sold
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-gray-900 tabular-nums">{p.revenue}</p>
              <p
                className={`flex items-center justify-end gap-0.5 text-xs font-medium ${
                  p.trend === "up" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {p.trend === "up" ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {p.change}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
