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

const autoCandidateFocuses = ["momentum", "risk_off", "sentiment_divergence", "regime_detection"];

function focusLabel(focus) {
  const labels = {
    momentum: "Momentum",
    risk_off: "Risk Off",
    sentiment_divergence: "Sentiment Divergence",
    regime_detection: "Regime Detection",
  };
  return labels[focus] || focus;
}

function parsePercent(value) {
  if (typeof value === "number") return value;
  return Number(String(value ?? "0").replace("%", "")) || 0;
}

function scoreCandidate(candidate) {
  const totalReturn = candidate.backtestResult.raw.totalReturn;
  const maxDrawdown = candidate.backtestResult.raw.maxDrawdown;
  const winRate = candidate.backtestResult.raw.winRate;
  const riskAdjustedScore = candidate.backtestResult.backtest.riskAdjustedScore;
  const trades = candidate.backtestResult.backtest.numberOfTrades;
  const confidence = candidate.analysis.regimeConfidence;
  const benchmarkReturn = parsePercent(candidate.backtestResult.backtest.benchmarkReturn);
  const alpha = totalReturn - benchmarkReturn;
  const tradePenalty = trades === 0 ? 18 : trades > 30 ? 4 : 0;
  const drawdownPenalty = maxDrawdown * 3.2;
  const score =
    50 +
    totalReturn * 0.55 +
    alpha * 0.2 +
    winRate * 0.08 +
    riskAdjustedScore * 0.25 +
    confidence * 0.05 -
    drawdownPenalty -
    tradePenalty;
  return Math.round(Math.max(0, score));
}

function buildAutoCandidate(dataset, baseRequest, focus) {
  const request = { ...baseRequest, strategyFocus: focus };
  const analysis = analyzeMarket(dataset, request);
  const strategy = buildStrategySpec(dataset, analysis, request);
  const backtestResult = runBacktest(dataset, analysis, request);
  const selectionScore = scoreCandidate({ analysis, strategy, backtestResult });
  return { request, analysis, strategy, backtestResult, selectionScore };
}

function buildAutoSelection(candidates, selected) {
  const sorted = [...candidates].sort((a, b) => b.selectionScore - a.selectionScore);
  const selectedIndex = sorted.findIndex((candidate) => candidate.request.strategyFocus === selected.request.strategyFocus);
  return {
    enabled: true,
    selectedFocus: selected.request.strategyFocus,
    selectedFocusLabel: focusLabel(selected.request.strategyFocus),
    selectedStrategy: selected.strategy.strategyName,
    selectedRegime: selected.analysis.detectedRegime,
    selectionScore: selected.selectionScore,
    reason: `${selected.strategy.strategyName} was selected because it produced the strongest risk-adjusted candidate score after comparing return, max drawdown, win rate, outperformance vs benchmark, and regime confidence.`,
    candidates: sorted.map((candidate, index) => ({
      rank: index + 1,
      focus: candidate.request.strategyFocus,
      focusLabel: focusLabel(candidate.request.strategyFocus),
      regime: candidate.analysis.detectedRegime,
      strategyName: candidate.strategy.strategyName,
      totalReturn: candidate.backtestResult.backtest.totalReturn,
      maxDrawdown: candidate.backtestResult.backtest.maxDrawdown,
      winRate: candidate.backtestResult.backtest.winRate,
      riskAdjustedScore: candidate.backtestResult.backtest.riskAdjustedScore,
      alphaVsBenchmark: candidate.backtestResult.backtest.alphaVsBenchmark,
      selectionScore: candidate.selectionScore,
      selected: candidate.request.strategyFocus === selected.request.strategyFocus,
    })),
    note: selectedIndex === 0 ? "Auto Detect selected the top-ranked candidate." : "Auto Detect reviewed all candidates and selected the strongest candidate after risk adjustment.",
  };
}

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
  let effectiveRequest = validatedRequest;
  let analysis;
  let strategy;
  let backtestResult;
  let autoSelection = null;

  if (validatedRequest.strategyFocus === "auto") {
    const candidates = autoCandidateFocuses.map((focus) => buildAutoCandidate(dataset, validatedRequest, focus));
    const selected = [...candidates].sort((a, b) => b.selectionScore - a.selectionScore)[0];
    effectiveRequest = { ...validatedRequest, strategyFocus: selected.request.strategyFocus };
    analysis = selected.analysis;
    strategy = selected.strategy;
    backtestResult = selected.backtestResult;
    autoSelection = buildAutoSelection(candidates, selected);
  } else {
    analysis = analyzeMarket(dataset, validatedRequest);
    strategy = buildStrategySpec(dataset, analysis, validatedRequest);
    backtestResult = runBacktest(dataset, analysis, validatedRequest);
  }

  const jsonOutput = buildJsonOutput(dataset, validatedRequest, analysis, strategy, backtestResult, autoSelection);
  const cmcSkillOutput = buildCmcSkillOutput(dataset, validatedRequest, analysis, strategy, backtestResult, autoSelection);
  const markdownReport = buildMarkdownReport(dataset, validatedRequest, analysis, strategy, backtestResult, autoSelection);
  const llmSkillOutput = buildLlmSkillOutput(dataset, validatedRequest, analysis, strategy, backtestResult, autoSelection);
  const decisionRationale = buildDecisionRationale(dataset, analysis, strategy, autoSelection);

  return {
    id: randomUUID(),
    createdAt: isoMinute(),
    symbol: dataset.symbol,
    timeframe: validatedRequest.timeframe,
    lookbackDays: validatedRequest.lookbackDays,
    riskLevel: validatedRequest.riskLevel,
    strategyFocus: validatedRequest.strategyFocus,
    selectedStrategyFocus: effectiveRequest.strategyFocus,
    autoSelection,
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
      dataSnapshotAt: dataset.dataSnapshotAt,
      cacheHit: Boolean(dataset.cache?.hit),
      cachePolicy: dataset.cache?.policy,
      cacheExpiresAt: dataset.cache?.expiresAt,
      generatedAt: new Date().toISOString(),
      note: "Research strategy specification only. Not financial advice. No trade execution.",
    },
  };
}
