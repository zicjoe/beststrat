import { round, toPercent } from "./utils.mjs";

function riskAllocation(riskLevel) {
  if (riskLevel === "conservative") return 0.35;
  if (riskLevel === "aggressive") return 0.75;
  return 0.55;
}

function shouldEnter(index, candles, analysis) {
  const close = candles[index].close;
  const ema20 = analysis.indicators.ema20[index];
  const ema50 = analysis.indicators.ema50[index];
  const rsi = analysis.indicators.rsi14[index];
  const macd = analysis.indicators.macdValues.macdLine[index];
  const signal = analysis.indicators.macdValues.signalLine[index];
  const volume = candles[index].volume;
  const avgVolume = analysis.indicators.volumeSma[index] || volume;
  const regime = analysis.detectedRegime;

  if (regime === "Risk Off") {
    return close > ema20 && close > ema50 && rsi > 52 && macd > signal && volume > avgVolume * 1.15;
  }

  if (regime === "Sentiment Divergence") {
    return close > ema20 && rsi > 50 && rsi < 72 && volume > avgVolume * 1.05 && macd > signal;
  }

  if (regime === "Range / Mixed") {
    const previous = candles[Math.max(0, index - 4)]?.close ?? close;
    return close > previous && close > ema20 * 0.995 && rsi > 42 && rsi < 62;
  }

  return close > ema20 && ema20 >= ema50 * 0.995 && rsi >= 50 && rsi <= 72 && macd > signal && volume > avgVolume;
}

function shouldExit(index, candles, analysis, entryPrice) {
  const close = candles[index].close;
  const ema20 = analysis.indicators.ema20[index];
  const rsi = analysis.indicators.rsi14[index];
  const macd = analysis.indicators.macdValues.macdLine[index];
  const signal = analysis.indicators.macdValues.signalLine[index];
  const atr = analysis.indicators.atr14[index] || 0;
  const trailingStop = entryPrice * 0.94;
  const volatilityStop = entryPrice - atr * 2.4;

  if (close < Math.max(trailingStop, volatilityStop)) return true;
  if (close < ema20) return true;
  if (rsi < 48) return true;
  if (macd < signal) return true;
  return false;
}

function sampleCurve(points, maxPoints = 18) {
  if (points.length <= maxPoints) return points;
  const step = Math.max(1, Math.floor(points.length / maxPoints));
  const sampled = [];
  for (let i = 0; i < points.length; i += step) sampled.push(points[i]);
  const lastPoint = points[points.length - 1];
  if (sampled[sampled.length - 1] !== lastPoint) sampled.push(lastPoint);
  return sampled;
}


function evidenceTimeLabel(time) {
  if (!time) return "—";
  const value = String(time);
  if (value.includes("T")) {
    return value.replace("T", " ").slice(0, 16);
  }
  return value;
}

function entryReason(analysis) {
  if (analysis.detectedRegime === "Risk Off") return "Risk-off filter passed: trend, momentum, and volume confirmed a capital-preservation entry.";
  if (analysis.detectedRegime === "Sentiment Divergence") return "Divergence filter passed: price momentum improved while sentiment risk remained controlled.";
  if (analysis.detectedRegime === "Range / Mixed") return "Range setup passed: price recovered near the moving average with RSI inside the acceptable band.";
  return "Momentum confirmed: price held above trend filters with RSI, MACD, and volume support.";
}

function exitReason(index, candles, analysis, entryPrice) {
  const close = candles[index].close;
  const ema20 = analysis.indicators.ema20[index];
  const rsi = analysis.indicators.rsi14[index];
  const macd = analysis.indicators.macdValues.macdLine[index];
  const signal = analysis.indicators.macdValues.signalLine[index];
  const atr = analysis.indicators.atr14[index] || 0;
  const trailingStop = entryPrice * 0.94;
  const volatilityStop = entryPrice - atr * 2.4;

  if (close < Math.max(trailingStop, volatilityStop)) return "Exit: stop or volatility protection rule triggered.";
  if (close < ema20) return "Exit: price lost EMA 20 trend support.";
  if (rsi < 48) return "Exit: RSI weakened below the strategy threshold.";
  if (macd < signal) return "Exit: MACD momentum weakened below the signal line.";
  return "Exit: strategy close condition reached.";
}

