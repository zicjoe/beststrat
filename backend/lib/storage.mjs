import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const runsPath = resolve(process.cwd(), "backend/data/runs.json");

function focusLabel(focus) {
  const labels = {
    auto: "Auto Detect",
    momentum: "Momentum",
    risk_off: "Risk Off",
    sentiment_divergence: "Sentiment Divergence",
    regime_detection: "Regime Detection",
  };
  return labels[focus] || focus || "Strategy";
}

async function ensureFile() {
  await mkdir(dirname(runsPath), { recursive: true });
  try {
    await readFile(runsPath, "utf8");
  } catch {
    await writeFile(runsPath, "[]\n", "utf8");
  }
}

export async function readRuns() {
  await ensureFile();
  const raw = await readFile(runsPath, "utf8");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveRun(response) {
  const runs = await readRuns();
  const stored = {
    id: response.id,
    createdAt: response.createdAt,
    token: response.symbol,
    timeframe: response.timeframe,
    inputFocus: response.strategyFocus,
    inputFocusLabel: focusLabel(response.strategyFocus),
    selectedFocus: response.selectedStrategyFocus || response.strategyFocus,
    selectedFocusLabel: focusLabel(response.selectedStrategyFocus || response.strategyFocus),
    regime: response.detectedRegime,
    strategy: response.strategyName,
    totalReturn: response.backtest.totalReturn,
    maxDrawdown: response.backtest.maxDrawdown,
    dataSnapshotAt: response.meta?.dataSnapshotAt || null,
    response,
  };
  const next = [stored, ...runs.filter((run) => run.id !== stored.id)].slice(0, 50);
  await writeFile(runsPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  return stored;
}

export async function listRecentRuns() {
  const runs = await readRuns();
  return runs.slice(0, 20).map(({ id, token, timeframe, inputFocus, inputFocusLabel, selectedFocus, selectedFocusLabel, regime, strategy, totalReturn, maxDrawdown, createdAt, dataSnapshotAt }) => ({
    id,
    token,
    timeframe,
    inputFocus: inputFocus || "manual",
    inputFocusLabel: inputFocusLabel || "Manual",
    selectedFocus: selectedFocus || inputFocus || "manual",
    selectedFocusLabel: selectedFocusLabel || inputFocusLabel || "Manual",
    regime,
    strategy,
    totalReturn,
    maxDrawdown,
    createdAt,
    dataSnapshotAt: dataSnapshotAt || null,
  }));
}

export async function findRun(id) {
  const runs = await readRuns();
  return runs.find((run) => run.id === id) ?? null;
}
