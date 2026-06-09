export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function round(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

export function toPercent(value, decimals = 1) {
  const sign = value > 0 ? "" : "";
  return `${sign}${round(value, decimals)}%`;
}

export function hashString(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

export function seededRandom(seedInput) {
  let seed = typeof seedInput === "number" ? seedInput : hashString(String(seedInput));
  return function next() {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function timeframeToMinutes(timeframe) {
  const map = { "5m": 5, "15m": 15, "1h": 60, "4h": 240, "1d": 1440 };
  return map[timeframe] ?? 60;
}

export function normalizeScore(value, min, max) {
  if (max === min) return 50;
  return clamp(((value - min) / (max - min)) * 100, 0, 100);
}

export function average(values) {
  const clean = values.filter((v) => Number.isFinite(v));
  if (!clean.length) return 0;
  return clean.reduce((sum, value) => sum + value, 0) / clean.length;
}

export function last(values, fallback = undefined) {
  return values.length ? values[values.length - 1] : fallback;
}

export function isoMinute() {
  return new Date().toISOString().slice(0, 16).replace("T", " ");
}
