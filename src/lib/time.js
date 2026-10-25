// Slot times are free text typed by doctors ("09:00 AM" is the suggested
// format, but stored data also has "9 am", "2 pm"). These helpers parse
// either 24-hour ("13:30") or 12-hour ("1:30 pm") input so a time from a
// link can be matched against whatever string a slot actually uses.

const TIME_RE = /^(\d{1,2})(?::(\d{2}))?\s*([ap]\.?m\.?)?$/i;

// Minutes since midnight, or null if the string isn't a time.
export function timeToMinutes(input) {
  if (typeof input !== "string") return null;
  const m = input.trim().match(TIME_RE);
  if (!m) return null;
  let hours = Number(m[1]);
  const minutes = m[2] === undefined ? 0 : Number(m[2]);
  const meridiem = m[3] ? m[3][0].toLowerCase() : null;
  if (minutes > 59) return null;
  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    if (hours === 12) hours = 0;
    if (meridiem === "p") hours += 12;
  } else {
    // A bare hour ("9") is ambiguous; require minutes for 24-hour input.
    if (m[2] === undefined || hours > 23) return null;
  }
  return hours * 60 + minutes;
}

// The app's display format: zero-padded 12-hour clock, "09:00 AM".
// Returns null for anything unparseable.
export function normalizeTime(input) {
  const total = timeToMinutes(input);
  if (total === null) return null;
  const h24 = Math.floor(total / 60);
  const minutes = total % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${String(h12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${h24 < 12 ? "AM" : "PM"}`;
}

// True when two slot strings name the same time, e.g. "9 am" and "09:00 AM".
export function sameTime(a, b) {
  const x = timeToMinutes(a);
  return x !== null && x === timeToMinutes(b);
}

// The clinic runs on Indian Standard Time. The backend stores UTC
// ("2026-10-24T09:21:38Z"); everything shown to people is converted to
// IST here, whatever timezone the viewer's device is set to.
export const IST = "Asia/Kolkata";

// Today's date in IST as "YYYY-MM-DD" (toISOString would give the UTC
// date, which is still yesterday before 5:30 AM IST).
export function todayIst(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: IST }).format(now);
}

// "24 Oct 2026, 2:51 pm IST". Returns the input unchanged if unparseable.
export function formatIstDateTime(value, locale = "en-IN", { seconds = false } = {}) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const text = d.toLocaleString(locale, {
    timeZone: IST,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    ...(seconds ? { second: "2-digit" } : {}),
  });
  return `${text} IST`;
}

// "24 Oct 2026" in IST.
export function formatIstDate(value, locale = "en-IN") {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(locale, { timeZone: IST, day: "numeric", month: "short", year: "numeric" });
}

// Rewrites a backend log line's leading UTC stamp in IST:
// "[2026-10-24T09:21:38Z] [INFO] ..." -> "[24 Oct 2026, 2:51:38 pm IST] [INFO] ...".
const LOG_STAMP_RE = /^\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)\]/;
export function logLineToIst(line) {
  return line.replace(LOG_STAMP_RE, (_, stamp) => `[${formatIstDateTime(stamp, "en-IN", { seconds: true })}]`);
}
