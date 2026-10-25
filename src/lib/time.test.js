// Run with `npm test` (Node's built-in test runner, no extra dependency).
import { test } from "node:test";
import assert from "node:assert/strict";
import { formatIstDateTime, logLineToIst, normalizeTime, sameTime, timeToMinutes, todayIst } from "./time.js";

test("normalizeTime: required cases", () => {
  assert.equal(normalizeTime("00:30"), "12:30 AM");
  assert.equal(normalizeTime("12:00"), "12:00 PM");
  assert.equal(normalizeTime("13:30"), "01:30 PM");
  assert.equal(normalizeTime("9:00"), "09:00 AM");
  assert.equal(normalizeTime("09:00 AM"), "09:00 AM");
});

test("normalizeTime: formats found in stored availability data", () => {
  assert.equal(normalizeTime("9 am"), "09:00 AM");
  assert.equal(normalizeTime("2 pm"), "02:00 PM");
  assert.equal(normalizeTime("12:00 AM"), "12:00 AM");
  assert.equal(normalizeTime("12:00 PM"), "12:00 PM");
  assert.equal(normalizeTime(" 10:15pm "), "10:15 PM");
});

test("normalizeTime: rejects garbage", () => {
  for (const bad of ["", "9", "24:00", "13:00 PM", "0:30 AM", "10:60", "noon", "10:00 XM", null, undefined, 900]) {
    assert.equal(normalizeTime(bad), null, String(bad));
  }
});

test("sameTime matches across formats", () => {
  assert.ok(sameTime("09:00 AM", "9 am"));
  assert.ok(sameTime("14:00", "2 pm"));
  assert.ok(!sameTime("09:00 AM", "9 pm"));
  assert.ok(!sameTime("junk", "junk"));
  assert.equal(timeToMinutes("00:00"), 0);
});

test("todayIst: uses the IST date, not the UTC one", () => {
  // 20:00 UTC on the 23rd is 01:30 IST on the 24th.
  assert.equal(todayIst(new Date("2026-10-23T20:00:00Z")), "2026-10-24");
  assert.equal(todayIst(new Date("2026-10-24T09:00:00Z")), "2026-10-24");
});

test("logLineToIst: shifts the UTC stamp by +5:30", () => {
  const out = logLineToIst("[2026-10-24T09:21:38Z] [INFO] login success: a@b.test");
  assert.match(out, /^\[24 Oct 2026, 2:51:38 pm IST\] \[INFO\] login success: a@b\.test$/i);
  assert.equal(logLineToIst("no stamp here"), "no stamp here");
});

test("formatIstDateTime: midnight UTC is 5:30 am IST", () => {
  assert.match(formatIstDateTime("2026-10-24T00:00:00Z"), /^24 Oct 2026, 5:30 am IST$/i);
});
