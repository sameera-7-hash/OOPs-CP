// Run with `npm test` (Node's built-in test runner, no extra dependency).
import { test } from "node:test";
import assert from "node:assert/strict";
import { approxPositionNear, distanceKm, formatDistance, hasPoint } from "./geo.js";

const PUNE = { lat: 18.5204, lng: 73.8567 };
const MUMBAI = { lat: 19.076, lng: 72.8777 };

test("distanceKm: known city pair and zero distance", () => {
  const d = distanceKm(PUNE, MUMBAI);
  assert.ok(d > 115 && d < 125, `Pune-Mumbai was ${d}`);
  assert.equal(distanceKm(PUNE, PUNE), 0);
});

test("formatDistance: metres, one decimal, then whole km", () => {
  assert.equal(formatDistance(0.01), "50 m");
  assert.equal(formatDistance(0.83), "850 m");
  assert.equal(formatDistance(3.24), "3.2 km");
  assert.equal(formatDistance(14.6), "15 km");
});

test("approxPositionNear: stable per id and inside the ring", () => {
  const a = approxPositionNear("Z-0042", PUNE);
  assert.deepEqual(approxPositionNear("Z-0042", PUNE), a);
  assert.notDeepEqual(approxPositionNear("Z-0043", PUNE), a);
  for (let i = 0; i < 200; i++) {
    const km = distanceKm(PUNE, approxPositionNear(`Z-${i}`, PUNE));
    assert.ok(km >= 0.79 && km <= 6.01, `Z-${i} landed ${km} km away`);
  }
});

test("approxPositionNear: sequential ids spread around every side", () => {
  // Count pins per compass quadrant for 24 consecutive ids (one directory page).
  const quadrants = [0, 0, 0, 0];
  for (let i = 1; i <= 24; i++) {
    const p = approxPositionNear(`Z-${String(i).padStart(4, "0")}`, PUNE);
    quadrants[(p.lat > PUNE.lat ? 0 : 2) + (p.lng > PUNE.lng ? 0 : 1)]++;
  }
  for (const n of quadrants) assert.ok(n >= 2, `quadrants were ${quadrants}`);
});

test("hasPoint", () => {
  assert.equal(hasPoint(PUNE), true);
  assert.equal(hasPoint(null), false);
  assert.equal(hasPoint({ lat: 1 }), false);
});
