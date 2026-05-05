import { StatusBadge, type BadgeStatus } from "@/components/dashboard/StatusBadge"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { cn } from "@/lib/utils"
import { AlertTriangle, Package, TrendingDown, RefreshCw } from "lucide-react"

const inventory: {
  id: string
  name: string
  sku: string
  category: string
  inStock: number
  reserved: number
  reorderAt: number
  status: BadgeStatus
}[] = [
  { id: "PRD-001", name: "Wireless Headphones",      sku: "WH-NC-001",  category: "Electronics", inStock: 142, reserved: 18, reorderAt: 20,  status: "in_stock"     },
  { id: "PRD-002", name: "Smart Watch Pro",           sku: "SW-PRO-004", category: "Electronics", inStock: 8,   reserved: 3,  reorderAt: 15,  status: "low_stock"    },
  { id: "PRD-003", name: "Premium Yoga Mat",          sku: "YM-PRE-010", category: "Sports",      inStock: 0,   reserved: 0,  reorderAt: 10,  status: "out_of_stock" },
  { id: "PRD-004", name: "Steel Water Bottle",        sku: "WB-ST-002",  category: "Home",        inStock: 320, reserved: 45, reorderAt: 30,  status: "in_stock"     },
  { id: "PRD-005", name: "Organic Green Tea 100g",    sku: "GT-ORG-005", category: "Food",        inStock: 55,  reserved: 10, reorderAt: 25,  status: "in_stock"     },
  { id: "PRD-006", name: "Ergonomic Office Chair",    sku: "OC-ERG-003", category: "Furniture",   inStock: 12,  reserved: 4,  reorderAt: 15,  status: "low_stock"    },
  { id: "PRD-007", name: "Wireless Charging Pad",     sku: "CP-WL-007",  category: "Electronics", inStock: 200, reserved: 22, reorderAt: 30,  status: "in_stock"     },
  { id: "PRD-008", name: "Running Shoes Men's",       sku: "RS-MN-008",  category: "Footwear",    inStock: 0,   reserved: 5,  reorderAt: 20,  status: "out_of_stock" },
  { id: "PRD-009", name: "Coffee Maker Deluxe",       sku: "CM-DLX-009", category: "Appliances",  inStock: 34,  reserved: 8,  reorderAt: 10,  status: "in_stock"     },
  { id: "PRD-010", name: "Bamboo Cutting Board",      sku: "CB-BM-010",  category: "Kitchen",     inStock: 9,   reserved: 2,  reorderAt: 12,  status: "low_stock"    },
]

const summaryCards = [
  { label: "Total SKUs",        value: "256",  icon: Package,       color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Low Stock Items",   value: "14",   icon: AlertTriangle, color: "text-amber-600",  bg: "bg-amber-50"  },
  { label: "Out of Stock",      value: "6",    icon: TrendingDown,  color: "text-red-600",    bg: "bg-red-50"    },
  { label: "Reorder Pending",   value: "8",    icon: RefreshCw,     color: "text-blue-600",   bg: "bg-blue-50"   },
]

function StockBar({ inStock, reorderAt }: { inStock: number; reorderAt: number }) {
  const max = Math.max(inStock, reorderAt * 5, 1)
  const pct = Math.min((inStock / max) * 100, 100)
  const isLow = inStock <= reorderAt && inStock > 0
  const isOut = inStock === 0
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 max-w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isOut ? "bg-red-400" : isLow ? "bg-amber-400" : "bg-emerald-400"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-gray-600 w-6 text-right">{inStock}</span>
    </div>
  )
}

export default function InventoryPage() {
  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Monitor stock levels and manage reorders"
        action={
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <RefreshCw className="size-3.5" />
            Sync Stock
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-500">{label}</p>
              <div className={cn("size-7 rounded-md flex items-center justify-center", bg)}>
                <Icon className={cn("size-3.5", color)} />
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-900 tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">SKU</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Category</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Stock</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">Reserved</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">Reorder At</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.id}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 font-mono text-xs hidden md:table-cell">{item.sku}</td>
                  <td className="px-5 py-3.5 text-gray-600 hidden lg:table-cell">{item.category}</td>
                  <td className="px-5 py-3.5">
                    <StockBar inStock={item.inStock} reorderAt={item.reorderAt} />
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 tabular-nums hidden sm:table-cell">{item.reserved}</td>
                  <td className="px-5 py-3.5 text-gray-600 tabular-nums hidden sm:table-cell">{item.reorderAt}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={item.status} /></td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                      Reorder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
          <p className="text-xs text-gray-500">Showing 10 of 256 items</p>
          <div className="flex items-center gap-1">
            <button className="h-7 px-3 rounded-md border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors" disabled>
              Previous
            </button>
            <button className="h-7 px-3 rounded-md border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