function buildTradeLedger(trades) {
  const rows = [];
  let tradeNumber = 0;
  let openTradeNumber = 0;

  for (const trade of trades) {
    if (trade.type === "entry") {
      tradeNumber += 1;
      openTradeNumber = tradeNumber;
      rows.push({
        id: `${tradeNumber}-entry`,
        tradeNumber,
        action: "Entry",
        time: evidenceTimeLabel(trade.time),
        price: round(trade.price, 6),
        reason: trade.reason || "Entry condition met.",
        pnl: "—",
        equity: round(trade.equity ?? 0, 2),
      });
    } else {
      const number = openTradeNumber || tradeNumber || 1;
      rows.push({
        id: `${number}-exit-${rows.length}`,
        tradeNumber: number,
        action: "Exit",
        time: evidenceTimeLabel(trade.time),
        price: round(trade.price, 6),
        reason: trade.reason || "Exit condition met.",
        pnl: toPercent(trade.pnlPct ?? 0),
        equity: round(trade.equity ?? 0, 2),
      });
      openTradeNumber = 0;
    }
  }

  return rows;
}

function buildPriceChart(candles, trades, maxPoints = 120) {
  const tradeByTime = new Map();
  for (const trade of trades) {
    const existing = tradeByTime.get(trade.time) || [];
    existing.push(trade);
    tradeByTime.set(trade.time, existing);
  }

  const step = Math.max(1, Math.floor(candles.length / maxPoints));
  const points = [];
  for (let i = 0; i < candles.length; i += 1) {
    const candle = candles[i];
    const hasTrade = tradeByTime.has(candle.time);
    const shouldInclude = i === 0 || i === candles.length - 1 || i % step === 0 || hasTrade;
    if (!shouldInclude) continue;

    const point = {
      time: evidenceTimeLabel(candle.time),
      price: round(candle.close, 6),
      high: round(candle.high, 6),
      low: round(candle.low, 6),
      volume: round(candle.volume, 0),
      entryPrice: null,
      exitPrice: null,
      action: null,
      reason: null,
    };

    const tradeList = tradeByTime.get(candle.time) || [];
    const entry = tradeList.find((trade) => trade.type === "entry");
    const exit = tradeList.find((trade) => trade.type === "exit");
    if (entry) {
      point.entryPrice = round(entry.price, 6);
      point.action = "Entry";
      point.reason = entry.reason || "Entry condition met.";
    }
    if (exit) {
      point.exitPrice = round(exit.price, 6);
      point.action = point.action ? `${point.action} / Exit` : "Exit";
      point.reason = exit.reason || point.reason || "Exit condition met.";
    }

    points.push(point);
  }

  return points;
}

