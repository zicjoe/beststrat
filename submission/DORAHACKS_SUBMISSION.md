# BestStrat — DoraHacks Submission Draft

## Project name

BestStrat

## Track

Track 2 — Strategy Skills

## Short description

BestStrat is an LLM-authored CoinMarketCap Strategy Skill Builder that generates backtestable crypto strategy specs from market inputs. It detects the current market regime, generates entry and exit rules, adds risk and invalidation logic, runs a lightweight backtest, and exports JSON, Markdown, and CMC Skill-compatible output.

## Problem

Most strategy tools jump straight from indicator signals to trade ideas. That creates weak strategies because the same rule set is often used in the wrong market condition. Momentum rules fail in choppy markets, mean-reversion rules fail in breakouts, and sentiment hype can mislead traders when liquidity and price flow disagree.

## Solution

BestStrat uses a regime-first workflow:

CMC-style market inputs → regime detection → strategy rules → backtest → exportable strategy spec

The Skill first classifies the market as Momentum, Range / Mixed, Sentiment Divergence, or Risk Off. Then it generates a strategy that matches that regime, including entry rules, exit rules, risk rules, invalidation rules, and no-trade conditions.

## What was built

- React TypeScript frontend with landing page and strategy builder page
- Node.js backend API for strategy generation
- Regime detection engine
- Indicator engine using EMA, RSI, MACD, ATR, and volume averages
- Strategy generator for momentum, range/mixed, sentiment divergence, and risk-off modes
- Backtest engine with equity curve, drawdown curve, return metrics, benchmark return, alpha vs benchmark, fee assumptions, and model exposure
- Export system for JSON Strategy Spec, Markdown Report, CMC Skill Output, and LLM Skill Output
- LLM Skill package with manifest, instructions, input schema, output schema, guardrails, and examples
- CMC-ready data layer with optional CMC API key support and deterministic fallback data for local demos

## Why it fits Track 2

Track 2 asks for a CMC Skill that turns market data into a trading strategy and delivers a backtestable strategy spec. BestStrat does exactly that. It does not execute trades, connect wallets, or place orders. Its output is a structured strategy specification that can be inspected, backtested, exported, and reused by an LLM agent through the Skill package.

## Product strength

BestStrat is built around a clear research workflow: parameters in, regime classification, strategy rules, backtest results, and exportable CMC Skill output. The app avoids wallet connection or trade execution so the demo stays focused on Track 2 strategy generation.

## Disclaimer

BestStrat is for research and hackathon demonstration only. It does not execute trades and is not financial advice.
