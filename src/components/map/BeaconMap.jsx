import React, { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import { hasPoint } from "@/lib/geo";

// Shared Leaflet setup: OpenStreetMap tiles (attribution is required by
// their tile policy) and Beacon-styled pins. Markers use divIcons rather
// than Leaflet's default image icons, which bundlers can't resolve.

// Wide view of India until something is pinned.
export const DEFAULT_CENTER = { lat: 22.5, lng: 79 };
export const DEFAULT_ZOOM = 5;

const GLYPHS = {
  // person
  patient:
    '<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
  // house
  clinic:
    '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  // stethoscope
  directory:
    '<path d="M6 3v6a4 4 0 0 0 8 0V3"/><path d="M10 13v3a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="12" r="2"/>',
};

const iconCache = {};

// kind: "patient" | "clinic" | "directory"; `active` enlarges the pin.
export function pinIcon(kind, active = false) {
  const key = `${kind}-${active}`;
  if (!iconCache[key]) {
    const size = active ? 44 : kind === "directory" ? 30 : 38;
    iconCache[key] = L.divIcon({
      className: "",
      html: `<span class="map-pin map-pin--${kind}${active ? " is-active" : ""}" style="--pin:${size}px">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${GLYPHS[kind]}</svg>
      </span>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size + 4],
    });
  }
  return iconCache[key];
}

// Re-frames the map when the points it should show change.
export function FitTo({ points, maxZoom = 15 }) {
  const map = useMap();
  const key = points.map((p) => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`).join("|");
  useEffect(() => {
    const valid = points.filter(hasPoint);
    if (valid.length === 1) map.setView([valid[0].lat, valid[0].lng], maxZoom);
    else if (valid.length > 1) map.fitBounds(L.latLngBounds(valid.map((p) => [p.lat, p.lng])), { padding: [36, 36], maxZoom });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, map, maxZoom]);
  return null;
}

function BeaconMap({ center, zoom, className, children, label, ...rest }) {
  const c = hasPoint(center) ? center : DEFAULT_CENTER;
  return (
    <div className={cn("beacon-map", className)} role="region" aria-label={label}>
      <MapContainer
        center={[c.lat, c.lng]}
        zoom={zoom ?? (hasPoint(center) ? 14 : DEFAULT_ZOOM)}
        scrollWheelZoom={false}
        className="h-full w-full"
        {...rest}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
    </div>
  );
}

export default BeaconMap;
