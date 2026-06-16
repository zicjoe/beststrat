import { round } from "./utils.mjs";

export function buildMarketSummary(dataset, analysis) {
  const parts = [];
  parts.push(`${dataset.symbol} is classified as ${analysis.detectedRegime} with ${analysis.regimeConfidence}% confidence`);
  parts.push(`trend is ${analysis.trendState.toLowerCase()}`);
  parts.push(`volatility is ${analysis.volatilityState.toLowerCase()}`);
  parts.push(`sentiment is ${analysis.sentimentState.toLowerCase()}`);
  parts.push(`liquidity is ${analysis.liquidityState.toLowerCase()}`);
  return `${parts.join(", ")}.`;
}

export function buildDecisionRationale(dataset, analysis, strategy, autoSelection = null) {
  const strongestSignals = [...analysis.signals]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((signal) => `${signal.name}: ${signal.status} (${signal.score})`);

  const rationale = [
    `${dataset.symbol} was classified as ${analysis.detectedRegime}, so BestStrat selected ${strategy.strategyName}.`,
    `The strongest supporting signals were ${strongestSignals.join(", ")}.`,
    `The generated rules are constrained by volatility, liquidity, invalidation, and no-trade conditions so the output stays backtestable instead of becoming a vague trading opinion.`,
  ];

  if (autoSelection?.enabled) {
    rationale.unshift(
      `Auto Detect compared ${autoSelection.candidates.length} candidate strategies and selected ${autoSelection.selectedStrategy} with a ${autoSelection.selectionScore} selection score.`
    );
  }

  return rationale;
}

export function buildJsonOutput(dataset, request, analysis, strategy, backtestResult, autoSelection = null) {
  return {
    strategySpec: {
      name: strategy.strategyName,
      version: "1.3.0",
      asset: dataset.symbol,
      timeframe: request.timeframe,
      lookbackDays: request.lookbackDays,
      riskLevel: request.riskLevel,
      strategyFocus: request.strategyFocus,
      dataSource: {
        label: dataset.dataSource,
        provider: dataset.dataProvider,
        cmcApiConfigured: dataset.cmcApiConfigured,
        cmcQuoteUsed: dataset.dataProvider === "cmc_latest_quote",
        fallbackReason: dataset.fallbackReason,
        dataSnapshotAt: dataset.dataSnapshotAt,
        cachePolicy: dataset.cache?.policy,
      },
      regime: {
        name: analysis.detectedRegime,
        confidence: analysis.regimeConfidence,
        trendState: analysis.trendState,
        volatilityState: analysis.volatilityState,
        sentimentState: analysis.sentimentState,
        liquidityState: analysis.liquidityState,
      },
      decisionRationale: buildDecisionRationale(dataset, analysis, strategy, autoSelection),
      rules: {
        entry: strategy.entryRules,
        exit: strategy.exitRules,
        risk: strategy.riskRules,
        invalidation: strategy.invalidationRules,
        noTradeConditions: strategy.noTradeConditions,
      },
      positionSizing: strategy.positionSizing,
      backtest: backtestResult.backtest,
      signals: analysis.signals.map((signal) => ({
        name: signal.name,
        score: signal.score,
        status: signal.status,
        reason: signal.reason,
      })),
      autoSelection: autoSelection || undefined,
      backtestMethodology: {
        startingCapital: backtestResult.backtest.startingCapital,
        feeAssumption: backtestResult.backtest.feeAssumption,
        modelExposure: backtestResult.backtest.modelExposure,
        benchmarkReturn: backtestResult.backtest.benchmarkReturn,
        alphaVsBenchmark: backtestResult.backtest.alphaVsBenchmark,
        candlesAnalyzed: dataset.candles.length,
        dataSnapshotAt: dataset.dataSnapshotAt,
      },
      constraints: [
        "No wallet connection",
        "No live order execution",
        "No buy or sell transaction",
        "Research and strategy specification output only",
      ],
    },
  };
}

