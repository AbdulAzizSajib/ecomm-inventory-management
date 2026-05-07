"use client"

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export type Place = {
  name: string
  area: string
  lat: number
  lng: number
  orders: number
  color: string
}

const ICON_SIZE = 22
const RING_SIZE = ICON_SIZE * 2.4

function makeIcon(p: Place) {
  return L.divIcon({
    className: "",
    html: `
      <div class="hm-pulse" style="--c:${p.color}; --s:${ICON_SIZE}px; --r:${RING_SIZE}px;">
        <span class="hm-pulse-ring"></span>
        <span class="hm-pulse-dot"></span>
      </div>
    `,
    iconSize: [RING_SIZE, RING_SIZE],
    iconAnchor: [RING_SIZE / 2, RING_SIZE / 2],
    popupAnchor: [0, -ICON_SIZE / 2],
  })
}

interface Props {
  place: Place
  zoom?: number
  radiusMeters?: number
}

export default function OrderLocationMapInner({
  place,
  zoom = 15,
  radiusMeters = 600,
}: Props) {
  return (
    <MapContainer
      center={[place.lat, place.lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Circle
        center={[place.lat, place.lng]}
        radius={radiusMeters}
        pathOptions={{
          color: place.color,
          weight: 1.5,
          fillColor: place.color,
          fillOpacity: 0.08,
        }}
      />
      <Marker position={[place.lat, place.lng]} icon={makeIcon(place)}>
        <Popup closeButton={false}>
          <div style={{ minWidth: 140 }}>
            <div style={{ fontWeight: 600, color: "#111827", fontSize: 13 }}>
              {place.name}
            </div>
            <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>
              {place.area}
            </div>
            <div
              style={{
                color: "#111827",
                fontSize: 12,
                marginTop: 6,
                fontWeight: 600,
              }}
            >
              {place.orders.toLocaleString()} orders
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}
