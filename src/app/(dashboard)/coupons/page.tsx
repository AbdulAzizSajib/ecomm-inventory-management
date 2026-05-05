import { StatusBadge, type BadgeStatus } from "@/components/dashboard/StatusBadge"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { Plus, Copy } from "lucide-react"

const coupons: {
  code: string
  type: "percentage" | "fixed"
  value: string
  minOrder: string
  used: number
  limit: number
  status: BadgeStatus
  expires: string
}[] = [
  { code: "SUMMER25",   type: "percentage", value: "25% off",  minOrder: "$50",  used: 234, limit: 500,  status: "active",   expires: "Jun 30, 2026" },
  { code: "WELCOME10",  type: "percentage", value: "10% off",  minOrder: "$0",   used: 891, limit: 1000, status: "active",   expires: "Dec 31, 2026" },
  { code: "SAVE15",     type: "fixed",      value: "$15 off",  minOrder: "$75",  used: 500, limit: 500,  status: "inactive", expires: "May 1, 2026"  },
  { code: "FLASH50",    type: "percentage", value: "50% off",  minOrder: "$100", used: 150, limit: 150,  status: "expired",  expires: "Apr 1, 2026"  },
  { code: "FREESHIP",   type: "fixed",      value: "$10 off",  minOrder: "$30",  used: 412, limit: 800,  status: "active",   expires: "Jul 15, 2026" },
  { code: "VIP20",      type: "percentage", value: "20% off",  minOrder: "$200", used: 88,  limit: 200,  status: "active",   expires: "Sep 30, 2026" },
  { code: "BIRTHDAY",   type: "percentage", value: "15% off",  minOrder: "$0",   used: 67,  limit: 999,  status: "active",   expires: "Dec 31, 2026" },
  { code: "CLEARANCE",  type: "fixed",      value: "$25 off",  minOrder: "$150", used: 200, limit: 200,  status: "expired",  expires: "Mar 15, 2026" },
]

export default function CouponsPage() {
  return (
    <div>
      <PageHeader
        title="Coupons"
        description="Create and manage discount coupons"
        action={
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
            <Plus className="size-3.5" />
            Create Coupon
          </button>
        }
      />

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Code</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">Discount</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Min. Order</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Usage</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Expires</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.map((coupon) => {
                const usagePct = Math.round((coupon.used / coupon.limit) * 100)
                return (
                  <tr key={coupon.code} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs font-mono font-semibold">
                          {coupon.code}
                        </code>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors" title="Copy code">
                          <Copy className="size-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="font-medium text-gray-900">{coupon.value}</span>
                      <span className="ml-1.5 text-xs text-gray-400">{coupon.type === "percentage" ? "%" : "fixed"}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 hidden md:table-cell">{coupon.minOrder}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-indigo-400"
                            style={{ width: `${usagePct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 tabular-nums">{coupon.used}/{coupon.limit}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">{coupon.expires}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={coupon.status} /></td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">Edit</button>
                        <button className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
          <p className="text-xs text-gray-500">Showing 8 of 8 coupons</p>
          <div className="flex items-center gap-1">
            <button className="h-7 px-3 rounded-md border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors" disabled>
              Previous
            </button>
            <button className="h-7 px-3 rounded-md border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
