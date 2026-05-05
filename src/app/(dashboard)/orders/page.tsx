import { StatusBadge, type BadgeStatus } from "@/components/dashboard/StatusBadge"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { Filter, Download } from "lucide-react"

const orders: {
  id: string
  customer: string
  email: string
  amount: string
  items: number
  status: BadgeStatus
  date: string
}[] = [
  { id: "#ORD-1052", customer: "Sarah Johnson",  email: "sarah@example.com",   amount: "$129.99", items: 2, status: "delivered",  date: "Apr 28, 2026" },
  { id: "#ORD-1051", customer: "Michael Chen",   email: "mchen@example.com",   amount: "$249.00", items: 1, status: "shipped",    date: "Apr 27, 2026" },
  { id: "#ORD-1050", customer: "Emma Davis",     email: "emma.d@example.com",  amount: "$89.95",  items: 3, status: "processing", date: "Apr 27, 2026" },
  { id: "#ORD-1049", customer: "James Wilson",   email: "jwilson@example.com", amount: "$64.50",  items: 1, status: "pending",    date: "Apr 26, 2026" },
  { id: "#ORD-1048", customer: "Lisa Brown",     email: "lisa.b@example.com",  amount: "$45.00",  items: 2, status: "cancelled",  date: "Apr 26, 2026" },
  { id: "#ORD-1047", customer: "David Lee",      email: "dlee@example.com",    amount: "$312.00", items: 4, status: "delivered",  date: "Apr 25, 2026" },
  { id: "#ORD-1046", customer: "Anna Kim",       email: "anna.k@example.com",  amount: "$78.50",  items: 2, status: "processing", date: "Apr 25, 2026" },
  { id: "#ORD-1045", customer: "Robert Taylor",  email: "rtaylor@example.com", amount: "$199.99", items: 1, status: "shipped",    date: "Apr 24, 2026" },
  { id: "#ORD-1044", customer: "Nina Patel",     email: "nina.p@example.com",  amount: "$56.00",  items: 2, status: "delivered",  date: "Apr 24, 2026" },
  { id: "#ORD-1043", customer: "Tom Garcia",     email: "tgarcia@example.com", amount: "$145.00", items: 3, status: "pending",    date: "Apr 23, 2026" },
]

export default function OrdersPage() {
  return (
    <div>
      <PageHeader
        title="Orders"
        description="Manage and track all customer orders"
        action={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="size-3.5" />
              Export
            </button>
            <button className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="size-3.5" />
              Filter
            </button>
          </div>
        }
      />

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Order ID</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">Items</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900">{order.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">{order.customer}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{order.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">{order.date}</td>
                  <td className="px-5 py-3.5 text-gray-600 hidden sm:table-cell">{order.items}</td>
                  <td className="px-5 py-3.5 font-medium text-gray-900 tabular-nums">{order.amount}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
          <p className="text-xs text-gray-500">Showing 10 of 1,284 orders</p>
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
