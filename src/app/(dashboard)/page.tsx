"use client"

import { useMemo } from "react"
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  CalendarClock,
  Clock,
} from "lucide-react"

import { StatCard } from "@/components/dashboard/StatCard"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { OrdersBarChart } from "@/components/dashboard/OrdersBarChart"
import { CategoryDonutChart } from "@/components/dashboard/CategoryDonutChart"
import { OrderLocationMap } from "@/components/dashboard/OrderLocationMap"
import { TopProducts } from "@/components/dashboard/TopProducts"
import { LowStockList } from "@/components/dashboard/LowStockList"
import { getApiErrorMessage } from "@/lib/api/client"
import { useDashboard } from "@/features/dashboard"
import { badgeForStatusName, colorForStatusName } from "@/features/orders"

const dateLabel = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

const fmtMoney = (n: number) =>
  n.toLocaleString(undefined, { maximumFractionDigits: 2 })

const compactMoney = (n: number) => {
  if (n >= 10_000_000) return `${(n / 10_000_000).toFixed(2)}Cr`
  if (n >= 100_000) return `${(n / 100_000).toFixed(2)}L`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toLocaleString()
}

export default function DashboardPage() {
  const dashQuery = useDashboard()
  const data = dashQuery.data
  const isLoading = dashQuery.isPending

  const salesData = useMemo(
    () =>
      (data?.salesChart ?? []).map((p) => ({
        label: dateLabel(p.date),
        value: p.sales,
      })),
    [data?.salesChart]
  )

  const statusSegments = useMemo(
    () =>
      (data?.orderStatus ?? []).map((s) => ({
        label: s.Status,
        value: s.total,
        color: colorForStatusName(s.Status),
      })),
    [data?.orderStatus]
  )

  const topProducts = useMemo(
    () =>
      (data?.topProducts ?? []).map((p) => ({
        name: p.ProductName,
        qty: p.qty,
        revenue: p.revenue,
      })),
    [data?.topProducts]
  )

  const lowStockItems = useMemo(
    () =>
      (data?.lowStock ?? []).map((p) => ({
        name: p.ProductName,
        stock: p.stock,
      })),
    [data?.lowStock]
  )

  const summary = data?.summary

  if (dashQuery.isError) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-900">Overview</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="rounded-md bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          {getApiErrorMessage(dashQuery.error, "Failed to load dashboard")}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-900">Overview</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard
          title="Monthly Sales"
          value={summary ? `৳${compactMoney(summary.MonthlySales)}` : "—"}
          hint="This month"
          icon={<DollarSign className="size-5 text-indigo-600" />}
          iconBg="bg-indigo-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Monthly Orders"
          value={summary ? summary.MonthlyOrders.toLocaleString() : "—"}
          hint="This month"
          icon={<ShoppingCart className="size-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Today Orders"
          value={summary ? summary.TodayOrders.toLocaleString() : "—"}
          hint="Today"
          icon={<CalendarClock className="size-5 text-sky-600" />}
          iconBg="bg-sky-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Pending Orders"
          value={summary ? summary.PendingOrders.toLocaleString() : "—"}
          hint="Awaiting action"
          icon={<Clock className="size-5 text-amber-600" />}
          iconBg="bg-amber-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Customers"
          value={summary ? summary.TotalCustomers.toLocaleString() : "—"}
          hint="Registered"
          icon={<Users className="size-5 text-blue-600" />}
          iconBg="bg-blue-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Products"
          value={summary ? summary.TotalProducts.toLocaleString() : "—"}
          hint="In catalog"
          icon={<Package className="size-5 text-violet-600" />}
          iconBg="bg-violet-50"
          isLoading={isLoading}
        />
      </div>

      {/* ── Sales chart + Order status donut ────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <div className="xl:col-span-2">
          <OrdersBarChart
            data={salesData}
            title="Daily Sales"
            seriesLabel="Orders"
            subtitle={
              isLoading
                ? "Loading…"
                : `${salesData.reduce((s, d) => s + d.value, 0).toLocaleString()} orders charted`
            }
          />
        </div>
        <div className="xl:col-span-1">
          <CategoryDonutChart
            segments={statusSegments}
            title="Order Status"
            subtitle="Distribution by current status"
            centerLabel="Total"
          />
        </div>
      </div>

      {/* ── Map + Top products ──────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <div className="xl:col-span-2">
          <OrderLocationMap />
        </div>
        <div className="xl:col-span-1">
          <TopProducts items={topProducts} />
        </div>
      </div>

      {/* ── Recent orders + Low stock ───────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Recent Orders</h3>
              <a
                href="/orders"
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                View all →
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Order</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Mobile</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">Date</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-5 py-3.5"><div className="h-3 w-28 bg-gray-200 rounded" /></td>
                        <td className="px-5 py-3.5"><div className="h-3 w-24 bg-gray-200 rounded" /></td>
                        <td className="px-5 py-3.5 hidden sm:table-cell"><div className="h-3 w-20 bg-gray-200 rounded" /></td>
                        <td className="px-5 py-3.5"><div className="h-3 w-16 bg-gray-200 rounded ml-auto" /></td>
                        <td className="px-5 py-3.5"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
                      </tr>
                    ))
                  ) : (data?.recentOrders ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-500">
                        No recent orders.
                      </td>
                    </tr>
                  ) : (
                    (data?.recentOrders ?? []).map((order) => (
                      <tr key={order.IssueNo} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-gray-900 font-mono text-xs">
                          {order.IssueNo}
                        </td>
                        <td className="px-5 py-3.5 text-gray-700">{order.Mobile}</td>
                        <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">
                          {longDate(order.IssueDate)}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-gray-900 tabular-nums text-right">
                          ৳{fmtMoney(order.NetAmount)}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={badgeForStatusName(order.Status)} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="xl:col-span-1">
          <LowStockList items={lowStockItems} />
        </div>
      </div>
    </div>
  )
}
