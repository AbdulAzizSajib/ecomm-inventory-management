"use client"

import { useState } from "react"

const data = [
  { label: "Mon", value: 142 },
  { label: "Tue", value: 168 },
  { label: "Wed", value: 124 },
  { label: "Thu", value: 195 },
  { label: "Fri", value: 218 },
  { label: "Sat", value: 248 },
  { label: "Sun", value: 189 },
]

const W = 700
const H = 280
const padX = 40
const padY = 24
const padBottom = 36
const chartW = W - padX * 2
const chartH = H - padY - padBottom

const max = Math.max(...data.map((d) => d.value))
const niceMax = Math.ceil(max / 50) * 50
const slotWidth = chartW / data.length
const barWidth = slotWidth * 0.5

const ticks = 4
const yTicks = Array.from({ length: ticks + 1 }, (_, i) =>
  Math.round((niceMax / ticks) * i)
)

const total = data.reduce((s, d) => s + d.value, 0)

export function OrdersBarChart() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Orders Overview</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            <span className="font-medium text-gray-900">{total.toLocaleString()}</span> orders this week
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-gray-600">
            <span className="size-2 rounded-full bg-indigo-500" />
            Orders
          </span>
        </div>
      </div>
      <div className="p-5 flex-1">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {yTicks.map((tick) => {
            const y = padY + chartH - (tick / niceMax) * chartH
            return (
              <g key={tick}>
                <line
                  x1={padX}
                  x2={W - padX / 2}
                  y1={y}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={padX - 8}
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
            const h = (d.value / niceMax) * chartH
            const x = padX + slotWidth * i + (slotWidth - barWidth) / 2
            const y = padY + chartH - h
            const isHovered = hovered === i
            return (
              <g
                key={d.label}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              >
                <rect
                  x={padX + slotWidth * i}
                  y={padY}
                  width={slotWidth}
                  height={chartH}
                  fill="transparent"
                />
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={h}
                  rx="6"
                  fill={isHovered ? "#4338ca" : "#6366f1"}
                  style={{ transition: "fill 150ms ease" }}
                />
                <text
                  x={x + barWidth / 2}
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
            const h = (d.value / niceMax) * chartH
            const cx = padX + slotWidth * hovered + slotWidth / 2
            const ty = padY + chartH - h - 50
            const tw = 86
            const th = 40
            return (
              <g pointerEvents="none">
                <rect
                  x={cx - tw / 2}
                  y={ty}
                  width={tw}
                  height={th}
                  rx="6"
                  fill="#111827"
                />
                <text
                  x={cx}
                  y={ty + 17}
                  textAnchor="middle"
                  fill="white"
                  fontSize="13"
                  fontWeight="600"
                >
                  {d.value} orders
                </text>
                <text
                  x={cx}
                  y={ty + 32}
                  textAnchor="middle"
                  fill="#9ca3af"
                  fontSize="10"
                >
                  {d.label}
                </text>
              </g>
            )
          })()}
        </svg>
      </div>
    </div>
  )
}
