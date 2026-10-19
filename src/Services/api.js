// Thin client for the C++ patient-records backend.
// When VITE_API_URL is unset, Vite proxies "/api" to localhost in development.

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");
const apiUrl = configuredApiUrl
  ? (/^https?:\/\//i.test(configuredApiUrl)
      ? configuredApiUrl
      : `https://${configuredApiUrl}`)
  : "";
const BASE = apiUrl
  ? `${apiUrl}${apiUrl.endsWith("/api") ? "" : "/api"}`
  : "/api";

export function getToken() {
  try {
    return localStorage.getItem("pc_token") || "";
  } catch {
    return "";
  }
}

function clearSessionAndReload() {
  try {
    localStorage.removeItem("pc_token");
    localStorage.removeItem("pc_user");
  } catch {
    // ignore
  }
  window.location.reload();
}

async function request(path, options = {}) {
  const token = getToken();
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...options,
    });
  } catch (err) {
    throw new Error(
      "Could not reach the backend. Check VITE_API_URL and confirm the backend is running."
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // The session is gone (expired, or the server restarted -- sessions
    // are in-memory only). Nothing else on the page will work either, so
    // send the user back to log in rather than showing a wall of 401s.
    if (res.status === 401 && token) {
      clearSessionAndReload();
    }
    const err = new Error(
      res.status === 401 ? "Please log in again." : data.error || `Request failed (${res.status})`
    );
    err.status = res.status;
    throw err;
  }
  return data;
}

// GET /api/patients -> { chainIntact, usedBackup, count, patientAccounts, patients: [...] }
// `patientAccounts` is the number of self-registered Patient accounts.
// Each patient record also carries `algo` (cipher used) and `ok` (integrity
// check result); when ok is false, `problem` explains what failed.
export function getPatients() {
  return request("/patients");
}

// POST /api/patients. `patient` should have: name, age, gender, contact,
// diagnosis, admissionDate, algo ("AES" | "DES"). The backend assigns `id`.
export function addPatient(patient) {
  return request("/patients", {
    method: "POST",
    body: JSON.stringify(patient),
  });
}

// POST /api/backup -> { snapshot: "<path to timestamped copy>" }
export function createBackup() {
  return request("/backup", { method: "POST" });
}

// Doctor/Admin only. GET /api/logs?lines= -> { file, totalLines, lines: [...] },
// the newest `lines` entries of the backend's logs/app.log.
export function getLogs(lines = 200) {
  return request(`/logs?lines=${lines}`);
}

// GET /api/health -> { status: "ok" }
export function checkHealth() {
  return request("/health");
}

// ---------------------------------------------------------------
// Accounts & sessions. Login/signup return { user, token }; the token is
// a bearer session token (server-side, in-memory, expires after a few
// hours) that request() above attaches to every other call automatically
// once it's stored -- see UserContext, which persists both to
// localStorage on login and clears them on logout.
// ---------------------------------------------------------------

// role: "Patient" | "Doctor" | "Nurse" always allowed; "Admin"/"Viewer"
// only succeeds for the very first Admin account (bootstrap) -- after
// that, only an existing Admin can create more via createUser() below.
export function signup({ name, email, password, role }) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password, role }),
  });
}