export function buildCmcSkillOutput(dataset, request, analysis, strategy, backtestResult, autoSelection = null) {
  return {
    skillType: "strategy_generation",
    skillVersion: "1.3.0",
    project: "BestStrat",
    category: "CMC Strategy Skill",
    cmcCompatible: true,
    purpose: "Turn CMC-style market data into a backtestable crypto strategy specification that an LLM agent can execute as a repeatable workflow.",
    input: {
      symbol: dataset.symbol,
      timeframe: request.timeframe,
      lookbackDays: request.lookbackDays,
      riskLevel: request.riskLevel,
      strategyFocus: request.strategyFocus,
    },
    dataSource: {
      label: dataset.dataSource,
      provider: dataset.dataProvider,
      cmcApiConfigured: dataset.cmcApiConfigured,
      cmcQuoteUsed: dataset.dataProvider === "cmc_latest_quote",
      fallbackReason: dataset.fallbackReason,
      candlesAnalyzed: dataset.candles.length,
      dataSnapshotAt: dataset.dataSnapshotAt,
      cachePolicy: dataset.cache?.policy,
    },
    output: {
      strategyName: strategy.strategyName,
      strategySummary: strategy.strategySummary,
      detectedRegime: analysis.detectedRegime,
      regimeConfidence: analysis.regimeConfidence,
      decisionRationale: buildDecisionRationale(dataset, analysis, strategy, autoSelection),
      entryRules: strategy.entryRules,
      exitRules: strategy.exitRules,
      riskRules: strategy.riskRules,
      invalidationRules: strategy.invalidationRules,
      noTradeConditions: strategy.noTradeConditions,
      positionSizing: strategy.positionSizing,
      backtest: backtestResult.backtest,
      signals: analysis.signals,
      autoSelection: autoSelection || undefined,
      backtestMethodology: {
        startingCapital: backtestResult.backtest.startingCapital,
        feeAssumption: backtestResult.backtest.feeAssumption,
        modelExposure: backtestResult.backtest.modelExposure,
        benchmarkReturn: backtestResult.backtest.benchmarkReturn,
        alphaVsBenchmark: backtestResult.backtest.alphaVsBenchmark,
        candlesAnalyzed: dataset.candles.length,
        dataSnapshotAt: dataset.dataSnapshotAt,
      },
    },
    signalWeights: {
      trend: 0.25,
      momentum: 0.2,
      volume: 0.15,
      sentiment: 0.15,
      volatility: 0.15,
      liquidity: 0.1,
    },
    disclaimer: "Research strategy specification only. Not financial advice. No trade execution.",
  };
}


