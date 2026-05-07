"use client"

import { useState } from "react"

const segments = [
  { label: "Groceries", value: 32, color: "#6366f1" },
  { label: "Beverages", value: 22, color: "#10b981" },
  { label: "Personal Care", value: 18, color: "#f59e0b" },
  { label: "Snacks", value: 16, color: "#ef4444" },
  { label: "Household", value: 12, color: "#8b5cf6" },
]

const total = segments.reduce((s, x) => s + x.value, 0)
const cx = 110
const cy = 110
const r = 78
const stroke = 22
const C = 2 * Math.PI * r

export function CategoryDonutChart() {
  const [hovered, setHovered] = useState<number | null>(null)

  let cumulative = 0
  const arcs = segments.map((s) => {
    const dash = (s.value / total) * C
    const offset = -((cumulative / total) * C)
    cumulative += s.value
    return { ...s, dash, offset }
  })

  const center = hovered !== null ? segments[hovered] : null

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Sales by Category</h3>
          <p className="text-xs text-gray-500 mt-0.5">Share of total revenue</p>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col items-center justify-between gap-5">
        <div className="relative">
          <svg viewBox="0 0 220 220" className="w-44 h-44">
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth={stroke}
            />
            {arcs.map((a, i) => {
              const isHovered = hovered === i
              const dimmed = hovered !== null && hovered !== i
              return (
                <circle
                  key={a.label}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={a.color}
                  strokeWidth={isHovered ? stroke + 4 : stroke}
                  strokeDasharray={`${a.dash} ${C - a.dash}`}
                  strokeDashoffset={a.offset}
                  strokeLinecap="butt"
                  transform={`rotate(-90 ${cx} ${cy})`}
                  opacity={dimmed ? 0.35 : 1}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    cursor: "pointer",
                    transition: "opacity 150ms ease, stroke-width 150ms ease",
                  }}
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {center ? (
              <>
                <span className="text-[10px] uppercase tracking-wide text-gray-500">
                  {center.label}
                </span>
                <span className="text-2xl font-semibold text-gray-900 tabular-nums">
                  {center.value}%
                </span>
              </>
            ) : (
              <>
                <span className="text-[10px] uppercase tracking-wide text-gray-500">
                  Total
                </span>
                <span className="text-2xl font-semibold text-gray-900 tabular-nums">
                  $48.2k
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5">5 categories</span>
              </>
            )}
          </div>
        </div>

        <ul className="w-full space-y-2">
          {segments.map((s, i) => (
            <li
              key={s.label}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="flex items-center justify-between text-xs cursor-pointer"
            >
              <span className="flex items-center gap-2 text-gray-700">
                <span
                  className="size-2.5 rounded-sm"
                  style={{ backgroundColor: s.color }}
                />
                {s.label}
              </span>
              <span className="font-medium text-gray-900 tabular-nums">
                {s.value}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
