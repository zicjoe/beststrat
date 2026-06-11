# BestStrat

BestStrat is an LLM-authored CoinMarketCap Strategy Skill Builder for BNB Hack Track 2. It generates backtestable crypto strategy specifications from market inputs, detects market regimes, runs a lightweight backtest, and exports JSON, Markdown, CMC Skill-compatible output, and LLM Skill output.

BestStrat does not connect wallets, does not execute trades, and does not place live orders.

## What is wired

- React TypeScript frontend from the Figma export
- Two-page flow: landing page and `/builder`
- Real backend API at `POST /api/strategy/generate`
- Strategy request validation
- Market regime engine
- Indicator engine: EMA, RSI, MACD, ATR, volume average
- Strategy generator: momentum, range/mixed, sentiment divergence, and risk-off modes
- Lightweight backtest engine with equity curve, drawdown curve, trade metrics, benchmark return, and fee assumptions
- Data source visibility inside the UI
- Project-root `.env` and `backend/.env` support
- Recent strategy run persistence in `backend/data/runs.json`
- Export output: JSON Strategy Spec, Markdown Report, CMC Skill Output, and LLM Skill Output
- CMC Skill artifacts in `skill/`, including input and output schemas
- Fallback mode when no CMC API key is configured

## Tech stack

- Frontend: Vite, React, TypeScript, Tailwind CSS, Recharts
- Backend: Node.js ESM HTTP server, no backend framework dependency
- Storage: local JSON file for hackathon MVP history
- Skill artifacts: `skill/skill.json`, `skill/instructions.md`, `skill/input_schema.json`, `skill/output_schema.json`, `skill/examples`

## Local setup with pnpm

This project works with npm, but pnpm is recommended if npm fails on your Windows setup.

### Terminal 1, project root

```powershell
cd C:\dev\beststrat
pnpm install
pnpm run api
```

The backend runs on:

```text
http://localhost:8787
```

### Terminal 2, project root

```powershell
cd C:\dev\beststrat
pnpm run dev
```

The frontend runs on the Vite URL shown in your terminal, usually:

```text
http://localhost:5173
```

Vite proxies `/api` calls to the backend automatically.

## Optional npm setup

Run in the project root:

```powershell
npm install --no-audit --no-fund
npm run api
```

Open a second terminal:

```powershell
cd C:\dev\beststrat
npm run dev
```

## Optional CMC API key

BestStrat works without a CMC key by using deterministic sample market data for demo and development.

To enable latest live CoinMarketCap quote data:

1. Copy `.env.example` to `.env` in the project root.
2. Set `CMC_API_KEY`.
3. Restart the backend.

Windows PowerShell example:

```powershell
cd C:\dev\beststrat
Copy-Item .env.example .env
notepad .env
pnpm run api
```

Inside `.env`, set:

```text
CMC_API_KEY=your_key_here
PORT=8787
NODE_ENV=development
```

You can confirm the mode with:

```powershell
Invoke-RestMethod -Uri "http://localhost:8787/api/health"
```

The UI also shows whether the strategy used CMC quote data or demo fallback data.

## Production build

Run in the project root:

```powershell
pnpm run build
pnpm start
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

## Demo script

1. Open landing page.
2. Click **Launch Strategy Builder**.
3. Generate a CAKE strategy with 1h timeframe, 30d lookback, moderate risk, and auto detect focus.
4. Show the detected regime and data source badge.
5. Walk through strategy summary, entry rules, exit rules, risk rules, invalidation rules, and no-trade conditions.
6. Show backtest metrics, benchmark comparison, methodology, and charts.
7. Open Export Strategy.
8. Copy JSON Strategy Spec, Markdown Report, CMC Skill Output, and LLM Skill Output.
9. Explain that BestStrat is a Track 2 Skill product, not a trading execution bot.

## Professional demo readiness

BestStrat is now shaped like a product demo rather than an internal scoring checklist:

- Strategy Builder presents market regime, rationale, rules, backtest metrics, and exports in a clean product-focused flow.
- The app remains focused on the user flow: choose parameters, generate strategy, inspect methodology, export the spec.
- Submission support files are kept in `submission/` so the public UI stays clean and professional.

See `submission/DEMO_SCRIPT.md` and `submission/DORAHACKS_SUBMISSION.md` for reusable submission material.

## LLM Skill packaging

BestStrat includes a dedicated `skill/` package so reviewers can inspect the Skill separately from the web app. The package defines the invocation name, required inputs, output contract, workflow, examples, and guardrails for an agent that uses BestStrat as a repeatable strategy-generation Skill.

## Submission positioning

BestStrat is positioned as a Quantopian-style crypto strategy generation Skill authored as an LLM Skill:

```text
CMC-style market inputs → regime detection → strategy rules → backtest → exportable strategy spec
```

The strongest one-line pitch:

```text
BestStrat turns CMC market data into backtestable crypto strategy specs by detecting the market regime before generating entry, exit, risk, and invalidation rules.
```

## Disclaimer

This project is for research and hackathon demonstration. It is not financial advice. It does not execute trades.
