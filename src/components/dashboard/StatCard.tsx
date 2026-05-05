import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
  iconBg?: string
}

export function StatCard({ title, value, change, trend, icon, iconBg = "bg-gray-50" }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 tabular-nums">{value}</p>
          <div
            className={cn(
              "flex items-center gap-1 mt-1.5 text-xs font-medium",
              trend === "up" ? "text-emerald-600" : "text-red-600"
            )}
          >
            {trend === "up" ? (
              <TrendingUp className="size-3 shrink-0" />
            ) : (
              <TrendingDown className="size-3 shrink-0" />
            )}
            <span>{change} vs last month</span>
          </div>
        </div>
        <div className={cn("size-10 rounded-lg flex items-center justify-center shrink-0 ml-3", iconBg)}>
          {icon}
        </div>
      </div>
    </div>
  )
}
