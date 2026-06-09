import { clamp, round, seededRandom, timeframeToMinutes } from "./utils.mjs";

const DEFAULT_PRICES = {
  BTC: 68000,
  ETH: 3600,
  BNB: 620,
  CAKE: 2.8,
  SOL: 150,
  USDT: 1,
  USDC: 1,
  DOGE: 0.14,
  LINK: 18,
  AVAX: 35,
  ADA: 0.45,
};

async function fetchCmcQuote(symbol) {
  const apiKey = process.env.CMC_API_KEY;
  if (!apiKey) return null;

  try {
    const url = new URL("https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest");
    url.searchParams.set("symbol", symbol);
    const response = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
        Accept: "application/json",
      },
    });
    if (!response.ok) return null;
    const payload = await response.json();
    const item = payload?.data?.[symbol]?.[0];
    const quote = item?.quote?.USD;
    if (!quote?.price) return null;
    return {
      price: Number(quote.price),
      volume24h: Number(quote.volume_24h ?? 0),
      percentChange24h: Number(quote.percent_change_24h ?? 0),
      percentChange7d: Number(quote.percent_change_7d ?? quote.percent_change_24h ?? 0),
      marketCap: Number(quote.market_cap ?? 0),
      dataSource: "CoinMarketCap latest quote + deterministic historical simulation",
    };
  } catch {
    return null;
  }
}

function buildSyntheticQuote(symbol, random) {
  const basePrice = DEFAULT_PRICES[symbol] ?? Math.max(0.03, 0.5 + random() * 85);
  const change24h = (random() - 0.48) * 12;
  const change7d = change24h * (1 + random() * 2) + (random() - 0.5) * 10;
  return {
    price: basePrice,
    volume24h: Math.round((10_000_000 + random() * 900_000_000) * (DEFAULT_PRICES[symbol] ? 1 : 0.2)),
    percentChange24h: change24h,
    percentChange7d: change7d,
    marketCap: Math.round(basePrice * (10_000_000 + random() * 500_000_000)),
    dataSource: "Deterministic sample market data",
  };
}

export async function getMarketDataset(request) {
  const symbol = request.symbol.trim().toUpperCase();
  const seed = `${symbol}:${request.timeframe}:${request.lookbackDays}:${request.riskLevel}:${request.strategyFocus}`;
  const random = seededRandom(seed);
  const cmcQuote = await fetchCmcQuote(symbol);
  const quote = cmcQuote ?? buildSyntheticQuote(symbol, random);

  const minutes = timeframeToMinutes(request.timeframe);
  const theoreticalCandles = Math.ceil((request.lookbackDays * 24 * 60) / minutes);
  const candleCount = clamp(theoreticalCandles, 80, 720);
  const trendBias = clamp((quote.percentChange7d || quote.percentChange24h || 0) / 100, -0.25, 0.25);
  const volatilityBase = 0.004 + random() * 0.018 + Math.abs(quote.percentChange24h) / 2500;
  const candles = [];
  let price = quote.price / (1 + trendBias || 1);
  const start = Date.now() - candleCount * minutes * 60 * 1000;

  for (let i = 0; i < candleCount; i += 1) {
    const progress = i / Math.max(1, candleCount - 1);
    const drift = trendBias / candleCount;
    const cycle = Math.sin(progress * Math.PI * 4 + random() * 0.6) * volatilityBase * 0.35;
    const shock = (random() - 0.5) * volatilityBase * 1.8;
    const open = price;
    const close = Math.max(0.000001, open * (1 + drift + cycle + shock));
    const wick = Math.abs(shock) + volatilityBase * (0.4 + random());
    const high = Math.max(open, close) * (1 + wick);
    const low = Math.min(open, close) * (1 - wick * 0.85);
    const volumeBase = quote.volume24h / Math.max(1, 1440 / minutes);
    const volume = Math.max(1000, volumeBase * (0.55 + random() * 1.35 + Math.abs(shock) * 15));
    candles.push({
      time: new Date(start + i * minutes * 60 * 1000).toISOString(),
      open: round(open, 8),
      high: round(high, 8),
      low: round(low, 8),
      close: round(close, 8),
      volume: round(volume, 2),
    });
    price = close;
  }

  const sentimentScore = clamp(50 + quote.percentChange24h * 2.2 + (random() - 0.5) * 24, 5, 95);
  const fearGreedScore = clamp(50 + quote.percentChange7d * 1.4 + (random() - 0.5) * 26, 5, 95);
  const socialHeatScore = clamp(sentimentScore + (random() - 0.5) * 28, 5, 95);
  const liquidityScore = clamp(35 + Math.log10(Math.max(quote.volume24h, 1000)) * 8 + random() * 12, 15, 98);

  return {
    symbol,
    quote,
    candles,
    sentimentScore: round(sentimentScore, 1),
    fearGreedScore: round(fearGreedScore, 1),
    socialHeatScore: round(socialHeatScore, 1),
    liquidityScore: round(liquidityScore, 1),
    dataSource: quote.dataSource,
  };
}
