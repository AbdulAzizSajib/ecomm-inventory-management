"use client"

import { useMemo, useState } from "react"

export interface DailySalesPoint {
  label: string
  value: number
}

interface Props {
  data: DailySalesPoint[]
  title?: string
  subtitle?: string
  seriesLabel?: string
  seriesColor?: string
  seriesHoverColor?: string
}

const W = 760
const H = 300
const padLeft = 44
const padRight = 16
const padTop = 24
const padBottom = 36
const chartW = W - padLeft - padRight
const chartH = H - padTop - padBottom

export function OrdersBarChart({
  data,
  title = "Sales Overview",
  subtitle,
  seriesLabel = "Sales",
  seriesColor = "#6366f1",
  seriesHoverColor = "#4338ca",
}: Props) {
  const [hovered, setHovered] = useState<number | null>(null)

  const { niceMax, yTicks, slotWidth, barWidth, total } = useMemo(() => {
    const max = data.length === 0 ? 0 : Math.max(...data.map((d) => d.value))
    const niceMax = Math.max(5, Math.ceil(max / 5) * 5)
    const slotWidth = data.length > 0 ? chartW / data.length : chartW
    const barWidth = slotWidth * 0.5
    const ticks = 4
    const yTicks = Array.from({ length: ticks + 1 }, (_, i) =>
      Math.round((niceMax / ticks) * i)
    )
    const total = data.reduce((s, d) => s + d.value, 0)
    return { niceMax, yTicks, slotWidth, barWidth, total }
  }, [data])

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {subtitle ?? (
              <>
                <span className="font-medium text-gray-900">
                  {total.toLocaleString()}
                </span>{" "}
                {seriesLabel.toLowerCase()} in period
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-gray-600">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: seriesColor }}
            />
            {seriesLabel}
          </span>
        </div>
      </div>
      <div className="p-5 flex-1">
        {data.length === 0 ? (
          <div className="h-full min-h-40 flex items-center justify-center text-xs text-gray-400">
            No sales data for this period.
          </div>
        ) : (
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
              const h = (d.value / niceMax) * chartH
              const x = slotX + (slotWidth - barWidth) / 2
              const y = padTop + chartH - h
              return (
                <g
                  key={`${d.label}-${i}`}
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
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={h}
                    rx="6"
                    fill={isHovered ? seriesHoverColor : seriesColor}
                    style={{ transition: "fill 150ms ease" }}
                  />
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
              if (!d) return null
              const cx = padLeft + slotWidth * hovered + slotWidth / 2
              const tw = 110
              const th = 44
              const topY = padTop + chartH - (d.value / niceMax) * chartH
              let ty = topY - th - 10
              if (ty < padTop + 4) ty = topY + 12
              let tx = cx - tw / 2
              if (tx < padLeft) tx = padLeft
              if (tx + tw > W - padRight) tx = W - padRight - tw
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
                    y={ty + 17}
                    fill="white"
                    fontSize="13"
                    fontWeight="600"
                  >
                    {d.value.toLocaleString()} {seriesLabel.toLowerCase()}
                  </text>
                  <text x={tx + 10} y={ty + 33} fill="#9ca3af" fontSize="10">
                    {d.label}
                  </text>
                </g>
              )
            })()}
          </svg>
        )}
      </div>
    </div>
  )
}
