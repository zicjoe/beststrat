import type { StrategyResponse, RecentRun } from "../types/strategy";

export const mockStrategyResponse: StrategyResponse = {
  symbol: "CAKE",
  timeframe: "1h",
  lookbackDays: 30,
  riskLevel: "moderate",
  strategyFocus: "auto",
  detectedRegime: "Momentum",
  regimeConfidence: 78,
  marketSummary: "Trend is positive, volume is expanding, and risk conditions are acceptable.",
  trendState: "Bullish",
  volatilityState: "Moderate",
  sentimentState: "Positive",
  liquidityState: "High",
  strategyName: "Guarded Momentum Strategy",
  strategySummary:
    "Enter only when trend, volume, and sentiment confirm momentum while volatility remains controlled.",
  entryRules: [
    "Price must stay above EMA 20",
    "RSI must remain between 50 and 70",
    "Volume must be above 7 day average",
  ],
  exitRules: [
    "Exit when price loses EMA 20",
    "Exit when RSI drops below 48",
    "Exit when momentum weakens",
  ],
  riskRules: [
    "Avoid trade when volatility expands aggressively",
    "Avoid trade when sentiment turns strongly negative",
    "Limit risk per setup",
  ],
  invalidationRules: [
    "Strategy invalid if market regime changes to Risk Off",
    "Strategy invalid if max drawdown exceeds threshold",
  ],
  positionSizing: "Moderate risk allocation based on volatility and drawdown limits",
  noTradeConditions: [
    "Weak liquidity",
    "Conflicting signals",
    "High volatility without trend confirmation",
  ],
  decisionRationale: [
    "CAKE was classified as Momentum, so BestStrat selected Guarded Momentum Strategy.",
    "The strongest supporting signals were RSI, MACD, and Regime confidence.",
    "The generated rules are constrained by volatility, liquidity, invalidation, and no-trade conditions.",
  ],
  signals: [
    { name: "RSI", score: 72, status: "Bullish", reason: "Momentum is positive but not overheated" },
    { name: "MACD", score: 68, status: "Bullish", reason: "MACD line crossed above signal line" },
    { name: "Volume", score: 61, status: "Neutral", reason: "Volume above average but not spiking" },
    { name: "Fear & Greed", score: 55, status: "Neutral", reason: "Market sentiment is cautiously optimistic" },
    { name: "Sentiment", score: 63, status: "Positive", reason: "Social sentiment trending upward" },
    { name: "Volatility", score: 44, status: "Moderate", reason: "Volatility within acceptable range" },
    { name: "Regime", score: 78, status: "Momentum", reason: "Strong regime classification confidence" },
  ],
  backtest: {
    totalReturn: "12.4%",
    winRate: "58%",
    maxDrawdown: "6.2%",
    numberOfTrades: 18,
    averageTradeReturn: "0.7%",
    bestTrade: "4.8%",
    worstTrade: "-2.1%",
    riskAdjustedScore: 76,
    benchmarkReturn: "8.1%",
    alphaVsBenchmark: "4.3%",
    feeAssumption: "0.10% per entry or exit",
    startingCapital: "$1,000 simulated",
    modelExposure: "55%",
  },
  equityCurve: [
    { time: "Day 1", value: 1000 },
    { time: "Day 3", value: 1015 },
    { time: "Day 5", value: 1008 },
    { time: "Day 7", value: 1032 },
    { time: "Day 9", value: 1044 },
    { time: "Day 11", value: 1038 },
    { time: "Day 13", value: 1059 },
    { time: "Day 15", value: 1071 },
    { time: "Day 17", value: 1064 },
    { time: "Day 19", value: 1082 },
    { time: "Day 21", value: 1096 },
    { time: "Day 23", value: 1089 },
    { time: "Day 25", value: 1108 },
    { time: "Day 27", value: 1117 },
    { time: "Day 29", value: 1124 },
    { time: "Day 30", value: 1124 },
  ],
  drawdownCurve: [
    { time: "Day 1", value: 0 },
    { time: "Day 3", value: -0.5 },
    { time: "Day 5", value: -2.1 },
    { time: "Day 7", value: -1.2 },
    { time: "Day 9", value: 0 },
    { time: "Day 11", value: -1.8 },
    { time: "Day 13", value: -0.9 },
    { time: "Day 15", value: 0 },
    { time: "Day 17", value: -3.4 },
    { time: "Day 19", value: -6.2 },
    { time: "Day 21", value: -4.1 },
    { time: "Day 23", value: -2.5 },
    { time: "Day 25", value: -1.0 },
    { time: "Day 27", value: 0 },
    { time: "Day 29", value: -0.7 },
    { time: "Day 30", value: -0.3 },
  ],
  signalStrength: [
    { name: "RSI", value: 72 },
    { name: "MACD", value: 68 },
    { name: "Volume", value: 61 },
    { name: "F&G", value: 55 },
    { name: "Sentiment", value: 63 },
    { name: "Volatility", value: 44 },
    { name: "Regime", value: 78 },
  ],
  jsonOutput: {
    strategySpec: {
      name: "Guarded Momentum Strategy",
      version: "1.0.0",
      asset: "CAKE",
      timeframe: "1h",
      regime: "Momentum",
      regimeConfidence: 78,
      entry: {
        conditions: [
          "price > ema(20)",
          "rsi >= 50 AND rsi <= 70",
          "volume > avg_volume(7d)",
        ],
      },
      exit: {
        conditions: [
          "price < ema(20)",
          "rsi < 48",
          "momentum_weakening == true",
        ],
      },
      risk: {
        maxDrawdown: "6.2%",
        positionSizing: "moderate",
        noTradeConditions: ["weak_liquidity", "conflicting_signals", "high_volatility_no_trend"],
      },
      invalidation: [
        "regime_change == 'risk_off'",
        "drawdown > threshold",
      ],
    },
  },
  markdownReport: `# BestStrat Report — CAKE/1h

## Strategy: Guarded Momentum Strategy

**Detected Regime:** Momentum (78% confidence)
**Market Summary:** Trend is positive, volume is expanding, and risk conditions are acceptable.

### Entry Rules
- Price must stay above EMA 20
- RSI must remain between 50 and 70
- Volume must be above 7 day average

### Exit Rules
- Exit when price loses EMA 20
- Exit when RSI drops below 48
- Exit when momentum weakens

### Risk Rules
- Avoid trade when volatility expands aggressively
- Avoid trade when sentiment turns strongly negative
- Limit risk per setup

### Backtest Results
| Metric | Value |
|--------|-------|
| Total Return | 12.4% |
| Win Rate | 58% |
| Max Drawdown | 6.2% |
| Trades | 18 |
| Avg Trade Return | 0.7% |
| Risk Adjusted Score | 76 |

---
*Generated by BestStrat — CMC Strategy Skill Builder. Not financial advice.*`,
  cmcSkillOutput: {
    skillType: "strategy",
    skillVersion: "2.0",
    cmcCompatible: true,
    asset: "CAKE",
    strategyId: "best-strat-cake-momentum-v1",
    regimeFilter: "momentum",
    signals: [
      { id: "rsi", weight: 0.25, threshold: { min: 50, max: 70 } },
      { id: "macd_crossover", weight: 0.25 },
      { id: "volume_expansion", weight: 0.2 },
      { id: "sentiment_positive", weight: 0.15 },
      { id: "regime_confirmation", weight: 0.15 },
    ],
    riskParams: {
      maxPositionSize: "moderate",
      drawdownLimit: 0.062,
      invalidationTriggers: ["regime_flip", "drawdown_breach"],
    },
  },
  llmSkillOutput: {
    skill: {
      name: "BestStrat",
      version: "1.3.0",
      type: "llm_strategy_generation_skill",
      invocationName: "beststrat.generate_strategy",
      description: "Repeatable LLM Skill for converting CMC market context into a backtestable crypto strategy specification.",
    },
    activation: {
      requiredInputs: ["symbol", "timeframe", "lookbackDays", "riskLevel", "strategyFocus"],
      userIntentExamples: ["Generate a CAKE strategy on 1h candles with moderate risk"],
    },
    workflow: [
      "Normalize request",
      "Fetch CMC market context",
      "Classify regime",
      "Generate strategy rules",
      "Backtest and compare",
      "Return structured outputs",
    ],
    responseContract: {
      mustInclude: ["detectedRegime", "entryRules", "exitRules", "riskRules", "backtest", "disclaimer"],
      mustNotInclude: ["wallet connection request", "live buy instruction", "guaranteed return claim"],
    },
    disclaimer: "Research strategy specification only. Not financial advice. No trade execution.",
  },
};

