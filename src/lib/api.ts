import type { StrategyRequest, StrategyResponse, RecentRun } from "../types/strategy";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function parseApiError(response: Response) {
  const text = await response.text().catch(() => "");
  if (!text) return `API error ${response.status}`;
  try {
    const json = JSON.parse(text) as { error?: string };
    return json.error || `API error ${response.status}`;
  } catch {
    return text;
  }
}

export async function generateStrategy(request: StrategyRequest): Promise<StrategyResponse> {
  const response = await fetch(`${API_BASE_URL}/api/strategy/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...request,
      symbol: request.symbol.trim().toUpperCase(),
    }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function fetchRecentRuns(): Promise<RecentRun[]> {
  const response = await fetch(`${API_BASE_URL}/api/strategy/runs`);
  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }
  const data = (await response.json()) as { runs: RecentRun[] };
  return data.runs;
}

export async function fetchStrategyRun(id: string): Promise<StrategyResponse> {
  const response = await fetch(`${API_BASE_URL}/api/strategy/runs/${id}`);
  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }
  return response.json();
}

export async function healthCheck(): Promise<{ ok: boolean; service: string; mode: string; timestamp: string }> {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }
  return response.json();
}
