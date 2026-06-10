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

function buildDecisionRationale(dataset, analysis, strategy) {
  const strongestSignals = [...analysis.signals]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((signal) => `${signal.name}: ${signal.status} (${signal.score})`);

  return [
    `${dataset.symbol} was classified as ${analysis.detectedRegime}, so BestStrat selected ${strategy.strategyName}.`,
    `The strongest supporting signals were ${strongestSignals.join(", ")}.`,
    `The generated rules are constrained by volatility, liquidity, invalidation, and no-trade conditions so the output stays backtestable instead of becoming a vague trading opinion.`,
  ];
}

export function buildJsonOutput(dataset, request, analysis, strategy, backtestResult) {
  return {
    strategySpec: {
      name: strategy.strategyName,
      version: "1.1.0",
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
      },
      regime: {
        name: analysis.detectedRegime,
        confidence: analysis.regimeConfidence,
        trendState: analysis.trendState,
        volatilityState: analysis.volatilityState,
        sentimentState: analysis.sentimentState,
        liquidityState: analysis.liquidityState,
      },
      decisionRationale: buildDecisionRationale(dataset, analysis, strategy),
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
      constraints: [
        "No wallet connection",
        "No live order execution",
        "No buy or sell transaction",
        "Research and strategy specification output only",
      ],
    },
  };
}

export function buildCmcSkillOutput(dataset, request, analysis, strategy, backtestResult) {
  return {
    skillType: "strategy_generation",
    skillVersion: "1.1.0",
    project: "BestStrat",
    track: "BNB Hack Track 2 Strategy Skill",
    cmcCompatible: true,
    purpose: "Turn CMC-style market data into a backtestable crypto strategy specification.",
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
    },
    output: {
      strategyName: strategy.strategyName,
      strategySummary: strategy.strategySummary,
      detectedRegime: analysis.detectedRegime,
      regimeConfidence: analysis.regimeConfidence,
      decisionRationale: buildDecisionRationale(dataset, analysis, strategy),
      entryRules: strategy.entryRules,
      exitRules: strategy.exitRules,
      riskRules: strategy.riskRules,
      invalidationRules: strategy.invalidationRules,
      noTradeConditions: strategy.noTradeConditions,
      positionSizing: strategy.positionSizing,
      backtest: backtestResult.backtest,
      signals: analysis.signals,
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

export function buildMarkdownReport(dataset, request, analysis, strategy, backtestResult) {
  const rules = (items) => items.map((item) => `- ${item}`).join("\n");
  const signals = analysis.signals.map((signal) => `| ${signal.name} | ${signal.score} | ${signal.status} | ${signal.reason} |`).join("\n");
  const rationale = buildDecisionRationale(dataset, analysis, strategy).map((line) => `- ${line}`).join("\n");

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

## Backtest Results
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

## Signal Breakdown
| Signal | Score | Status | Reason |
|--------|-------|--------|--------|
${signals}

## CMC Skill Submission Notes
- Track: BNB Hack Track 2 Strategy Skills
- Product role: Quantopian-style crypto strategy generation Skill
- Output type: backtestable strategy specification
- Execution: none
- Wallet connection: none

---
Generated by BestStrat. Research strategy specification only. Not financial advice. No trade execution.`;
}
