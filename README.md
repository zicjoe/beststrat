# BestStrat

BestStrat is a CoinMarketCap Strategy Skill Builder for BNB Hack Track 2. It generates backtestable crypto strategy specifications from market inputs, detects market regimes, runs a lightweight backtest, and exports JSON, Markdown, and CMC Skill-compatible output.

BestStrat does not connect wallets, does not execute trades, and does not place live orders.

## What is wired

- React TypeScript frontend from the Figma export
- Two-page flow: landing page and `/builder`
- Real backend API at `POST /api/strategy/generate`
- Strategy request validation
- Market regime engine
- Indicator engine: EMA, RSI, MACD, ATR, volume average
- Strategy generator: momentum, range/mixed, sentiment divergence, and risk-off modes
- Lightweight backtest engine with equity curve, drawdown curve, and trade metrics
- Recent strategy run persistence in `backend/data/runs.json`
- Export output: JSON Strategy Spec, Markdown Report, CMC Skill Output
- Optional CoinMarketCap API key support for latest quote data

## Tech stack

- Frontend: Vite, React, TypeScript, Tailwind CSS, Recharts
- Backend: Node.js ESM HTTP server, no backend framework dependency
- Storage: local JSON file for hackathon MVP history
- Skill artifacts: `skill/skill.json`, `skill/instructions.md`, `skill/examples`

## Local setup

### Terminal 1, project root

```bash
npm install
npm run api
```

The backend runs on:

```text
http://localhost:8787
```

### Terminal 2, project root

```bash
npm run dev
```

The frontend runs on the Vite URL shown in your terminal, usually:

```text
http://localhost:5173
```

Vite proxies `/api` calls to the backend automatically.

## Optional CMC API key

BestStrat works without a CMC key by using deterministic sample market data for demo and development.

To enable latest live CoinMarketCap quote data:

1. Copy `backend/.env.example` to `.env` if you use a local env loader, or set the variable directly in your terminal.
2. Set `CMC_API_KEY`.
3. Restart the backend.

Windows PowerShell example:

```powershell
$env:CMC_API_KEY="your_key_here"
npm run api
```

macOS/Linux example:

```bash
CMC_API_KEY="your_key_here" npm run api
```

## Production build

### Project root

```bash
npm run build
npm start
```

Production server runs the backend and serves the built frontend from `dist`.

## API

### Health check

```http
GET /api/health
```

### Generate strategy

```http
POST /api/strategy/generate
Content-Type: application/json

{
  "symbol": "CAKE",
  "timeframe": "1h",
  "lookbackDays": 30,
  "riskLevel": "moderate",
  "strategyFocus": "auto"
}
```

### Recent runs

```http
GET /api/strategy/runs
GET /api/strategy/runs/:id
```

## Submission positioning

BestStrat is positioned as a Quantopian-style crypto strategy generation Skill:

```text
CMC-style market inputs → regime detection → strategy rules → backtest → exportable strategy spec
```

The strongest demo flow is:

1. Open the landing page
2. Launch Strategy Builder
3. Enter a token such as CAKE or BNB
4. Generate strategy
5. Show market regime, rules, signals, backtest, and export tabs
6. Copy the CMC Skill Output

## Disclaimer

This project is for research and hackathon demonstration. It is not financial advice. It does not execute trades.
