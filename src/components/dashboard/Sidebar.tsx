"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Boxes,
  CreditCard,
  Tag,
  ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Factory,
  type LucideIcon,
  Settings,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuthStore, useLogout } from "@/features/auth"

interface NavChild {
  label: string
  href: string
}

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  children?: NavChild[]
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    label: "Products",
    href: "/products",
    icon: Package,
    children: [
      { label: "Attributes", href: "/products/attribute" },
      { label: "Categories", href: "/products/categories" },
      { label: "Brands", href: "/products/brands" },
      { label: "All Products", href: "/products" },
    ],
  },

  // { label: "Customers", href: "/customers", icon: Users },
  { label: "Inventory",
    href: "/inventory",
    icon: Boxes,
    children: [
        { label: "Supplier", href: "/inventory/suppliers"},
      { label: "Receive", href: "/inventory/receive" },
      { label: "QC", href: "/inventory/qc" },
      { label: "Release", href: "/inventory/release" },
    ],

   },

  { label: "Orders", href: "/orders", icon: ShoppingCart },

  // { label: "Payments", href: "/payments", icon: CreditCard },
  // { label: "Coupons", href: "/coupons", icon: Tag },
  // { label: "Banners", href: "/banners", icon: ImageIcon },
  // { label: "Plant", href: "/plant", icon: Factory },
  {
    label: "Report",
    href: "/report",
    icon: BarChart3,
    children: [
      { label: "Stock Statement", href: "/report/stock-statement" },
      { label: "Current Stock", href: "/report/current-stock" },
    ],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    children: [
      { label: "Banners", href: "/settings/banners" },
      { label: "Plant", href: "/settings/plant" },
    ],
  },


]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

function isPathActive(pathname: string, href: string, hasChildren: boolean): boolean {
  if (hasChildren) {
    return pathname === href || pathname.startsWith(`${href}/`)
  }
  return pathname === href
}

export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const initial = user?.UserName?.[0]?.toUpperCase() ?? "A"

  const [overrides, setOverrides] = useState<Record<string, boolean>>({})

  const isGroupOpen = (item: NavItem) => {
    if (item.href in overrides) return overrides[item.href]
    return isPathActive(pathname, item.href, true)
  }

  const toggle = (item: NavItem) =>
    setOverrides((prev) => ({ ...prev, [item.href]: !isGroupOpen(item) }))

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-slate-900 flex flex-col transition-all duration-200 ease-in-out",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-14 items-center justify-between px-3 border-b border-slate-800 shrink-0">
        <div className={cn("flex items-center gap-2.5 overflow-hidden", isCollapsed && "justify-center w-full")}>
          {/* <div className="size-6 rounded bg-indigo-500 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">EIM</span>
          </div> */}
          {!isCollapsed && (
            <span className="text-white text-center font-semibold tracking-tight text-[13px] truncate">Ecomm Inventory Management</span>
          )}
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded text-slate-400 hover:text-white transition-colors shrink-0"
        >
          <X className="size-4" />
        </button>
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1 rounded text-slate-400 hover:text-white transition-colors shrink-0"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon, children }) => {
          const hasChildren = !!children?.length
          const isActive = isPathActive(pathname, href, hasChildren)
          const item: NavItem = { label, href, icon: Icon, children }
          const isOpenGroup = !isCollapsed && hasChildren && isGroupOpen(item)

          if (hasChildren && !isCollapsed) {
            return (
              <div key={href}>
                <button
                  type="button"
                  onClick={() => toggle(item)}
                  aria-expanded={isOpenGroup}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="flex-1 text-left">{label}</span>
                  <ChevronDown
                    className={cn(
                      "size-3.5 shrink-0 transition-transform duration-150",
                      isOpenGroup ? "rotate-0" : "-rotate-90"
                    )}
                  />
                </button>
                {isOpenGroup && (
                  <div className="mt-0.5 ml-4 pl-3 border-l border-slate-800 space-y-0.5">
                    {children.map((child) => {
                      const isChildActive = pathname === child.href
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={cn(
                            "block rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                            isChildActive
                              ? "bg-slate-800 text-white"
                              : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                          )}
                        >
                          {child.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              title={isCollapsed ? label : undefined}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isCollapsed ? "justify-center gap-0" : "gap-3",
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!isCollapsed && label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-slate-800 shrink-0 space-y-1">
        <div className={cn("flex items-center px-2 py-1.5", isCollapsed ? "justify-center" : "gap-3")}>
          <div className="size-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {initial}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{user?.UserName ?? "—"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email ?? ""}</p>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          title={isCollapsed ? "Sign out" : undefined}
          className={cn(
            "w-full flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-colors",
            isCollapsed ? "justify-center gap-0" : "gap-3"
          )}
        >
          <LogOut className="size-4 shrink-0" />
          {!isCollapsed && "Sign out"}
        </button>
      </div>
    </aside>
  )
}