export function buildLlmSkillOutput(dataset, request, analysis, strategy, backtestResult, autoSelection = null) {
  const rationale = buildDecisionRationale(dataset, analysis, strategy, autoSelection);
  return {
    skill: {
      name: "BestStrat",
      version: "1.3.0",
      type: "llm_strategy_generation_skill",
      description: "A repeatable LLM Skill for converting CMC market context into a backtestable crypto strategy specification.",
      invocationName: "beststrat.generate_strategy",
      intendedAgentUse: "Use when a user asks for a crypto trading strategy research spec, not when they ask to place a live trade.",
    },
    activation: {
      userIntentExamples: [
        "Generate a strategy for CAKE on 1h candles with moderate risk.",
        "Create a backtestable momentum strategy for BNB.",
        "Detect the market regime for ETH and write entry, exit, and risk rules.",
      ],
      requiredInputs: ["symbol", "timeframe", "lookbackDays", "riskLevel", "strategyFocus"],
      optionalInputs: ["preferredRegime", "maxDrawdownTolerance", "feeAssumption"],
    },
    input: {
      symbol: dataset.symbol,
      timeframe: request.timeframe,
      lookbackDays: request.lookbackDays,
      riskLevel: request.riskLevel,
      strategyFocus: request.strategyFocus,
    },
    dataContext: {
      provider: dataset.dataProvider,
      label: dataset.dataSource,
      cmcApiConfigured: dataset.cmcApiConfigured,
      cmcQuoteUsed: dataset.dataProvider === "cmc_latest_quote",
      fallbackReason: dataset.fallbackReason,
      candlesAnalyzed: dataset.candles.length,
      dataSnapshotAt: dataset.dataSnapshotAt,
      cachePolicy: dataset.cache?.policy,
    },
    workflow: [
      {
        step: 1,
        name: "Normalize user request",
        instruction: "Extract symbol, timeframe, lookbackDays, riskLevel, and strategyFocus. Ask for missing required inputs when needed.",
      },
      {
        step: 2,
        name: "Fetch CMC market context",
        instruction: "Use CoinMarketCap data when configured. If unavailable, clearly mark deterministic fallback data.",
      },
      {
        step: 3,
        name: "Classify market regime",
        instruction: "Score trend, momentum, volume, sentiment, volatility, and liquidity before selecting a regime.",
      },
      {
        step: 4,
        name: "Auto-select strategy candidate when requested",
        instruction: "When strategyFocus is auto, compare momentum, risk-off, sentiment-divergence, and regime-detection candidates by risk-adjusted score before selecting a strategy.",
      },
      {
        step: 5,
        name: "Generate strategy rules",
        instruction: "Return entry, exit, risk, invalidation, position sizing, and no-trade conditions as explicit testable rules.",
      },
      {
        step: 6,
        name: "Backtest and compare",
        instruction: "Run the strategy over the selected lookback window and compare it with a buy-and-hold benchmark using stated fee assumptions.",
      },
      {
        step: 7,
        name: "Return structured output",
        instruction: "Return JSON, Markdown, CMC Skill output, and LLM Skill output without any live execution instructions.",
      },
    ],
    responseContract: {
      mustInclude: [
        "detectedRegime",
        "regimeConfidence",
        "decisionRationale",
        "entryRules",
        "exitRules",
        "riskRules",
        "invalidationRules",
        "noTradeConditions",
        "backtest",
        "backtestMethodology",
        "disclaimer",
      ],
      mustNotInclude: [
        "wallet connection request",
        "private key handling",
        "live buy instruction",
        "live sell instruction",
        "guaranteed return claim",
      ],
    },
    generatedStrategy: {
      strategyName: strategy.strategyName,
      strategySummary: strategy.strategySummary,
      detectedRegime: analysis.detectedRegime,
      regimeConfidence: analysis.regimeConfidence,
      decisionRationale: rationale,
      entryRules: strategy.entryRules,
      exitRules: strategy.exitRules,
      riskRules: strategy.riskRules,
      invalidationRules: strategy.invalidationRules,
      noTradeConditions: strategy.noTradeConditions,
      positionSizing: strategy.positionSizing,
      signals: analysis.signals,
      backtest: backtestResult.backtest,
      autoSelection: autoSelection || undefined,
      backtestMethodology: {
        startingCapital: backtestResult.backtest.startingCapital,
        feeAssumption: backtestResult.backtest.feeAssumption,
        modelExposure: backtestResult.backtest.modelExposure,
        benchmarkReturn: backtestResult.backtest.benchmarkReturn,
        alphaVsBenchmark: backtestResult.backtest.alphaVsBenchmark,
        candlesAnalyzed: dataset.candles.length,
        dataSnapshotAt: dataset.dataSnapshotAt,
      },
    },
    guardrails: [
      "Research strategy specification only",
      "No wallet connection",
      "No live order execution",
      "No private key collection",
      "Do not present historical simulations as guaranteed future performance",
    ],
    finalAnswerStyle: {
      tone: "clear, research-focused, concise",
      includeTables: true,
      includeMachineReadableJson: true,
      includeDisclaimer: true,
    },
    disclaimer: "BestStrat generates research strategy specifications only. It is not financial advice and does not execute trades.",
  };
}

