// Small geography helpers for the maps.

const EARTH_RADIUS_KM = 6371;
const toRad = (deg) => (deg * Math.PI) / 180;

// Great-circle distance in km between two { lat, lng } points.
export function distanceKm(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

// "850 m", "3.2 km", "14 km".
export function formatDistance(km) {
  if (km < 1) return `${Math.max(50, Math.round((km * 1000) / 50) * 50)} m`;
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}

// FNV-1a: a stable 32-bit hash of a string.
function hash32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // Murmur3's finalizer: FNV alone leaves ids that differ only in their
  // last digit ("Z-0041", "Z-0042") with similar bits, which bunched the
  // pins into a few clusters. This spreads every input bit over all 32.
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

// The directory (Zocdoc) dataset has no addresses, so its doctors are
// placed around the patient instead: each doctor id maps to a fixed
// bearing and a distance between minKm and maxKm from `origin`. The same
// doctor always lands in the same spot for the same patient location.
export function approxPositionNear(id, origin, { minKm = 0.8, maxKm = 6 } = {}) {
  const h = hash32(String(id));
  const bearing = ((h & 0xffff) / 0x10000) * 2 * Math.PI;
  // sqrt spreads points evenly over the ring's area, not bunched inward.
  const t = Math.sqrt((h >>> 16) / 0x10000);
  const km = minKm + t * (maxKm - minKm);
  const dLat = (km / EARTH_RADIUS_KM) * Math.cos(bearing);
  const dLng = (km / EARTH_RADIUS_KM) * Math.sin(bearing) / Math.cos(toRad(origin.lat));
  return {
    lat: origin.lat + (dLat * 180) / Math.PI,
    lng: origin.lng + (dLng * 180) / Math.PI,
  };
}

export const hasPoint = (p) => Boolean(p) && Number.isFinite(p.lat) && Number.isFinite(p.lng);
