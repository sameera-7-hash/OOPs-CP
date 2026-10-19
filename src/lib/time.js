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
