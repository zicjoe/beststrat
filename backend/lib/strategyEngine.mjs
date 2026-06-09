import { round } from "./utils.mjs";

function riskProfile(riskLevel) {
  if (riskLevel === "conservative") {
    return { label: "Conservative", allocation: "25% to 35%", maxDrawdown: "5%", riskPerSetup: "0.5% to 1%" };
  }
  if (riskLevel === "aggressive") {
    return { label: "Aggressive", allocation: "60% to 75%", maxDrawdown: "12%", riskPerSetup: "1.5% to 2.5%" };
  }
  return { label: "Moderate", allocation: "40% to 55%", maxDrawdown: "8%", riskPerSetup: "1% to 1.5%" };
}

export function buildStrategySpec(dataset, analysis, request) {
  const risk = riskProfile(request.riskLevel);
  const symbol = dataset.symbol;
  const timeframe = request.timeframe;
  const regime = analysis.detectedRegime;
  const baseNoTrade = [
    "Conflicting trend and momentum signals",
    "Weak liquidity or unstable volume confirmation",
    "Volatility spike without clear trend confirmation",
  ];

  if (regime === "Risk Off") {
    return {
      strategyName: "Capital Protection Regime Strategy",
      strategySummary:
        "Avoid new momentum entries until trend structure, sentiment, and volatility return to acceptable conditions.",
      entryRules: [
        "Do not open a new long setup while price remains below EMA 50",
        "Only consider re-entry after price recovers EMA 20 and EMA 50 alignment",
        "Require RSI recovery above 50 with volume above the 20-candle average",
      ],
      exitRules: [
        "Exit research setup if price closes below EMA 20 after attempted recovery",
        "Exit if RSI falls below 45",
        "Exit if volatility expands above the strategy threshold",
      ],
      riskRules: [
        `Use ${risk.label.toLowerCase()} sizing with maximum ${risk.allocation} model exposure`,
        `Stop using this setup if strategy drawdown exceeds ${risk.maxDrawdown}`,
        "Prefer capital preservation until regime improves",
      ],
      invalidationRules: [
        "Invalid if regime remains Risk Off after the lookback window refreshes",
        "Invalid if liquidity score falls below 40",
        "Invalid if price fails to reclaim EMA 50",
      ],
      positionSizing: `${risk.label} risk profile: ${risk.allocation} model exposure, ${risk.riskPerSetup} risk per setup, volatility-adjusted sizing.`,
      noTradeConditions: ["Risk Off regime", "Price below EMA 50", ...baseNoTrade],
    };
  }

  if (regime === "Sentiment Divergence") {
    return {
      strategyName: "Sentiment Divergence Filter Strategy",
      strategySummary:
        "Flag setups where social heat is stronger than price and volume confirmation, then wait for market flow to confirm before considering entry.",
      entryRules: [
        "Social or sentiment score must be elevated but price must reclaim EMA 20 before entry is valid",
        "Volume must rise above the 20-candle average after the divergence appears",
        "RSI must recover above 50 without entering an overheated zone above 72",
      ],
      exitRules: [
        "Exit if price rejects EMA 20 after divergence confirmation",
        "Exit if volume confirmation disappears for two consecutive candles",
        "Exit if sentiment remains hot while price structure weakens",
      ],
      riskRules: [
        `Use ${risk.label.toLowerCase()} sizing with maximum ${risk.allocation} model exposure`,
        "Treat hype without flow as a warning, not a buy trigger",
        `Stop using the setup if max drawdown exceeds ${risk.maxDrawdown}`,
      ],
      invalidationRules: [
        "Invalid if social heat stays high but liquidity score weakens",
        "Invalid if MACD stays below signal line after confirmation window",
        "Invalid if regime flips to Risk Off",
      ],
      positionSizing: `${risk.label} risk profile: ${risk.allocation} model exposure, reduced when sentiment is hot but flow is not confirmed.`,
      noTradeConditions: ["High social heat with weak flow", "Volume below average", "Price below EMA 20", ...baseNoTrade],
    };
  }

  if (regime === "Range / Mixed") {
    return {
      strategyName: "Range Aware Mean Reversion Strategy",
      strategySummary:
        "Use range-aware rules when trend strength is mixed, avoiding breakout assumptions until momentum becomes clearer.",
      entryRules: [
        "Enter only near range support after RSI recovers from below 45",
        "Require price to hold above short-term support for at least one confirmation candle",
        "Avoid entry when MACD histogram continues weakening",
      ],
      exitRules: [
        "Exit near range midpoint or upper range resistance",
        "Exit if price breaks below the recent support zone",
        "Exit if volatility expands without directional trend",
      ],
      riskRules: [
        `Use ${risk.label.toLowerCase()} sizing with maximum ${risk.allocation} model exposure`,
        "Do not chase breakouts in mixed regimes",
        `Invalidate strategy if drawdown exceeds ${risk.maxDrawdown}`,
      ],
      invalidationRules: [
        "Invalid if regime flips to Risk Off",
        "Invalid if price breaks the lower range with rising volume",
        "Invalid if liquidity weakens while volatility expands",
      ],
      positionSizing: `${risk.label} risk profile: ${risk.allocation} model exposure, range-adjusted sizing with faster profit taking.`,
      noTradeConditions: ["No clear range", "Breakdown below support", ...baseNoTrade],
    };
  }

  return {
    strategyName: "Guarded Momentum Strategy",
    strategySummary:
      "Enter only when trend, volume, sentiment, and risk conditions confirm momentum while volatility remains controlled.",
    entryRules: [
      `Price must hold above EMA 20 on the ${timeframe} timeframe`,
      "EMA 20 must stay above EMA 50 or be improving toward a bullish alignment",
      "RSI must remain between 50 and 72 to avoid weak or overheated entries",
      "MACD line must be above the signal line",
      "Volume must be above the 20-candle average",
    ],
    exitRules: [
      "Exit if price closes below EMA 20",
      "Exit if RSI drops below 48",
      "Exit if MACD crosses below the signal line",
      "Exit if regime confidence falls below 55",
    ],
    riskRules: [
      `Use ${risk.label.toLowerCase()} sizing with maximum ${risk.allocation} model exposure`,
      `Stop using this setup if strategy drawdown exceeds ${risk.maxDrawdown}`,
      "Reject setups with weak liquidity or aggressive volatility expansion",
      "Avoid entries after large one-candle extensions without pullback confirmation",
    ],
    invalidationRules: [
      "Invalid if regime changes to Risk Off",
      "Invalid if price loses EMA 50 with rising volume",
      `Invalid if backtest drawdown breaches the ${risk.maxDrawdown} risk limit`,
    ],
    positionSizing: `${risk.label} risk profile: ${risk.allocation} model exposure, ${risk.riskPerSetup} risk per setup, adjusted down when ATR rises above normal.`,
    noTradeConditions: ["RSI above 72", "Price below EMA 20", ...baseNoTrade],
  };
}
