import type { StrategyRequest, StrategyResponse, RecentRun, ScannerCategoriesResponse, ScannerRequest, ScannerResponse } from "../types/strategy";

export interface HealthResponse {
  ok: boolean;
  service: string;
  mode: string;
  cmcApiConfigured?: boolean;
  dataPolicy?: string;
  loadedEnvFiles?: string[];
  timestamp: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const LOCAL_API_FALLBACK = "http://localhost:8787";

async function safeFetch(path: string, init?: RequestInit) {
  const primaryUrl = `${API_BASE_URL}${path}`;
  try {
    const response = await fetch(primaryUrl, init);
    if (response.status !== 404 || API_BASE_URL) return response;
  } catch (error) {
    if (API_BASE_URL) throw error;
  }

  // Dev fallback: if the Vite proxy is not active or the app is opened from a different local host,
  // try the backend directly so scanner results do not fail silently.
  return fetch(`${LOCAL_API_FALLBACK}${path}`, init);
}

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
  const response = await safeFetch(`/api/strategy/generate`, {
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
  const response = await safeFetch(`/api/strategy/runs`);
  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }
  const data = (await response.json()) as { runs: RecentRun[] };
  return data.runs;
}

export async function fetchStrategyRun(id: string): Promise<StrategyResponse> {
  const response = await safeFetch(`/api/strategy/runs/${id}`);
  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }
  return response.json();
}

export async function healthCheck(): Promise<HealthResponse> {
  const response = await safeFetch(`/api/health`);
  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }
  return response.json();
}

export async function fetchScannerCategories(): Promise<ScannerCategoriesResponse> {
  const response = await safeFetch(`/api/scanner/categories`);
  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }
  return response.json();
}

export async function scanStrategyCategory(request: ScannerRequest): Promise<ScannerResponse> {
  const response = await safeFetch(`/api/scanner/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}
