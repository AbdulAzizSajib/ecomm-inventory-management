"use client"

import { usePathname } from "next/navigation"
import { Bell, Search, Menu } from "lucide-react"

import { useAuthStore } from "@/features/auth"

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/orders": "Orders",
  "/products": "Products",
  "/products/categories": "Categories",
  "/products/brands": "Brands",
  "/inventory": "Inventory",
  "/customers": "Customers",
  "/payments": "Payments",
  "/coupons": "Coupons",
  "/banners": "Banners",
}

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname()
  const title = pageTitles[pathname] ?? "Admin"
  const user = useAuthStore((s) => s.user)
  const initial = user?.UserName?.[0]?.toUpperCase() ?? "A"

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-gray-200 bg-white flex items-center gap-3 px-4 lg:px-6 shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label="Open sidebar"
      >
        <Menu className="size-5" />
      </button>

      <h1 className="text-sm font-semibold text-gray-900 flex-1">{title}</h1>

      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-8 w-44 rounded-md border border-gray-200 bg-gray-50 pl-8 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
          />
        </div>

        <button
          className="relative size-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-red-500" />
        </button>

        <div
          title={user?.UserName ?? ""}
          className="size-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold cursor-pointer select-none"
        >
          {initial}
        </div>
      </div>
    </header>
  )
}
