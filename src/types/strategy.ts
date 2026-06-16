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
