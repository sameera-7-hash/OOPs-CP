import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Every English string the UI passes to t() / msg() / <Trans i18nKey>
// must have an entry in each language file, and each translation must keep
// the same {{placeholders}} and <tags> as its English key.

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..");
const LANGS = ["hi"];

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "locales" ? [] : sourceFiles(path);
    return /\.(jsx?|tsx?)$/.test(name) && !name.endsWith(".test.js") ? [path] : [];
  });
}

// [regex, how to turn the captured source text into the key]
const PATTERNS = [
  [/\b(?:t|msg)\(\s*"((?:[^"\\]|\\.)*)"/g, (raw) => JSON.parse(`"${raw}"`)],
  [/\b(?:t|msg)\(\s*`([^`$\\]*)`/g, (raw) => raw],
  [/\bi18nKey="([^"]*)"/g, (raw) => raw],
];

function usedKeys() {
  const keys = new Map();
  for (const file of sourceFiles(SRC)) {
    const code = readFileSync(file, "utf8");
    for (const [re, toKey] of PATTERNS) {
      for (const m of code.matchAll(re)) {
        const key = toKey(m[1]);
        if (!keys.has(key)) keys.set(key, file.slice(SRC.length + 1));
      }
    }
  }
  return keys;
}

const tokens = (s) => [...s.matchAll(/\{\{\s*\w+\s*\}\}|<\/?\w+\s*\/?>/g)].map((m) => m[0].replace(/\s/g, "")).sort();

const keys = usedKeys();

for (const lang of LANGS) {
  const dict = JSON.parse(readFileSync(join(SRC, "locales", `${lang}.json`), "utf8"));

  test(`${lang}: every UI string is translated`, () => {
    const missing = [...keys].filter(([k]) => !(k in dict)).map(([k, f]) => `${f}: ${JSON.stringify(k)}`);
    assert.deepEqual(missing, []);
  });

  test(`${lang}: translations keep placeholders and tags`, () => {
    const bad = Object.entries(dict)
      .filter(([k, v]) => typeof v !== "string" || !v.trim() || tokens(k).join() !== tokens(v).join())
      .map(([k]) => k);
    assert.deepEqual(bad, []);
  });

  test(`${lang}: no unused entries`, () => {
    assert.deepEqual(Object.keys(dict).filter((k) => !keys.has(k)), []);
  });
}