export function buildMarkdownReport(dataset, request, analysis, strategy, backtestResult, autoSelection = null) {
  const rules = (items) => items.map((item) => `- ${item}`).join("\n");
  const signals = analysis.signals.map((signal) => `| ${signal.name} | ${signal.score} | ${signal.status} | ${signal.reason} |`).join("\n");
  const rationale = buildDecisionRationale(dataset, analysis, strategy, autoSelection).map((line) => `- ${line}`).join("\n");

  return `# BestStrat Report — ${dataset.symbol}/${request.timeframe}

## Strategy
**Name:** ${strategy.strategyName}  
**Detected Regime:** ${analysis.detectedRegime} (${analysis.regimeConfidence}% confidence)  
**Data Source:** ${dataset.dataSource}  
**CMC API Configured:** ${dataset.cmcApiConfigured ? "Yes" : "No"}
${dataset.fallbackReason ? `**Fallback Note:** ${dataset.fallbackReason}\n` : ""}
${strategy.strategySummary}

## Why This Strategy Was Generated
${rationale}

## Market State
- Trend: ${analysis.trendState}
- Volatility: ${analysis.volatilityState}
- Sentiment: ${analysis.sentimentState}
- Liquidity: ${analysis.liquidityState}
- Latest price used by engine: ${round(analysis.current.close, 6)}
- Candles analyzed: ${dataset.candles.length}
- Data snapshot: ${dataset.dataSnapshotAt || "Current request"}

## Entry Rules
${rules(strategy.entryRules)}

## Exit Rules
${rules(strategy.exitRules)}

## Risk Rules
${rules(strategy.riskRules)}

## Invalidation Rules
${rules(strategy.invalidationRules)}

## No Trade Conditions
${rules(strategy.noTradeConditions)}

${autoSelection?.enabled ? `## Auto Strategy Selection
BestStrat compared candidate strategies before selecting the final output.

| Rank | Focus | Strategy | Return | Max Drawdown | Win Rate | Selection Score |
|------|-------|----------|--------|--------------|----------|-----------------|
${autoSelection.candidates.map((candidate) => `| ${candidate.rank}${candidate.selected ? " (selected)" : ""} | ${candidate.focusLabel} | ${candidate.strategyName} | ${candidate.totalReturn} | ${candidate.maxDrawdown} | ${candidate.winRate} | ${candidate.selectionScore} |`).join("\n")}

${autoSelection.reason}

` : ""}## Backtest Results
| Metric | Value |
|--------|-------|
| Total Return | ${backtestResult.backtest.totalReturn} |
| Win Rate | ${backtestResult.backtest.winRate} |
| Max Drawdown | ${backtestResult.backtest.maxDrawdown} |
| Number of Trades | ${backtestResult.backtest.numberOfTrades} |
| Average Trade Return | ${backtestResult.backtest.averageTradeReturn} |
| Best Trade | ${backtestResult.backtest.bestTrade} |
| Worst Trade | ${backtestResult.backtest.worstTrade} |
| Risk Adjusted Score | ${backtestResult.backtest.riskAdjustedScore} |
| Buy-and-Hold Benchmark | ${backtestResult.backtest.benchmarkReturn} |
| Outperformance vs Benchmark | ${backtestResult.backtest.alphaVsBenchmark} |
| Fee Assumption | ${backtestResult.backtest.feeAssumption} |
| Model Exposure | ${backtestResult.backtest.modelExposure} |

## Backtest Methodology
- Starting capital: ${backtestResult.backtest.startingCapital}
- Fees: ${backtestResult.backtest.feeAssumption}
- Model exposure: ${backtestResult.backtest.modelExposure}
- Buy-and-hold benchmark: token return over the same backtest window
- Candles analyzed: ${dataset.candles.length}
- Data snapshot: ${dataset.dataSnapshotAt || "Current request"}
- Snapshot policy: same symbol, timeframe, and lookback reuse one market snapshot briefly so repeated backtests remain consistent

## Signal Breakdown
| Signal | Score | Status | Reason |
|--------|-------|--------|--------|
${signals}

## LLM Skill Authorship
- Invocation name: beststrat.generate_strategy
- Skill role: repeatable LLM workflow for turning CMC market context into a backtestable strategy spec
- Required inputs: symbol, timeframe, lookbackDays, riskLevel, strategyFocus
- Required outputs: regime, rationale, rules, backtest, methodology, JSON, Markdown, CMC Skill output, LLM Skill output

## Strategy Skill Notes
- Product role: Quantopian-style crypto strategy generation Skill authored as an LLM Skill
- Output type: backtestable strategy specification
- Execution: none
- Wallet connection: none

---
Generated by BestStrat. Research strategy specification only. Not financial advice. No trade execution.`;
}
