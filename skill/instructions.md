# BestStrat LLM Skill Instructions

BestStrat is authored as an LLM Skill for Track 2 Strategy Skills. It gives an AI agent a repeatable workflow for turning CoinMarketCap market context into a backtestable crypto strategy specification.

BestStrat is not a trading-execution Skill. It must not request wallet access, private keys, or permission to place live orders.

## Invocation

Use the Skill when a user asks for a crypto strategy, strategy rules, market-regime strategy, or backtestable research spec.

Recommended invocation name:

```text
beststrat.generate_strategy
```

## Required inputs

- `symbol`: crypto asset symbol, for example `CAKE`, `BNB`, `ETH`
- `timeframe`: one of `5m`, `15m`, `1h`, `4h`, `1d`
- `lookbackDays`: one of `7`, `14`, `30`, `60`, `90`
- `riskLevel`: one of `conservative`, `moderate`, `aggressive`
- `strategyFocus`: one of `auto`, `momentum`, `sentiment_divergence`, `regime_detection`, `risk_off`

## Agent workflow

1. Normalize the user's request into the required input schema.
2. Use CoinMarketCap market context when a CMC key is configured.
3. Score trend, momentum, volume, sentiment, volatility, and liquidity.
4. Classify the market regime before generating rules.
5. Generate entry rules, exit rules, risk rules, invalidation rules, no-trade conditions, and position sizing.
6. Backtest the generated rules over the selected lookback window.
7. Compare the strategy with a buy-and-hold benchmark.
8. Return JSON Strategy Spec, Markdown Report, CMC Skill Output, and LLM Skill Output.
9. Include a clear disclaimer that the output is research only and does not execute trades.

## Strategy modes

- **Momentum:** use when trend, momentum, volume, and sentiment confirm continuation.
- **Sentiment Divergence:** use when hype or sentiment is not confirmed by price flow, liquidity, or market structure.
- **Regime Detection:** use when the primary value is classifying the market first and selecting the matching strategy mode.
- **Risk Off:** use when volatility, weak trend, or weak sentiment suggests capital protection.
- **Range / Mixed:** use when the market lacks clean directional confirmation.

## Required output sections

Every Skill response should include:

- Detected regime
- Regime confidence
- Decision rationale
- Entry rules
- Exit rules
- Risk rules
- Invalidation rules
- No-trade conditions
- Position sizing
- Signal breakdown
- Backtest metrics
- Backtest methodology
- Data source status
- JSON Strategy Spec
- Markdown Report
- CMC Skill Output
- LLM Skill Output
- Disclaimer

## Guardrails

- Do not place trades.
- Do not connect wallets.
- Do not request private keys.
- Do not claim guaranteed returns.
- Do not present backtests as future performance promises.
- Always show whether CMC data or fallback data was used.

## Disclaimer

BestStrat generates research strategy specifications only. It is not financial advice and does not execute trades.
