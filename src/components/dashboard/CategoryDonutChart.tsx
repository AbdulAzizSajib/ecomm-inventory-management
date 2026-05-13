"use client"

import { useMemo, useState } from "react"

export interface DonutSegment {
  label: string
  value: number
  color: string
}

interface Props {
  segments: DonutSegment[]
  title?: string
  subtitle?: string
  centerLabel?: string
  centerValue?: string
  centerSubtitle?: string
  formatValue?: (v: number) => string
}

const cx = 140
const cy = 140
const r = 108
const stroke = 30
const C = 2 * Math.PI * r

export function CategoryDonutChart({
  segments,
  title = "Distribution",
  subtitle,
  centerLabel,
  centerValue,
  centerSubtitle,
  formatValue,
}: Props) {
  const [hovered, setHovered] = useState<number | null>(null)

  const total = useMemo(
    () => segments.reduce((s, x) => s + x.value, 0),
    [segments]
  )

  const arcs = useMemo(() => {
    if (total === 0) return []
    return segments.map((s, i) => {
      const before = segments
        .slice(0, i)
        .reduce((sum, x) => sum + x.value, 0)
      return {
        ...s,
        dash: (s.value / total) * C,
        offset: -((before / total) * C),
      }
    })
  }, [segments, total])

  const centerActive = hovered !== null ? segments[hovered] : null
  const formatV = formatValue ?? ((v: number) => v.toLocaleString())

  const defaultCenterValue =
    centerValue ?? (total === 0 ? "0" : total.toLocaleString())
  const defaultCenterLabel = centerLabel ?? "Total"
  const defaultSubtitle =
    centerSubtitle ?? `${segments.length} ${segments.length === 1 ? "item" : "items"}`

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col items-center justify-between gap-6">
        <div className="relative w-full max-w-70 aspect-square">
          <svg viewBox="0 0 280 280" className="w-full h-full">
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
                  key={`${a.label}-${i}`}
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
            {centerActive ? (
              <>
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  {centerActive.label}
                </span>
                <span className="text-3xl font-semibold text-gray-900 tabular-nums mt-1">
                  {formatV(centerActive.value)}
                </span>
                {total > 0 && (
                  <span className="text-xs text-gray-500 mt-1">
                    {((centerActive.value / total) * 100).toFixed(1)}%
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  {defaultCenterLabel}
                </span>
                <span className="text-3xl font-semibold text-gray-900 tabular-nums mt-1">
                  {defaultCenterValue}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {defaultSubtitle}
                </span>
              </>
            )}
          </div>
        </div>

        {segments.length > 0 ? (
          <ul className="w-full space-y-2">
            {segments.map((s, i) => (
              <li
                key={`${s.label}-${i}`}
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
                  {formatV(s.value)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-400">No data to display.</p>
        )}
      </div>
    </div>
  )
}