export function runBacktest(dataset, analysis, request) {
  const candles = dataset.candles;
  const feeRate = 0.001;
  const allocation = riskAllocation(request.riskLevel);
  let cash = 1000;
  let units = 0;
  let entryPrice = 0;
  let invested = 0;
  let peak = 1000;
  let maxDrawdown = 0;
  const trades = [];
  const equity = [];
  const drawdowns = [];

  for (let i = 55; i < candles.length; i += 1) {
    const candle = candles[i];
    const price = candle.close;
    const portfolioValue = cash + units * price;

    if (!units && shouldEnter(i, candles, analysis)) {
      invested = portfolioValue * allocation;
      const net = invested * (1 - feeRate);
      units = net / price;
      cash = portfolioValue - invested;
      entryPrice = price;
      trades.push({ type: "entry", price, time: candle.time, value: invested, equity: round(portfolioValue, 2), reason: entryReason(analysis) });
    } else if (units && shouldExit(i, candles, analysis, entryPrice)) {
      const gross = units * price;
      const net = gross * (1 - feeRate);
      const pnlPct = ((net - invested) / invested) * 100;
      cash += net;
      trades.push({ type: "exit", price, time: candle.time, pnlPct, equity: round(cash, 2), reason: exitReason(i, candles, analysis, entryPrice) });
      units = 0;
      invested = 0;
      entryPrice = 0;
    }

    const value = cash + units * price;
    peak = Math.max(peak, value);
    const dd = peak ? ((value - peak) / peak) * 100 : 0;
    maxDrawdown = Math.min(maxDrawdown, dd);
    equity.push({ time: candle.time, value: round(value, 2) });
    drawdowns.push({ time: candle.time, value: round(dd, 2) });
  }

  if (units) {
    const finalCandle = candles[candles.length - 1];
    const gross = units * finalCandle.close;
    const net = gross * (1 - feeRate);
    const pnlPct = ((net - invested) / invested) * 100;
    cash += net;
    trades.push({ type: "exit", price: finalCandle.close, time: finalCandle.time, pnlPct, equity: round(cash, 2), reason: "Exit: closing remaining simulated position at the end of the backtest window." });
  }

  const finalValue = cash;
  const completedTrades = trades.filter((trade) => trade.type === "exit");
  const wins = completedTrades.filter((trade) => trade.pnlPct > 0);
  const pnlValues = completedTrades.map((trade) => trade.pnlPct);
  const totalReturn = ((finalValue - 1000) / 1000) * 100;
  const firstBacktestClose = candles[55]?.close ?? candles[0]?.close ?? 1;
  const finalBacktestClose = candles[candles.length - 1]?.close ?? firstBacktestClose;
  const benchmarkReturn = firstBacktestClose ? ((finalBacktestClose - firstBacktestClose) / firstBacktestClose) * 100 : 0;
  const alphaVsBenchmark = totalReturn - benchmarkReturn;
  const modelExposure = `${round(allocation * 100, 0)}%`;
  const avgTrade = pnlValues.length ? pnlValues.reduce((sum, value) => sum + value, 0) / pnlValues.length : 0;
  const bestTrade = pnlValues.length ? Math.max(...pnlValues) : 0;
  const worstTrade = pnlValues.length ? Math.min(...pnlValues) : 0;
  const winRate = completedTrades.length ? (wins.length / completedTrades.length) * 100 : 0;
  const riskAdjustedScore = Math.max(0, Math.min(100, Math.round(55 + totalReturn * 1.4 + maxDrawdown * 2.1 + winRate * 0.2)));

  const equityCurve = sampleCurve(equity).map((point, index) => ({
    time: `Point ${index + 1}`,
    value: point.value,
  }));
  const drawdownCurve = sampleCurve(drawdowns).map((point, index) => ({
    time: `Point ${index + 1}`,
    value: point.value,
  }));
  const tradeLedger = buildTradeLedger(trades);
  const priceChart = buildPriceChart(candles, trades);

  return {
    backtest: {
      totalReturn: toPercent(totalReturn),
      winRate: `${round(winRate, 0)}%`,
      maxDrawdown: toPercent(Math.abs(maxDrawdown)),
      numberOfTrades: completedTrades.length,
      averageTradeReturn: toPercent(avgTrade),
      bestTrade: toPercent(bestTrade),
      worstTrade: toPercent(worstTrade),
      riskAdjustedScore,
      benchmarkReturn: toPercent(benchmarkReturn),
      alphaVsBenchmark: toPercent(alphaVsBenchmark),
      feeAssumption: "0.10% per entry or exit",
      startingCapital: "$1,000 simulated",
      modelExposure,
    },
    equityCurve,
    drawdownCurve,
    priceChart,
    tradeLedger,
    tradeLog: trades,
    evidence: {
      candlesTested: Math.max(0, candles.length - 55),
      candleWindow: `${candles[55]?.time ?? candles[0]?.time ?? "start"} → ${candles[candles.length - 1]?.time ?? "end"}`,
      pricePointsPlotted: priceChart.length,
      tradeLedgerRows: tradeLedger.length,
    },
    raw: {
      totalReturn,
      winRate,
      maxDrawdown: Math.abs(maxDrawdown),
      avgTrade,
      bestTrade,
      worstTrade,
      benchmarkReturn,
      alphaVsBenchmark,
      feeRate,
      modelExposure,
    },
  };
}
