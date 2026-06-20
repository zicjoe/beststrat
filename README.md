# BestStrat

**BestStrat** is a CoinMarketCap-powered crypto strategy research product that turns market data into **backtestable strategy specifications**.

It helps users move from:

**market context → regime detection → strategy selection → backtest evidence → reusable strategy output**

BestStrat is built for **research, backtesting, and strategy generation**. It is **not** a live trading bot.

---

## Demo

**Demo Video:** https://youtu.be/rs01xu2mqzE

**Live App:** Add your deployed Railway link here

---

## Why BestStrat?

Crypto users have access to a lot of market data, but it is still difficult to turn that data into clear, testable strategy logic.

Most tools either show raw charts and prices or focus on live trade execution. BestStrat sits in the research layer.

BestStrat helps users generate structured strategy specs with:

- market regime detection
- strategy candidate ranking
- entry and exit rules
- risk and invalidation rules
- no-trade conditions
- backtest evidence
- trade ledger
- reusable outputs for developers, researchers, and AI agents

The goal is to make crypto strategy research more transparent, structured, and reusable.

---

## Core Features

### Strategy Builder

Strategy Builder is for users who already have a token in mind.

A user can select:

- asset/token
- timeframe
- lookback period
- risk level
- strategy focus

BestStrat then detects the market regime, compares strategy candidates, and generates a complete strategy specification.

Generated strategies include:

- selected strategy
- detected regime
- regime confidence
- decision rationale
- entry rules
- exit rules
- risk rules
- invalidation rules
- no-trade conditions
- backtest metrics
- chart evidence
- trade ledger

---

### Strategy Scanner

Strategy Scanner is for users who want to scan a market category instead of starting with one token manually.

A user can choose a category and BestStrat ranks the strongest strategy candidates from that category.

The scanner compares candidates using:

- total return
- max drawdown
- win rate
- outperformance
- detected regime
- selected strategy
- scanner score
- risk-adjusted quality

Users can inspect each candidate and open the strongest setup directly in Strategy Builder for deeper research.

---

### Backtest Evidence

BestStrat provides visible backtest evidence instead of only returning a text explanation.

The app includes:

- backtest chart
- line/candlestick toggle
- simulated entry and exit points
- trade ledger
- benchmark comparison
- risk-adjusted score
- drawdown and win-rate metrics

---

### Skill Outputs

BestStrat exports strategy results in multiple formats:

#### JSON Output

A structured, machine-readable strategy spec for developers, dashboards, or backtesting systems.

#### Markdown Output

A readable strategy brief for reports, documentation, research notes, or community updates.

#### CMC Skill Output

A CoinMarketCap-powered strategy artifact that shows how market data becomes a backtestable strategy specification.

#### LLM Skill Output

An AI-ready instruction package that allows another LLM or agent to understand, explain, audit, or reuse the strategy safely.

---

## How It Works

BestStrat uses CoinMarketCap-powered market context to analyze an asset or category.

The system evaluates signals such as:

- trend
- momentum
- volume
- volatility
- sentiment
- market regime
- risk-adjusted performance

Then it selects or ranks strategy candidates based on historical simulation quality, including return, drawdown, win rate, benchmark comparison, and risk score.

---

## Product Scope

BestStrat is intentionally designed as a **research and strategy specification layer**.

It does **not**:

- connect wallets
- collect private keys
- place trades
- execute buy or sell orders
- present historical simulations as guaranteed future returns

BestStrat generates research strategy specifications only.

---

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Node.js
- Express
- CoinMarketCap API support
- Railway deployment

---

## Environment Variables

Create a `.env` file in the project root:

```env
CMC_API_KEY=your_cmc_api_key_here
NODE_ENV=development
PORT=8787
```

For production deployment, set:

```env
CMC_API_KEY=your_cmc_api_key_here
NODE_ENV=production
```

---

## Local Development

Install dependencies:

```bash
pnpm install
```

Run the backend API:

```bash
pnpm run api
```

Run the frontend development server:

```bash
pnpm run dev
```

Open the app:

```text
http://localhost:5173
```

---

## Production Build

Build the app:

```bash
pnpm run build
```

Start the production server:

```bash
pnpm start
```

By default, the production server runs on:

```text
http://localhost:8787
```

The Node backend serves the built React frontend and handles the API routes.

---

## API Routes

BestStrat includes backend API routes for strategy generation and scanner workflows.

Common routes include:

```text
GET  /api/health
GET  /api/scanner/categories
POST /api/scanner/scan
```

The scanner request body follows this structure:

```json
{
  "categoryId": "popular",
  "timeframe": "1h",
  "lookbackDays": 30,
  "riskLevel": "moderate",
  "strategyFocus": "auto",
  "limit": 5
}
```

---

## Deployment

BestStrat can be deployed as a single Railway service.

Recommended Railway settings:

```text
Build Command:
pnpm install --no-frozen-lockfile && pnpm run build

Start Command:
pnpm start
```

Required Railway variables:

```text
CMC_API_KEY=your_cmc_api_key_here
NODE_ENV=production
```

The deployed service serves both:

- the React frontend
- the Node backend API

---

## Summary

BestStrat turns CoinMarketCap-powered market data into structured, backtestable crypto strategy specs.

It helps users research tokens, scan market categories, compare strategy candidates, review backtest evidence, and export reusable strategy outputs for documentation, development, and AI workflows.

**BestStrat is not financial advice and does not execute trades.**
