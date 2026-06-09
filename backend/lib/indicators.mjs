import { average } from "./utils.mjs";

export function ema(values, period) {
  if (!values.length) return [];
  const k = 2 / (period + 1);
  const output = [];
  let prev = values[0];
  for (let i = 0; i < values.length; i += 1) {
    const current = values[i];
    prev = i === 0 ? current : current * k + prev * (1 - k);
    output.push(prev);
  }
  return output;
}

export function sma(values, period) {
  return values.map((_, index) => {
    const start = Math.max(0, index - period + 1);
    return average(values.slice(start, index + 1));
  });
}

export function rsi(values, period = 14) {
  if (values.length < 2) return values.map(() => 50);
  const output = Array(values.length).fill(50);
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= Math.min(period, values.length - 1); i += 1) {
    const diff = values[i] - values[i - 1];
    gains += Math.max(diff, 0);
    losses += Math.max(-diff, 0);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < values.length; i += 1) {
    const diff = values[i] - values[i - 1];
    avgGain = (avgGain * (period - 1) + Math.max(diff, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-diff, 0)) / period;
    if (avgLoss === 0) {
      output[i] = 100;
    } else {
      const rs = avgGain / avgLoss;
      output[i] = 100 - 100 / (1 + rs);
    }
  }

  return output;
}

export function macd(values, fast = 12, slow = 26, signal = 9) {
  const fastEma = ema(values, fast);
  const slowEma = ema(values, slow);
  const macdLine = values.map((_, i) => fastEma[i] - slowEma[i]);
  const signalLine = ema(macdLine, signal);
  const histogram = macdLine.map((value, i) => value - signalLine[i]);
  return { macdLine, signalLine, histogram };
}

export function atr(candles, period = 14) {
  if (!candles.length) return [];
  const ranges = candles.map((candle, index) => {
    if (index === 0) return candle.high - candle.low;
    const prevClose = candles[index - 1].close;
    return Math.max(
      candle.high - candle.low,
      Math.abs(candle.high - prevClose),
      Math.abs(candle.low - prevClose)
    );
  });
  return ema(ranges, period);
}
