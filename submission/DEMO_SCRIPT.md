# BestStrat Demo Script

## One-line pitch

BestStrat turns CoinMarketCap-style market data into backtestable crypto strategy specs by detecting the market regime before generating entry, exit, risk, and invalidation rules.

## Demo flow

1. Open the landing page and explain that BestStrat is a Track 2 Strategy Skill product, not a live-trading bot.
2. Click **Launch Strategy Builder**.
3. Use the default demo setup:
   - Token: CAKE
   - Timeframe: 1h
   - Lookback: 30d
   - Risk: Moderate
   - Strategy focus: Auto Detect
4. Click **Generate Strategy**.
5. Show the data source badge. If no CMC key is configured, explain deterministic fallback mode; if a key is configured, explain CMC latest quote support.
6. Walk through market regime detection: trend, volatility, sentiment, liquidity, and confidence.
7. Show the generated strategy spec: rationale, entry rules, exit rules, risk rules, invalidation rules, and no-trade conditions.
8. Show backtest results: total return, win rate, max drawdown, benchmark return, alpha vs benchmark, fees, and model exposure.
9. Show charts: equity curve, drawdown curve, and signal strength.
10. Open Export Strategy and copy JSON Strategy Spec, Markdown Report, CMC Skill Output, and LLM Skill Output.
11. Mention that the `skill/` folder packages BestStrat as an LLM Skill with input schema, output schema, instructions, guardrails, and examples.
12. End by emphasizing that BestStrat produces research-grade strategy specs only. It does not connect wallets or execute trades.

## Closing line

BestStrat gives agent builders the missing research layer: a repeatable way to turn CMC market context into testable strategy specs before any execution layer is added.
