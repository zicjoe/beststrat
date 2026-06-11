import { randomUUID } from "node:crypto";
import { getMarketDataset } from "./marketData.mjs";
import { analyzeMarket } from "./regimeEngine.mjs";
import { buildStrategySpec } from "./strategyEngine.mjs";
import { runBacktest } from "./backtester.mjs";
import { buildCmcSkillOutput, buildDecisionRationale, buildJsonOutput, buildLlmSkillOutput, buildMarkdownReport, buildMarketSummary } from "./reportBuilder.mjs";
import { isoMinute } from "./utils.mjs";

const allowedTimeframes = new Set(["5m", "15m", "1h", "4h", "1d"]);
const allowedRiskLevels = new Set(["conservative", "moderate", "aggressive"]);
const allowedFocus = new Set(["auto", "momentum", "sentiment_divergence", "regime_detection", "risk_off"]);

export function validateRequest(body) {
  const symbol = String(body?.symbol ?? "").trim().toUpperCase();
  const timeframe = String(body?.timeframe ?? "1h");
  const lookbackDays = Number(body?.lookbackDays ?? 30);
  const riskLevel = String(body?.riskLevel ?? "moderate");
  const strategyFocus = String(body?.strategyFocus ?? "auto");

  if (!/^[A-Z0-9]{2,15}$/.test(symbol)) {
    throw new Error("Token symbol must be 2 to 15 uppercase letters or numbers.");
  }
  if (!allowedTimeframes.has(timeframe)) {
    throw new Error("Timeframe must be one of 5m, 15m, 1h, 4h, 1d.");
  }
  if (!Number.isFinite(lookbackDays) || lookbackDays < 7 || lookbackDays > 90) {
    throw new Error("Lookback days must be between 7 and 90.");
  }
  if (!allowedRiskLevels.has(riskLevel)) {
    throw new Error("Risk level must be conservative, moderate, or aggressive.");
  }
  if (!allowedFocus.has(strategyFocus)) {
    throw new Error("Strategy focus must be auto, momentum, sentiment_divergence, regime_detection, or risk_off.");
  }

  return { symbol, timeframe, lookbackDays, riskLevel, strategyFocus };
}

export async function generateStrategy(validatedRequest) {
  const dataset = await getMarketDataset(validatedRequest);
  const analysis = analyzeMarket(dataset, validatedRequest);
  const strategy = buildStrategySpec(dataset, analysis, validatedRequest);
  const backtestResult = runBacktest(dataset, analysis, validatedRequest);
  const jsonOutput = buildJsonOutput(dataset, validatedRequest, analysis, strategy, backtestResult);
  const cmcSkillOutput = buildCmcSkillOutput(dataset, validatedRequest, analysis, strategy, backtestResult);
  const markdownReport = buildMarkdownReport(dataset, validatedRequest, analysis, strategy, backtestResult);
  const llmSkillOutput = buildLlmSkillOutput(dataset, validatedRequest, analysis, strategy, backtestResult);
  const decisionRationale = buildDecisionRationale(dataset, analysis, strategy);

  return {
    id: randomUUID(),
    createdAt: isoMinute(),
    symbol: dataset.symbol,
    timeframe: validatedRequest.timeframe,
    lookbackDays: validatedRequest.lookbackDays,
    riskLevel: validatedRequest.riskLevel,
    strategyFocus: validatedRequest.strategyFocus,
    detectedRegime: analysis.detectedRegime,
    regimeConfidence: analysis.regimeConfidence,
    marketSummary: buildMarketSummary(dataset, analysis),
    trendState: analysis.trendState,
    volatilityState: analysis.volatilityState,
    sentimentState: analysis.sentimentState,
    liquidityState: analysis.liquidityState,
    strategyName: strategy.strategyName,
    strategySummary: strategy.strategySummary,
    entryRules: strategy.entryRules,
    exitRules: strategy.exitRules,
    riskRules: strategy.riskRules,
    invalidationRules: strategy.invalidationRules,
    positionSizing: strategy.positionSizing,
    noTradeConditions: strategy.noTradeConditions,
    decisionRationale,
    signals: analysis.signals,
    backtest: backtestResult.backtest,
    equityCurve: backtestResult.equityCurve,
    drawdownCurve: backtestResult.drawdownCurve,
    signalStrength: analysis.signals.map((signal) => ({ name: signal.name === "Fear & Greed" ? "F&G" : signal.name, value: signal.score })),
    jsonOutput,
    markdownReport,
    cmcSkillOutput,
    llmSkillOutput,
    meta: {
      dataSource: dataset.dataSource,
      dataProvider: dataset.dataProvider,
      cmcApiConfigured: dataset.cmcApiConfigured,
      cmcQuoteUsed: dataset.dataProvider === "cmc_latest_quote",
      fallbackReason: dataset.fallbackReason,
      candlesAnalyzed: dataset.candles.length,
      generatedAt: new Date().toISOString(),
      note: "Research strategy specification only. Not financial advice. No trade execution.",
    },
  };
}
