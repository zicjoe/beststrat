import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const runsPath = resolve(process.cwd(), "backend/data/runs.json");

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
    regime: response.detectedRegime,
    strategy: response.strategyName,
    totalReturn: response.backtest.totalReturn,
    maxDrawdown: response.backtest.maxDrawdown,
    response,
  };
  const next = [stored, ...runs.filter((run) => run.id !== stored.id)].slice(0, 50);
  await writeFile(runsPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  return stored;
}

export async function listRecentRuns() {
  const runs = await readRuns();
  return runs.slice(0, 20).map(({ id, token, timeframe, regime, strategy, totalReturn, maxDrawdown, createdAt }) => ({
    id,
    token,
    timeframe,
    regime,
    strategy,
    totalReturn,
    maxDrawdown,
    createdAt,
  }));
}

export async function findRun(id) {
  const runs = await readRuns();
  return runs.find((run) => run.id === id) ?? null;
}
