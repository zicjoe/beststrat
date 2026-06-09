import { ema, rsi, macd, atr, sma } from "./indicators.mjs";
import { clamp, last, normalizeScore, round } from "./utils.mjs";

function labelFromScore(score, positiveLabel = "Bullish", neutralLabel = "Neutral", negativeLabel = "Bearish") {
  if (score >= 65) return positiveLabel;
  if (score <= 40) return negativeLabel;
  return neutralLabel;
}

export function analyzeMarket(dataset, request) {
  const closes = dataset.candles.map((c) => c.close);
  const volumes = dataset.candles.map((c) => c.volume);
  const ema20 = ema(closes, 20);
  const ema50 = ema(closes, 50);
  const rsi14 = rsi(closes, 14);
  const macdValues = macd(closes);
  const atr14 = atr(dataset.candles, 14);
  const volumeSma = sma(volumes, 20);

  const close = last(closes, 0);
  const currentEma20 = last(ema20, close);
  const currentEma50 = last(ema50, close);
  const currentRsi = last(rsi14, 50);
  const currentMacd = last(macdValues.macdLine, 0);
  const currentSignal = last(macdValues.signalLine, 0);
  const currentAtr = last(atr14, 0);
  const currentVolume = last(volumes, 0);
  const currentAvgVolume = last(volumeSma, currentVolume);
  const volumeRatio = currentAvgVolume ? currentVolume / currentAvgVolume : 1;
  const atrPct = close ? (currentAtr / close) * 100 : 0;

  const trendScore = clamp(
    50 +
      ((close - currentEma20) / close) * 900 +
      ((currentEma20 - currentEma50) / close) * 1100 +
      (dataset.quote.percentChange24h ?? 0) * 2,
    0,
    100
  );
  const rsiScore = clamp(100 - Math.abs(currentRsi - 60) * 2.3, 0, 100);
  const macdScore = clamp(50 + ((currentMacd - currentSignal) / Math.max(close * 0.002, 0.000001)) * 20, 0, 100);
  const volumeScore = clamp(45 + (volumeRatio - 1) * 45, 0, 100);
  const volatilityScore = clamp(100 - normalizeScore(atrPct, 0.4, 9), 0, 100);
  const sentimentScore = dataset.sentimentScore;
  const fearGreedScore = dataset.fearGreedScore;
  const liquidityScore = dataset.liquidityScore;

  const socialHeatHigh = dataset.socialHeatScore > 68;
  const weakFlow = volumeScore < 45 || trendScore < 45;
  const momentumScore = round(trendScore * 0.32 + rsiScore * 0.18 + macdScore * 0.18 + volumeScore * 0.17 + sentimentScore * 0.15, 1);
  const riskOffScore = round((100 - trendScore) * 0.38 + (100 - volatilityScore) * 0.25 + (100 - sentimentScore) * 0.2 + (100 - liquidityScore) * 0.17, 1);
  const divergenceScore = round((socialHeatHigh ? dataset.socialHeatScore : 30) * 0.45 + (weakFlow ? 80 : 35) * 0.35 + (100 - liquidityScore) * 0.2, 1);

  let detectedRegime = "Regime Detection";
  let confidence = clamp(Math.max(momentumScore, riskOffScore, divergenceScore, 55), 52, 95);

  if (request.strategyFocus === "momentum") {
    detectedRegime = "Momentum";
    confidence = clamp(momentumScore, 55, 94);
  } else if (request.strategyFocus === "sentiment_divergence") {
    detectedRegime = "Sentiment Divergence";
    confidence = clamp(divergenceScore, 55, 92);
  } else if (request.strategyFocus === "risk_off") {
    detectedRegime = "Risk Off";
    confidence = clamp(riskOffScore, 55, 94);
  } else if (riskOffScore >= 68) {
    detectedRegime = "Risk Off";
    confidence = clamp(riskOffScore, 60, 95);
  } else if (divergenceScore >= 66 && socialHeatHigh && weakFlow) {
    detectedRegime = "Sentiment Divergence";
    confidence = clamp(divergenceScore, 58, 92);
  } else if (momentumScore >= 58 && trendScore > 52) {
    detectedRegime = "Momentum";
    confidence = clamp(momentumScore, 58, 94);
  } else {
    detectedRegime = "Range / Mixed";
    confidence = clamp(58 + Math.abs(trendScore - 50) * 0.25, 52, 82);
  }

  const trendState = labelFromScore(trendScore, "Bullish", "Mixed", "Bearish");
  const volatilityState = volatilityScore >= 70 ? "Controlled" : volatilityScore <= 42 ? "High" : "Moderate";
  const sentimentState = labelFromScore(sentimentScore, "Positive", "Neutral", "Negative");
  const liquidityState = liquidityScore >= 68 ? "High" : liquidityScore <= 42 ? "Low" : "Moderate";

  const signals = [
    {
      name: "RSI",
      score: Math.round(rsiScore),
      status: currentRsi >= 50 && currentRsi <= 72 ? "Bullish" : currentRsi > 72 ? "Overheated" : "Weak",
      reason: `RSI is ${round(currentRsi, 1)}, ${currentRsi > 72 ? "suggesting overheated momentum" : currentRsi >= 50 ? "showing constructive momentum" : "showing weak momentum"}.`,
    },
    {
      name: "MACD",
      score: Math.round(macdScore),
      status: currentMacd > currentSignal ? "Bullish" : "Bearish",
      reason: currentMacd > currentSignal ? "MACD is above its signal line." : "MACD is below its signal line.",
    },
    {
      name: "Volume",
      score: Math.round(volumeScore),
      status: volumeRatio > 1.08 ? "Strong" : volumeRatio < 0.85 ? "Weak" : "Neutral",
      reason: `Latest volume is ${round(volumeRatio, 2)}x its 20-candle average.`,
    },
    {
      name: "Fear & Greed",
      score: Math.round(fearGreedScore),
      status: fearGreedScore >= 65 ? "Positive" : fearGreedScore <= 35 ? "Negative" : "Neutral",
      reason: `Fear and Greed proxy score is ${round(fearGreedScore, 1)} from the market dataset.`,
    },
    {
      name: "Sentiment",
      score: Math.round(sentimentScore),
      status: sentimentState,
      reason: `Sentiment proxy score is ${round(sentimentScore, 1)}, derived from quote momentum and market context.`,
    },
    {
      name: "Volatility",
      score: Math.round(volatilityScore),
      status: volatilityState,
      reason: `ATR is ${round(atrPct, 2)}% of price, so volatility is ${volatilityState.toLowerCase()}.`,
    },
    {
      name: "Regime",
      score: Math.round(confidence),
      status: detectedRegime,
      reason: `Composite regime model classified ${dataset.symbol} as ${detectedRegime}.`,
    },
  ];

  return {
    indicators: { ema20, ema50, rsi14, macdValues, atr14, volumeSma },
    current: {
      close,
      currentEma20,
      currentEma50,
      currentRsi,
      currentMacd,
      currentSignal,
      currentAtr,
      volumeRatio,
      atrPct,
    },
    scores: {
      trendScore,
      rsiScore,
      macdScore,
      volumeScore,
      volatilityScore,
      sentimentScore,
      fearGreedScore,
      liquidityScore,
      momentumScore,
      riskOffScore,
      divergenceScore,
    },
    detectedRegime,
    regimeConfidence: Math.round(confidence),
    trendState,
    volatilityState,
    sentimentState,
    liquidityState,
    signals,
  };
}