export function login({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  return request("/auth/logout", { method: "POST" }).catch(() => {});
}

// Admin-only. GET /api/users?role=Doctor -> [{id, name, email, role}, ...]
export function getUsers(role) {
  return request(`/users${role ? `?role=${encodeURIComponent(role)}` : ""}`);
}

// Admin-only. Creates an account of any role, including Admin/Viewer.
export function createUser({ name, email, password, role }) {
  return request("/users", {
    method: "POST",
    body: JSON.stringify({ name, email, password, role }),
  });
}

// ---------------------------------------------------------------
// Doctor availability & appointments.
// ---------------------------------------------------------------

// Overwrites (merging by time) a doctor's open slots for one date.
// `slots` is an array of time strings, e.g. ["09:00 AM", "09:30 AM"].
export function setAvailability({ doctorId, doctorName, date, slots }) {
  return request("/availability", {
    method: "POST",
    body: JSON.stringify({ doctorId, doctorName, date, slots }),
  });
}

// GET /api/availability?date=&doctorId= -> array of
// { doctorId, doctorName, date, slots: [{time, booked, patientId, patientName}] }
export function getAvailability({ doctorId, date } = {}) {
  const params = new URLSearchParams();
  if (doctorId) params.set("doctorId", doctorId);
  if (date) params.set("date", date);
  const qs = params.toString();
  return request(`/availability${qs ? `?${qs}` : ""}`);
}

// Books a specific open slot. Throws if it was already taken.
export function bookAppointment({ patientId, patientName, doctorId, doctorName, date, time, reason }) {
  return request("/appointments", {
    method: "POST",
    body: JSON.stringify({ patientId, patientName, doctorId, doctorName, date, time, reason }),
  });
}

// GET /api/appointments?patientId= or ?doctorId= (omit both to get all --
// used by the nurse view, since appointments aren't assigned to one nurse).
export function getAppointments({ patientId, doctorId } = {}) {
  const params = new URLSearchParams();
  if (patientId) params.set("patientId", patientId);
  if (doctorId) params.set("doctorId", doctorId);
  const qs = params.toString();
  return request(`/appointments${qs ? `?${qs}` : ""}`);
}

// ---------------------------------------------------------------
// Documents: patient-uploaded files and nurse-authored reports, both
// visible to the patient, their doctor, and nursing staff.
// ---------------------------------------------------------------

// `dataBase64` is the raw file content (or report text) base64-encoded --
// see fileToBase64() below for turning a browser File into this shape.
export function uploadDocument({ patientId, patientName, uploaderRole, uploaderName, filename, contentType, dataBase64, note }) {
  return request("/documents", {
    method: "POST",
    body: JSON.stringify({ patientId, patientName, uploaderRole, uploaderName, filename, contentType, dataBase64, note }),
  });
}

// GET /api/documents?patientId= -> metadata only (no file bytes)
export function getDocuments(patientId) {
  return request(`/documents?patientId=${encodeURIComponent(patientId)}`);
}

// URL to fetch/view one document's raw bytes (open in a new tab, or use
// as a download link's href). This is a plain <a href>, so it can't carry
// an Authorization header -- the backend accepts the session token as a
// ?token= query param for exactly this case.
export function documentContentUrl(id) {
  const params = new URLSearchParams({ id, token: getToken() });
  return `${BASE}/documents/content?${params.toString()}`;
}

// Reads a browser File object into a base64 string (no "data:...;base64,"
// prefix) for uploadDocument()'s dataBase64 field.
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const commaIndex = result.indexOf(",");
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };
    reader.onerror = () => reject(reader.error || new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

// ---------------------------------------------------------------
// Notifications / reminders.
// ---------------------------------------------------------------

// GET /api/notifications?role=&userId= -> newest first. userId is
// optional (omit for a role-wide broadcast, used by the Nurse role).
export function getNotifications(role, userId) {
  const params = new URLSearchParams({ role });
  if (userId) params.set("userId", userId);
  return request(`/notifications?${params.toString()}`);
}

export function markNotificationRead(id) {
  return request("/notifications/read", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}

// ---------------------------------------------------------------
// Triage (condition guidance). Both need a logged-in session.
// ---------------------------------------------------------------

// GET /api/triage/diseases -> ["Malaria", ...]; the exact names to pass
// back to getTriage().
export function getTriageDiseases() {
  return request("/triage/diseases");
}

// GET /api/triage?disease= -> { disease, action, precautions,
// discussWithDoctor, emergency?, message?, nextSteps } (see
// backend include/TriageService.h). Names contain spaces, parentheses and
// in places double spaces, so encode them exactly as received.
export function getTriage(disease) {
  return request(`/triage?disease=${encodeURIComponent(disease)}`);
}
