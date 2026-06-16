# BestStrat Skill Package

This folder packages BestStrat as an LLM-authored CMC Strategy Skill.

## Files

- `skill.json` — Skill manifest and high-level behavior.
- `instructions.md` — Agent instructions for using the Skill as a repeatable workflow.
- `input_schema.json` — Required user/request inputs.
- `output_schema.json` — Expected response contract.
- `examples/` — Sample invocations and generated strategy outputs.

## What the Skill does

BestStrat converts CMC market context into a backtestable strategy specification:

```text
CMC market context → regime detection → strategy rules → backtest → exportable strategy spec
```

## What the Skill does not do

- It does not execute trades.
- It does not connect wallets.
- It does not collect private keys.
- It does not promise profits.

## Invocation name

```text
beststrat.generate_strategy
```

## Example input

```json
{
  "symbol": "CAKE",
  "timeframe": "1h",
  "lookbackDays": 30,
  "riskLevel": "moderate",
  "strategyFocus": "auto"
}
```

## Output contract

The generated output must include market regime, rationale, entry rules, exit rules, risk rules, invalidation rules, no-trade conditions, backtest metrics, methodology, and disclaimer.


## Auto Strategy Selection

When strategy focus is set to `auto`, BestStrat evaluates momentum, risk-off, sentiment-divergence, and regime-detection candidates internally. It selects the final strategy using a risk-adjusted score that considers total return, max drawdown, win rate, outperformance vs benchmark, and regime confidence. This prevents Auto Detect from blindly choosing a regime when another candidate has a stronger backtest profile.

## How another product can use the Skill

Another product can treat BestStrat as a strategy-generation service. The product sends a strategy request to the API and consumes the structured response.

```http
POST /api/strategy/generate
```

The response includes fields suitable for different consumers:

- `jsonOutput` for structured strategy storage.
- `markdownReport` for human-readable strategy reports.
- `cmcSkillOutput` for CMC-style Skill presentation.
- `llmSkillOutput` for agent-readable workflow output.

Keep CMC credentials on the BestStrat backend. External clients should call the backend endpoint and should not receive the CMC API key.

## Backtest Evidence Output

BestStrat Skill responses include backtest evidence fields so an agent or reviewer can inspect how a result was produced:

- `priceChart`: sampled OHLC price path with open, high, low, close, volume, and simulated entry/exit markers
- `tradeLedger`: simulated trade-by-trade ledger with action, time, price, reason, PnL, and equity
- `evidence`: candle window, candles tested, plotted price points, and ledger row count

These fields support reproducibility and make it clear that the output is historical simulation evidence, not a future return prediction.
