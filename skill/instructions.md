# BestStrat Skill Instructions

BestStrat converts market data into a backtestable crypto strategy specification.

## Skill behavior

1. Accept token, timeframe, lookback, risk level, and strategy focus.
2. Analyze trend, momentum, volume, sentiment, volatility, and liquidity.
3. Detect the current market regime.
4. Generate entry, exit, risk, invalidation, and no-trade rules.
5. Run a lightweight backtest and return performance metrics.
6. Export a machine-readable strategy spec and a human-readable report.

## Strategy modes

- Momentum: use when trend, volume, and momentum confirm.
- Sentiment Divergence: use when social heat is not confirmed by flow.
- Risk Off: use when volatility, weak trend, or weak sentiment suggests capital protection.
- Range / Mixed: use when no clean trend exists.

## Required disclaimer

BestStrat generates research strategy specifications only. It is not financial advice and does not execute trades.
