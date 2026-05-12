"use client"

import { useState } from "react"

type Day = {
  label: string
  total: number
  confirmed: number
  delivered: number
}

const data: Day[] = [
  { label: "Mon", total: 142, confirmed: 128, delivered: 116 },
  { label: "Tue", total: 168, confirmed: 154, delivered: 138 },
  { label: "Wed", total: 124, confirmed: 110, delivered: 96  },
  { label: "Thu", total: 195, confirmed: 178, delivered: 162 },
  { label: "Fri", total: 218, confirmed: 198, delivered: 174 },
  { label: "Sat", total: 248, confirmed: 224, delivered: 196 },
  { label: "Sun", total: 189, confirmed: 168, delivered: 142 },
]

const series = [
  { key: "total"     as const, label: "Total Orders",     color: "#6366f1", hover: "#4338ca" },
  { key: "confirmed" as const, label: "Confirmed",        color: "#10b981", hover: "#047857" },
  { key: "delivered" as const, label: "Delivered",        color: "#f59e0b", hover: "#b45309" },
]

const W = 760
const H = 300
const padLeft = 44
const padRight = 16
const padTop = 24
const padBottom = 36
const chartW = W - padLeft - padRight
const chartH = H - padTop - padBottom

const max = Math.max(...data.map((d) => Math.max(d.total, d.confirmed, d.delivered)))
const niceMax = Math.ceil(max / 50) * 50
const slotWidth = chartW / data.length
const groupWidth = slotWidth * 0.78
const barGap = 3
const barWidth = (groupWidth - barGap * (series.length - 1)) / series.length

const ticks = 4
const yTicks = Array.from({ length: ticks + 1 }, (_, i) =>
  Math.round((niceMax / ticks) * i)
)

const totalOrders = data.reduce((s, d) => s + d.total, 0)

export function OrdersBarChart() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">Orders Overview</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            <span className="font-medium text-gray-900">
              {totalOrders.toLocaleString()}
            </span>{" "}
            orders this week
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs flex-wrap justify-end">
          {series.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5 text-gray-600">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              {s.label}
            </span>
          ))}
        </div>
      </div>
      <div className="p-5 flex-1">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {yTicks.map((tick) => {
            const y = padTop + chartH - (tick / niceMax) * chartH
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  x2={W - padRight}
                  y1={y}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="#9ca3af"
                  fontSize="11"
                >
                  {tick}
                </text>
              </g>
            )
          })}

          {data.map((d, i) => {
            const isHovered = hovered === i
            const slotX = padLeft + slotWidth * i
            const groupX = slotX + (slotWidth - groupWidth) / 2
            return (
              <g
                key={d.label}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              >
                <rect
                  x={slotX}
                  y={padTop}
                  width={slotWidth}
                  height={chartH}
                  fill="transparent"
                />
                {series.map((s, j) => {
                  const value = d[s.key]
                  const h = (value / niceMax) * chartH
                  const x = groupX + j * (barWidth + barGap)
                  const y = padTop + chartH - h
                  return (
                    <rect
                      key={s.key}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={h}
                      rx="4"
                      fill={isHovered ? s.hover : s.color}
                      style={{ transition: "fill 150ms ease" }}
                    />
                  )
                })}
                <text
                  x={slotX + slotWidth / 2}
                  y={H - 12}
                  textAnchor="middle"
                  fill="#6b7280"
                  fontSize="11"
                  fontWeight={isHovered ? 600 : 400}
                >
                  {d.label}
                </text>
              </g>
            )
          })}

          {hovered !== null && (() => {
            const d = data[hovered]
            const tallest = Math.max(d.total, d.confirmed, d.delivered)
            const cx = padLeft + slotWidth * hovered + slotWidth / 2
            const tw = 132
            const th = 76
            const topY = padTop + chartH - (tallest / niceMax) * chartH
            let ty = topY - th - 10
            if (ty < padTop + 4) ty = topY + 12
            let tx = cx - tw / 2
            if (tx < padLeft) tx = padLeft
            if (tx + tw > W - padRight) tx = W - padRight - tw
            const lineH = 14
            return (
              <g pointerEvents="none">
                <rect
                  x={tx}
                  y={ty}
                  width={tw}
                  height={th}
                  rx="6"
                  fill="#111827"
                />
                <text
                  x={tx + 10}
                  y={ty + 16}
                  fill="#9ca3af"
                  fontSize="10"
                  fontWeight="500"
                  style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
                >
                  {d.label}
                </text>
                {series.map((s, j) => (
                  <g key={s.key} transform={`translate(${tx + 10}, ${ty + 30 + j * lineH})`}>
                    <rect width="8" height="8" rx="2" y="-7" fill={s.color} />
                    <text x="14" y="0" fill="#e5e7eb" fontSize="11">
                      {s.label}
                    </text>
                    <text
                      x={tw - 20}
                      y="0"
                      textAnchor="end"
                      fill="white"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {d[s.key]}
                    </text>
                  </g>
                ))}
              </g>
            )
          })()}
        </svg>
      </div>
    </div>
  )
}
