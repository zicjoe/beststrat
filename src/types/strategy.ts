export interface Signal {
  name: string;
  score: number;
  status: string;
  reason: string;
}

export interface Backtest {
  totalReturn: string;
  winRate: string;
  maxDrawdown: string;
  numberOfTrades: number;
  averageTradeReturn: string;
  bestTrade: string;
  worstTrade: string;
  riskAdjustedScore: number;
  benchmarkReturn?: string;
  alphaVsBenchmark?: string;
  feeAssumption?: string;
  startingCapital?: string;
  modelExposure?: string;
}

export interface ChartPoint {
  time: string;
  value: number;
}

export interface SignalStrengthPoint {
  name: string;
  value: number;
}

export interface PriceChartPoint {
  time: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
  entryPrice?: number | null;
  exitPrice?: number | null;
  action?: string | null;
  reason?: string | null;
}

export interface TradeLedgerRow {
  id: string;
  tradeNumber: number;
  action: "Entry" | "Exit" | string;
  time: string;
  price: number;
  reason: string;
  pnl: string;
  equity: number;
}

export interface BacktestEvidence {
  candlesTested: number;
  candleWindow: string;
  pricePointsPlotted: number;
  tradeLedgerRows: number;
}

export interface AutoSelectionCandidate {
  rank: number;
  focus: string;
  focusLabel: string;
  regime: string;
  strategyName: string;
  totalReturn: string;
  maxDrawdown: string;
  winRate: string;
  riskAdjustedScore: number;
  alphaVsBenchmark?: string;
  selectionScore: number;
  selected: boolean;
}

export interface AutoSelection {
  enabled: boolean;
  selectedFocus: string;
  selectedFocusLabel: string;
  selectedStrategy: string;
  selectedRegime: string;
  selectionScore: number;
  reason: string;
  candidates: AutoSelectionCandidate[];
  note?: string;
}

export interface StrategyResponse {
  id?: string;
  createdAt?: string;
  symbol: string;
  timeframe: string;
  lookbackDays: number;
  riskLevel: string;
  strategyFocus: string;
  selectedStrategyFocus?: string;
  autoSelection?: AutoSelection | null;
  detectedRegime: string;
  regimeConfidence: number;
  marketSummary: string;
  trendState: string;
  volatilityState: string;
  sentimentState: string;
  liquidityState: string;
  strategyName: string;
  strategySummary: string;
  entryRules: string[];
  exitRules: string[];
  riskRules: string[];
  invalidationRules: string[];
  positionSizing: string;
  noTradeConditions: string[];
  decisionRationale: string[];
  signals: Signal[];
  backtest: Backtest;
  equityCurve: ChartPoint[];
  drawdownCurve: ChartPoint[];
  priceChart?: PriceChartPoint[];
  tradeLedger?: TradeLedgerRow[];
  backtestEvidence?: BacktestEvidence;
  signalStrength: SignalStrengthPoint[];
  jsonOutput: Record<string, unknown>;
  markdownReport: string;
  cmcSkillOutput: Record<string, unknown>;
  llmSkillOutput: Record<string, unknown>;
  meta?: {
    dataSource?: string;
    dataProvider?: string;
    cmcApiConfigured?: boolean;
    cmcQuoteUsed?: boolean;
    fallbackReason?: string | null;
    candlesAnalyzed?: number;
    dataSnapshotAt?: string;
    cacheHit?: boolean;
    cachePolicy?: string;
    cacheExpiresAt?: string;
    generatedAt?: string;
    note?: string;
  };
}

export interface StrategyRequest {
  symbol: string;
  timeframe: string;
  lookbackDays: number;
  riskLevel: string;
  strategyFocus: string;
}

export interface RecentRun {
  id: string;
  token: string;
  timeframe: string;
  inputFocus?: string;
  inputFocusLabel?: string;
  selectedFocus?: string;
  selectedFocusLabel?: string;
  regime: string;
  strategy: string;
  totalReturn: string;
  maxDrawdown: string;
  createdAt: string;
  dataSnapshotAt?: string | null;
}

export type AppState = "idle" | "loading" | "success" | "error";

export interface ScannerCategory {
  id: string;
  cmcId?: string;
  name: string;
  source: "curated" | "coinmarketcap" | string;
  description?: string;
  tokenCount?: number;
  symbols?: string[];
  marketCap?: number;
  volume24h?: number;
}

export interface ScannerCategoriesResponse {
  categories: ScannerCategory[];
  meta: {
    cmcApiConfigured?: boolean;
    source?: string;
    categoryFallbackReason?: string | null;
    note?: string;
  };
}

export interface ScannerRequest {
  categoryId: string;
  timeframe: string;
  lookbackDays: number;
  riskLevel: string;
  strategyFocus: string;
  limit: number;
}

export interface ScannerResultRow {
  rank: number;
  symbol: string;
  categoryId: string;
  categoryName: string;
  inputFocus: string;
  inputFocusLabel: string;
  selectedFocus: string;
  selectedFocusLabel: string;
  selectedStrategy: string;
  detectedRegime: string;
  regimeConfidence: number;
  totalReturn: string;
  maxDrawdown: string;
  winRate: string;
  outperformance: string;
  riskAdjustedScore: number;
  scannerScore: number;
  numberOfTrades: number;
  dataSource: string;
  dataSnapshotAt?: string | null;
  strategySummary: string;
  entryRules: string[];
  riskRules: string[];
  builderRequest: StrategyRequest;
}

export interface ScannerResponse {
  id: string;
  scannedAt: string;
  request: ScannerRequest;
  category: {
    id: string;
    name: string;
    source: string;
    description?: string;
    tokenCount?: number;
    symbolsScanned: string[];
    fallbackReason?: string | null;
  };
  summary: {
    resultCount: number;
    failedCount: number;
    topSymbol: string | null;
    topStrategy: string | null;
    averageReturn: string;
    averageMaxDrawdown: string;
    averageScannerScore: number;
    regimeDistribution: Record<string, number>;
    note: string;
  };
  results: ScannerResultRow[];
  failures?: { symbol: string; error: string }[];
  meta: {
    cmcApiConfigured?: boolean;
    source?: string;
    categoryFallbackReason?: string | null;
    note?: string;
  };
}
