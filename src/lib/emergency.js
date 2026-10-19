// Emergency contact numbers shown by the global Emergency button. The
// backend has no emergency-numbers endpoint, so they live here; if one is
// added, prefer it and keep this as the offline fallback.
// India; owner must confirm before demo.
export const EMERGENCY_NUMBERS = [
  { label: "National Emergency", number: "112" },
  { label: "Ambulance", number: "108" },
];

// The triage API returns no disclaimer field. Switch to it if one is added.
export const GUIDANCE_DISCLAIMER =
  "This is general information from a dataset, not a medical diagnosis. In an emergency, call your local emergency number.";
