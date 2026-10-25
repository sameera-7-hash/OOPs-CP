import { normalizeTime } from "./time.js";

// Validates a ?next= return path after login. Only same-origin, in-app
// paths are allowed (no "//host" or "/\host" tricks), and never a login
// page, so a crafted link can't bounce the user off-site or into a loop.
// Returns the path (with query/hash) or null.
export function safeNextPath(next, origin) {
  if (typeof next !== "string" || !next.startsWith("/")) return null;
  if (next.startsWith("//") || next.startsWith("/\\")) return null;
  let url;
  try {
    url = new URL(next, origin);
  } catch {
    return null;
  }
  if (url.origin !== new URL(origin).origin) return null;
  if (/^\/login(\/|$)/i.test(url.pathname)) return null;
  return `${url.pathname}${url.search}${url.hash}`;
}

// Account ids look like "U-000011" (or a bare number); doctor-directory
// (mock) ids look like "Z-0001".
const DOCTOR_ID_RE = /^((U-)?\d{1,12}|Z-\d{1,6})$/;
// Free-text names (a guidance condition or a specialty) are only passed on
// to the API, which validates them; just bound their length and shape.
const NAME_RE = /^[\w ()&',./-]{1,120}$/;
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function isRealDate(iso) {
  const m = iso.match(DATE_RE);
  if (!m) return false;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.toISOString().slice(0, 10) === iso;
}

// Reads booking prefill from
// /patient/appointments?doctorId=&date=&time=&from=&condition=&specialty=.
// Every field is validated independently; a bad or stale value is dropped
// (null) rather than throwing. `today` is "YYYY-MM-DD".
export function parseBookingPrefill(params, today) {
  const get = (k) => (params.get(k) || "").trim();
  const doctorId = DOCTOR_ID_RE.test(get("doctorId")) ? get("doctorId") : null;
  const rawDate = get("date");
  const date = rawDate && isRealDate(rawDate) && rawDate >= today ? rawDate : null;
  const time = normalizeTime(get("time"));
  const fromTriage = get("from") === "triage";
  const condition = NAME_RE.test(get("condition")) ? get("condition") : null;
  const specialty = NAME_RE.test(get("specialty")) ? get("specialty") : null;
  return {
    doctorId, date, time, fromTriage, condition, specialty,
    any: Boolean(doctorId || date || time || fromTriage || condition || specialty),
  };
}
