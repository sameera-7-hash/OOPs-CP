import { test } from "node:test";
import assert from "node:assert/strict";
import { parseBookingPrefill, safeNextPath } from "./navigation.js";

const ORIGIN = "http://localhost:5173";

test("safeNextPath accepts in-app paths", () => {
  assert.equal(safeNextPath("/patient/appointments?from=triage", ORIGIN), "/patient/appointments?from=triage");
  assert.equal(safeNextPath("/guidance#x", ORIGIN), "/guidance#x");
});

test("safeNextPath rejects off-site, malformed and login targets", () => {
  for (const bad of [
    "", null, undefined, "patient", "https://evil.com", "//evil.com", "/\\evil.com",
    "javascript:alert(1)", "/login/Patient", "/login/Patient?next=/x", "/LOGIN", "/login",
  ]) {
    assert.equal(safeNextPath(bad, ORIGIN), null, String(bad));
  }
});

const params = (qs) => new URLSearchParams(qs);
const TODAY = "2026-10-13";

test("parseBookingPrefill keeps valid values", () => {
  const p = parseBookingPrefill(params("doctorId=U-000011&date=2026-10-20&time=10:00&from=triage"), TODAY);
  assert.deepEqual(p, {
    doctorId: "U-000011", date: "2026-10-20", time: "10:00 AM", fromTriage: true,
    condition: null, specialty: null, any: true,
  });
  assert.equal(parseBookingPrefill(params("doctorId=3"), TODAY).doctorId, "3");
  assert.equal(parseBookingPrefill(params(`date=${TODAY}`), TODAY).date, TODAY);
});

test("parseBookingPrefill drops bad or stale values silently", () => {
  const p = parseBookingPrefill(
    params("doctorId=<script>&date=2026-10-12&time=25:99&from=elsewhere"),
    TODAY
  );
  assert.deepEqual(p, {
    doctorId: null, date: null, time: null, fromTriage: false, condition: null, specialty: null, any: false,
  });
  assert.equal(parseBookingPrefill(params("date=2026-02-30"), TODAY).date, null);
  assert.equal(parseBookingPrefill(params("date=20261020"), TODAY).date, null);
  assert.equal(parseBookingPrefill(params(""), TODAY).any, false);
});

test("parseBookingPrefill reads directory doctors, conditions and specialties", () => {
  const p = parseBookingPrefill(
    params("from=triage&condition=(vertigo) Paroxysmal Positional Vertigo&specialty=Ear, Nose %26 Throat Doctor&doctorId=Z-0042"),
    TODAY
  );
  assert.equal(p.condition, "(vertigo) Paroxysmal Positional Vertigo");
  assert.equal(p.specialty, "Ear, Nose & Throat Doctor");
  assert.equal(p.doctorId, "Z-0042");
  assert.equal(p.any, true);
  assert.equal(parseBookingPrefill(params("condition=<img src=x>"), TODAY).condition, null);
  assert.equal(parseBookingPrefill(params(`specialty=${"x".repeat(121)}`), TODAY).specialty, null);
  assert.equal(parseBookingPrefill(params("doctorId=Z-abc"), TODAY).doctorId, null);
});
