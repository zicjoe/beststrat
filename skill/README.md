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
