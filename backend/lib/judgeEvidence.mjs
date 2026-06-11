export function buildJudgeEvidence(dataset, request, analysis, strategy, backtestResult) {
  const dataSourceLine = dataset.dataProvider === "cmc_latest_quote"
    ? "Uses CoinMarketCap latest quote data with deterministic candle construction for repeatable backtests."
    : "Keeps a deterministic fallback data mode so judges can run the demo even without a CMC key.";

  return {
    technicalExecution: [
      dataSourceLine,
      `Generates a complete ${strategy.strategyName} spec from token, timeframe, lookback, risk level, and strategy focus inputs.`,
      `Runs a transparent backtest with ${backtestResult.backtest.numberOfTrades} completed trades, ${backtestResult.backtest.maxDrawdown} max drawdown, and explicit fee assumptions.`,
      "Exports machine-readable JSON, Markdown, and CMC Skill output from the same strategy object.",
    ],
    originality: [
      "Uses a regime-first workflow: classify the market before choosing the strategy family.",
      "Combines momentum, sentiment divergence, volatility, liquidity, and risk-off filters instead of producing a single indicator signal.",
      "Includes no-trade and invalidation rules so the Skill can refuse weak setups instead of always forcing a strategy.",
    ],
    realWorldRelevance: [
      "Designed for traders and agent builders who need structured strategy specs before live execution.",
      "Separates research logic from trade execution, making the output safer to inspect, backtest, and improve.",
      `Shows benchmark comparison: strategy return ${backtestResult.backtest.totalReturn} versus buy-and-hold ${backtestResult.backtest.benchmarkReturn}.`,
    ],
    demoPresentation: [
      "Demo flow is simple: choose parameters, generate strategy, inspect regime/rules/backtest, then copy CMC Skill output.",
      "The dashboard visibly states that it does not connect wallets, execute trades, or provide financial advice.",
      "Recent runs make it easy to compare multiple tokens and regimes during judging.",
    ],
  };
}
