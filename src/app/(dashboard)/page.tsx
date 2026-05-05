import { StatCard } from "@/components/dashboard/StatCard"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "$48,295",
    change: "+12.5%",
    trend: "up" as const,
    icon: <DollarSign className="size-5 text-indigo-600" />,
    iconBg: "bg-indigo-50",
  },
  {
    title: "Total Orders",
    value: "1,284",
    change: "+8.2%",
    trend: "up" as const,
    icon: <ShoppingCart className="size-5 text-emerald-600" />,
    iconBg: "bg-emerald-50",
  },
  {
    title: "Active Users",
    value: "8,472",
    change: "+3.1%",
    trend: "up" as const,
    icon: <Users className="size-5 text-blue-600" />,
    iconBg: "bg-blue-50",
  },
  {
    title: "Avg. Order Value",
    value: "$37.62",
    change: "-2.4%",
    trend: "down" as const,
    icon: <TrendingUp className="size-5 text-amber-600" />,
    iconBg: "bg-amber-50",
  },
]

const recentOrders = [
  { id: "#ORD-1052", customer: "Sarah Johnson", product: "Wireless Headphones", amount: "$129.99", status: "delivered" as const, date: "Apr 28, 2026" },
  { id: "#ORD-1051", customer: "Michael Chen", product: "Smart Watch Pro", amount: "$249.00", status: "shipped" as const, date: "Apr 27, 2026" },
  { id: "#ORD-1050", customer: "Emma Davis", product: "Running Shoes", amount: "$89.95", status: "processing" as const, date: "Apr 27, 2026" },
  { id: "#ORD-1049", customer: "James Wilson", product: "Coffee Maker", amount: "$64.50", status: "pending" as const, date: "Apr 26, 2026" },
  { id: "#ORD-1048", customer: "Lisa Brown", product: "Yoga Mat", amount: "$45.00", status: "cancelled" as const, date: "Apr 26, 2026" },
]

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-900">Overview</h2>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Recent Orders</h3>
          <a href="/orders" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
            View all →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Order</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">Product</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900 text-sm">{order.id}</td>
                  <td className="px-5 py-3.5 text-gray-600 text-sm">{order.customer}</td>
                  <td className="px-5 py-3.5 text-gray-600 text-sm hidden md:table-cell">{order.product}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-sm hidden sm:table-cell">{order.date}</td>
                  <td className="px-5 py-3.5 font-medium text-gray-900 text-sm tabular-nums">{order.amount}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
