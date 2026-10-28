import React, { useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";
import { useTranslation } from "react-i18next";
import { Crosshair, LoaderCircle, MapPin, Search, X } from "lucide-react";
import BeaconMap, { FitTo, pinIcon } from "@/components/map/BeaconMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hasPoint } from "@/lib/geo";

// OpenStreetMap's free geocoder. Its usage policy allows light,
// user-triggered use like this (one search per submit, one reverse lookup
// per pin drop); results are only suggestions the user can edit.
const NOMINATIM = "https://nominatim.openstreetmap.org";

async function reverseGeocode({ lat, lng }, lang) {
  try {
    const res = await fetch(`${NOMINATIM}/reverse?format=jsonv2&zoom=17&lat=${lat}&lon=${lng}&accept-language=${lang}`);
    if (!res.ok) return "";
    const data = await res.json();
    return (data.display_name || "").split(",").slice(0, 4).join(",").trim();
  } catch {
    return "";
  }
}

function ClickToPin({ onPick }) {
  useMapEvents({ click: (e) => onPick({ lat: e.latlng.lat, lng: e.latlng.lng }) });
  return null;
}

const round6 = (n) => Math.round(n * 1e6) / 1e6;

// Pick a point on a map: click or drag the pin, use the device's location,
// or search a place. `value` is { lat, lng } or null; onChange gets
// ({ lat, lng }, suggestedLabel) -- the label comes from a reverse lookup
// (empty if that fails) for the caller to offer as the address text.
function LocationPicker({ value, onChange, kind = "patient", label }) {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const lang = i18n.language || "en";

  const pick = async (point, knownLabel) => {
    const p = { lat: round6(point.lat), lng: round6(point.lng) };
    setError("");
    onChange(p, knownLabel ?? "");
    if (knownLabel === undefined) {
      const suggested = await reverseGeocode(p, lang);
      if (suggested) onChange(p, suggested);
    }
  };

  // Not a <form>: the picker sits inside the profile forms, and forms
  // can't nest. Enter in the box or the button runs the search.
  const search = async () => {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    setError("");
    try {
      const res = await fetch(`${NOMINATIM}/search?format=jsonv2&limit=5&q=${encodeURIComponent(q)}&accept-language=${lang}`);
      const data = res.ok ? await res.json() : [];
      setResults(data);
      if (!data.length) setError(t("No places found. Try a different search, or click the map."));
    } catch {
      setError(t("Search isn't available right now. Click the map to drop a pin instead."));
    } finally {
      setSearching(false);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError(t("This browser can't share its location. Click the map instead."));
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        pick({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocating(false);
        setError(t("Couldn't get your location. Allow location access, or click the map instead."));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2" role="search">
        <div className="relative min-w-0 basis-full sm:basis-0 sm:flex-1">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder={t("Search a place, area or address")}
            aria-label={t("Search a place, area or address")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                search();
              }
            }}
          />
        </div>
        <Button type="button" variant="outline" className="flex-1 sm:flex-none" onClick={search} disabled={searching}>
          {searching ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <Search aria-hidden="true" />}
          {t("Search")}
        </Button>
        <Button type="button" variant="outline" className="flex-1 sm:flex-none" onClick={useMyLocation} disabled={locating}>
          {locating ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <Crosshair aria-hidden="true" />}
          {t("Use my location")}
        </Button>
      </div>

      {results && results.length > 0 && (
        <ul className="flex flex-col overflow-hidden rounded-lg border border-border bg-card text-sm">
          {results.map((r) => (
            <li key={r.place_id} className="border-b border-border last:border-0">
              <button
                type="button"
                className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-secondary"
                onClick={() => {
                  setResults(null);
                  pick({ lat: Number(r.lat), lng: Number(r.lon) }, r.display_name.split(",").slice(0, 4).join(",").trim());
                }}
              >
                <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {r.display_name}
              </button>
            </li>
          ))}
          <li>
            <button type="button" className="flex w-full items-center gap-2 px-3 py-2 text-muted-foreground hover:bg-secondary" onClick={() => setResults(null)}>
              <X aria-hidden="true" className="h-4 w-4" />
              {t("Close results")}
            </button>
          </li>
        </ul>
      )}

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <BeaconMap center={value} className="h-72 sm:h-80" label={label}>
        <ClickToPin onPick={(p) => pick(p)} />
        {hasPoint(value) && (
          <>
            <Marker
              position={[value.lat, value.lng]}
              icon={pinIcon(kind, true)}
              draggable
              eventHandlers={{ dragend: (e) => pick(e.target.getLatLng()) }}
            />
            <FitTo points={[value]} maxZoom={16} />
          </>
        )}
      </BeaconMap>
      <p className="text-xs text-muted-foreground">
        {hasPoint(value)
          ? t("Pinned at {{lat}}, {{lng}}. Drag the pin or click the map to move it.", { lat: value.lat.toFixed(5), lng: value.lng.toFixed(5) })
          : t("Click the map to drop a pin, search above, or use your current location.")}
      </p>
    </div>
  );
}

export default LocationPicker;
