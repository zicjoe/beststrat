import { generateStrategy, validateRequest } from "./generator.mjs";
import { CURATED_CATEGORIES, getAvailableCategories, resolveCategory } from "./tokenUniverse.mjs";

const allowedTimeframes = new Set(["5m", "15m", "1h", "4h", "1d"]);
const allowedRiskLevels = new Set(["conservative", "moderate", "aggressive"]);
const allowedFocus = new Set(["auto", "momentum", "sentiment_divergence", "regime_detection", "risk_off"]);

function parsePercent(value) {
  if (typeof value === "number") return value;
  return Number(String(value ?? "0").replace("%", "")) || 0;
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function focusLabel(focus) {
  const labels = {
    auto: "Auto Detect",
    momentum: "Momentum",
    risk_off: "Risk Off",
    sentiment_divergence: "Sentiment Divergence",
    regime_detection: "Regime Detection",
  };
  return labels[focus] || focus || "Strategy";
}

function buildScannerScore(strategy) {
  const totalReturn = parsePercent(strategy.backtest.totalReturn);
  const maxDrawdown = parsePercent(strategy.backtest.maxDrawdown);
  const winRate = parsePercent(strategy.backtest.winRate);
  const outperformance = parsePercent(strategy.backtest.alphaVsBenchmark);
  const riskScore = Number(strategy.backtest.riskAdjustedScore || 0);
  const confidence = Number(strategy.regimeConfidence || 0);
  const tradeCount = Number(strategy.backtest.numberOfTrades || 0);
  const tradePenalty = tradeCount === 0 ? 18 : tradeCount > 30 ? 5 : 0;

  const score =
    riskScore * 0.45 +
    totalReturn * 0.55 +
    outperformance * 0.22 +
    winRate * 0.12 +
    confidence * 0.08 -
    maxDrawdown * 2.8 -
    tradePenalty;

  return Math.round(Math.max(0, Math.min(100, score)));
}

async function mapLimit(items, limit, mapper) {
  const results = [];
  let index = 0;
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, async () => {
    while (index < items.length) {
      const currentIndex = index;
      index += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  });
  await Promise.all(workers);
  return results;
}

export function validateScannerRequest(body) {
  const categoryId = String(body?.categoryId ?? "popular").trim() || "popular";
  const timeframe = String(body?.timeframe ?? "1h");
  const lookbackDays = Number(body?.lookbackDays ?? 30);
  const riskLevel = String(body?.riskLevel ?? "moderate");
  const strategyFocus = String(body?.strategyFocus ?? "auto");
  const limit = Number(body?.limit ?? 10);

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
  if (!Number.isFinite(limit) || limit < 3 || limit > 15) {
    throw new Error("Scanner limit must be between 3 and 15.");
  }

  return { categoryId, timeframe, lookbackDays, riskLevel, strategyFocus, limit: Math.round(limit) };
}

export { getAvailableCategories };

function curatedFallbackCategory(reason) {
  const fallback = CURATED_CATEGORIES[0];
  return {
    ...fallback,
    symbols: [...new Set(fallback.symbols)],
    tokenCount: fallback.symbols.length,
    source: "curated",
    description: `${fallback.description} Fallback used because ${reason}`,
    fallbackReason: reason,
  };
}

async function resolveCategorySafely(categoryId, requestedLimit) {
  try {
    return await resolveCategory(categoryId, requestedLimit);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "the selected category could not be loaded";
    return curatedFallbackCategory(reason);
  }
}

export async function scanCategory(validatedRequest) {
  const category = await resolveCategorySafely(validatedRequest.categoryId, validatedRequest.limit);
  const scanSize = Math.max(1, Math.min(validatedRequest.limit, category.symbols.length));
  const symbolsToScan = [...new Set(category.symbols)].slice(0, scanSize);

  if (!symbolsToScan.length) {
    const fallback = curatedFallbackCategory("the selected category returned no token symbols");
    symbolsToScan.push(...fallback.symbols.slice(0, Math.max(validatedRequest.limit, 10)));
    category.id = fallback.id;
    category.name = fallback.name;
    category.source = fallback.source;
    category.description = fallback.description;
    category.tokenCount = fallback.tokenCount;
  }

  const scanned = await mapLimit(symbolsToScan, 3, async (symbol) => {
    try {
      const request = validateRequest({
        symbol,
        timeframe: validatedRequest.timeframe,
        lookbackDays: validatedRequest.lookbackDays,
        riskLevel: validatedRequest.riskLevel,
        strategyFocus: validatedRequest.strategyFocus,
      });
      const strategy = await generateStrategy(request);
      const scannerScore = buildScannerScore(strategy);
      return { ok: true, strategy, scannerScore };
    } catch (error) {
      return {
        ok: false,
        symbol,
        error: error instanceof Error ? error.message : "Strategy scan failed.",
      };
    }
  });

  const successful = scanned.filter((item) => item?.ok);
  const failed = scanned.filter((item) => item && !item.ok);
  const ranked = successful
    .sort((a, b) => b.scannerScore - a.scannerScore)
    .slice(0, validatedRequest.limit)
    .map((item, index) => {
      const strategy = item.strategy;
      return {
        rank: index + 1,
        symbol: strategy.symbol,
        categoryId: category.id,
        categoryName: category.name,
        inputFocus: strategy.strategyFocus,
        inputFocusLabel: focusLabel(strategy.strategyFocus),
        selectedFocus: strategy.selectedStrategyFocus || strategy.strategyFocus,
        selectedFocusLabel: focusLabel(strategy.selectedStrategyFocus || strategy.strategyFocus),
        selectedStrategy: strategy.strategyName,
        detectedRegime: strategy.detectedRegime,
        regimeConfidence: strategy.regimeConfidence,
        totalReturn: strategy.backtest.totalReturn,
        maxDrawdown: strategy.backtest.maxDrawdown,
        winRate: strategy.backtest.winRate,
        outperformance: strategy.backtest.alphaVsBenchmark || "0%",
        riskAdjustedScore: strategy.backtest.riskAdjustedScore,
        scannerScore: item.scannerScore,
        numberOfTrades: strategy.backtest.numberOfTrades,
        dataSource: strategy.meta?.dataSource || "Unknown",
        dataSnapshotAt: strategy.meta?.dataSnapshotAt || null,
        strategySummary: strategy.strategySummary,
        entryRules: strategy.entryRules.slice(0, 3),
        riskRules: strategy.riskRules.slice(0, 3),
        builderRequest: {
          symbol: strategy.symbol,
          timeframe: strategy.timeframe,
          lookbackDays: strategy.lookbackDays,
          riskLevel: strategy.riskLevel,
          strategyFocus: validatedRequest.strategyFocus,
        },
      };
    });

  const regimes = ranked.reduce((acc, row) => {
    acc[row.detectedRegime] = (acc[row.detectedRegime] || 0) + 1;
    return acc;
  }, {});

  const returns = ranked.map((row) => parsePercent(row.totalReturn));
  const drawdowns = ranked.map((row) => parsePercent(row.maxDrawdown));
  const scores = ranked.map((row) => Number(row.scannerScore || 0));

  return {
    id: `${category.id}:${validatedRequest.timeframe}:${validatedRequest.lookbackDays}:${validatedRequest.riskLevel}:${validatedRequest.strategyFocus}:${new Date().toISOString().slice(0, 16)}`,
    scannedAt: new Date().toISOString(),
    request: validatedRequest,
    category: {
      id: category.id,
      name: category.name,
      source: category.source,
      description: category.description,
      tokenCount: category.tokenCount || category.symbols.length,
      symbolsScanned: symbolsToScan,
      fallbackReason: category.fallbackReason || null,
    },
    summary: {
      resultCount: ranked.length,
      failedCount: failed.length,
      topSymbol: ranked[0]?.symbol || null,
      topStrategy: ranked[0]?.selectedStrategy || null,
      averageReturn: `${average(returns).toFixed(1)}%`,
      averageMaxDrawdown: `${average(drawdowns).toFixed(1)}%`,
      averageScannerScore: Math.round(average(scores)),
      regimeDistribution: regimes,
      note: "Ranks strategy candidates by historical simulation quality, not future token performance.",
    },
    results: ranked,
    failures: failed.map((item) => ({ symbol: item.symbol, error: item.error })).slice(0, 8),
    meta: {
      cmcApiConfigured: Boolean(process.env.CMC_API_KEY),
      source: category.source,
      categoryFallbackReason: category.fallbackReason || null,
      note: category.fallbackReason
        ? `Selected category fallback used: ${category.fallbackReason}`
        : "Scanner results are research outputs generated from historical simulations. They are not financial advice and do not execute trades.",
    },
  };
}