export const mockRecentRuns: RecentRun[] = [
  {
    id: "1",
    token: "BTC",
    timeframe: "4h",
    inputFocus: "auto",
    inputFocusLabel: "Auto Detect",
    selectedFocus: "momentum",
    selectedFocusLabel: "Momentum",
    regime: "Momentum",
    strategy: "Breakout Momentum",
    totalReturn: "18.3%",
    maxDrawdown: "4.1%",
    createdAt: "2026-06-07 14:22",
  },
  {
    id: "2",
    token: "ETH",
    timeframe: "1h",
    inputFocus: "regime_detection",
    inputFocusLabel: "Regime Detection",
    selectedFocus: "regime_detection",
    selectedFocusLabel: "Regime Detection",
    regime: "Trend Following",
    strategy: "EMA Crossover Trend",
    totalReturn: "9.7%",
    maxDrawdown: "5.8%",
    createdAt: "2026-06-07 12:10",
  },
  {
    id: "3",
    token: "CAKE",
    timeframe: "1h",
    inputFocus: "momentum",
    inputFocusLabel: "Momentum",
    selectedFocus: "momentum",
    selectedFocusLabel: "Momentum",
    regime: "Momentum",
    strategy: "Guarded Momentum",
    totalReturn: "12.4%",
    maxDrawdown: "6.2%",
    createdAt: "2026-06-08 09:45",
  },
  {
    id: "4",
    token: "BNB",
    timeframe: "15m",
    inputFocus: "risk_off",
    inputFocusLabel: "Risk Off",
    selectedFocus: "risk_off",
    selectedFocusLabel: "Risk Off",
    regime: "Risk Off",
    strategy: "Conservative Hedge",
    totalReturn: "2.1%",
    maxDrawdown: "1.9%",
    createdAt: "2026-06-08 08:31",
  },
  {
    id: "5",
    token: "SOL",
    timeframe: "4h",
    inputFocus: "sentiment_divergence",
    inputFocusLabel: "Sentiment Divergence",
    selectedFocus: "sentiment_divergence",
    selectedFocusLabel: "Sentiment Divergence",
    regime: "Sentiment Divergence",
    strategy: "Contrarian Sentiment",
    totalReturn: "-3.2%",
    maxDrawdown: "8.5%",
    createdAt: "2026-06-06 20:15",
  },
];
