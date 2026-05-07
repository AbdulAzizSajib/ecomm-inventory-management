"use client"

import dynamic from "next/dynamic"
import { MapPin, ShoppingBag, Clock, Users, Truck } from "lucide-react"
import type { Place } from "./OrderLocationMapInner"

const place: Place = {
  name: "Aftab Nagar",
  area: "Dhaka, Bangladesh",
  lat: 23.7641281,
  lng: 90.4466991,
  orders: 524,
  color: "#6366f1",
}

const stats = [
  {
    label: "Orders today",
    value: "48",
    sub: "+12% vs yesterday",
    icon: <ShoppingBag className="size-4 text-indigo-600" />,
    iconBg: "bg-indigo-50",
  },
  {
    label: "Active customers",
    value: "312",
    sub: "in this area",
    icon: <Users className="size-4 text-emerald-600" />,
    iconBg: "bg-emerald-50",
  },
  {
    label: "Avg. delivery",
    value: "32 min",
    sub: "from order to door",
    icon: <Clock className="size-4 text-amber-600" />,
    iconBg: "bg-amber-50",
  },
  {
    label: "Out for delivery",
    value: "9",
    sub: "active runners",
    icon: <Truck className="size-4 text-blue-600" />,
    iconBg: "bg-blue-50",
  },
]

const MapInner = dynamic(() => import("./OrderLocationMapInner"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-50 text-xs text-gray-400">
      Loading map…
    </div>
  ),
})

export function OrderLocationMap() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            Service Area
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            <MapPin className="size-3 shrink-0" style={{ color: place.color }} />
            <span className="truncate">{place.name}, {place.area}</span>
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 shrink-0 ml-3">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          Live
        </span>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 min-h-105">
        <div className="flex-1 lg:rounded-bl-lg overflow-hidden min-h-80">
          <MapInner place={place} />
        </div>

        <div className="lg:w-64 border-t lg:border-t-0 lg:border-l border-gray-100 p-5 flex flex-col">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Area Snapshot
          </div>
          <ul className="space-y-3 flex-1">
            {stats.map((s) => (
              <li key={s.label} className="flex items-start gap-3">
                <div
                  className={`size-8 rounded-md flex items-center justify-center shrink-0 ${s.iconBg}`}
                >
                  {s.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className="text-sm font-semibold text-gray-900 tabular-nums">
                    {s.value}
                  </p>
                  <p className="text-[11px] text-gray-400">{s.sub}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Total orders</span>
            <span className="font-semibold text-gray-900 tabular-nums">
              {place.orders.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
