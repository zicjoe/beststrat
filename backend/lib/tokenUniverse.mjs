const CMC_BASE_URL = "https://pro-api.coinmarketcap.com";

export const CURATED_CATEGORIES = [
  {
    id: "popular",
    name: "Popular Assets",
    source: "curated",
    description: "Major assets commonly used for broad market strategy research.",
    symbols: ["BTC", "ETH", "BNB", "SOL", "XRP", "ADA", "DOGE", "AVAX", "LINK", "DOT", "LTC", "BCH"],
  },
  {
    id: "bnb-ecosystem",
    name: "BNB Ecosystem",
    source: "curated",
    description: "Tokens commonly associated with BNB Chain and BNB ecosystem workflows.",
    symbols: ["BNB", "CAKE", "TWT", "FDUSD", "XVS", "BAKE", "ALPACA", "1INCH", "SUSHI", "USDT", "USDC"],
  },
  {
    id: "defi",
    name: "DeFi",
    source: "curated",
    description: "Decentralized finance assets suitable for strategy comparison.",
    symbols: ["CAKE", "UNI", "AAVE", "COMP", "SUSHI", "1INCH", "LDO", "PENDLE", "INJ", "SNX", "YFI"],
  },
  {
    id: "layer-1",
    name: "Layer 1",
    source: "curated",
    description: "Layer 1 networks and base-chain assets.",
    symbols: ["BTC", "ETH", "BNB", "SOL", "ADA", "AVAX", "DOT", "TON", "ATOM", "TRX", "NEAR"],
  },
  {
    id: "ai",
    name: "AI & Agents",
    source: "curated",
    description: "AI, agents, data, and compute themed crypto assets.",
    symbols: ["FET", "NEAR", "GRT", "RNDR", "TAO", "AI", "AGIX", "OCEAN", "ARKM", "NMR"],
  },
  {
    id: "meme",
    name: "Meme",
    source: "curated",
    description: "Meme assets for high-volatility strategy research.",
    symbols: ["DOGE", "SHIB", "FLOKI", "PEPE", "BONK", "WIF", "BRETT", "TOSHI", "CHEEMS", "BABYDOGE"],
  },
  {
    id: "stablecoins",
    name: "Stablecoins",
    source: "curated",
    description: "Stablecoin assets for defensive or benchmark-style strategy research.",
    symbols: ["USDT", "USDC", "DAI", "FDUSD", "TUSD", "USDD", "FRAX", "USDE"],
  },
];

function normalizeSymbol(symbol) {
  return String(symbol || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function uniqueSymbols(symbols) {
  return [...new Set(symbols.map(normalizeSymbol).filter(Boolean))];
}

function getApiKey() {
  return process.env.CMC_API_KEY;
}

async function fetchCmc(path, params = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("CMC_API_KEY is not configured.");
  }

  const url = new URL(path, CMC_BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, {
    headers: {
      "X-CMC_PRO_API_KEY": apiKey,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`CoinMarketCap request failed with status ${response.status}.`);
  }

  return response.json();
}

export async function getAvailableCategories() {
  const curated = CURATED_CATEGORIES.map((category) => ({
    id: category.id,
    name: category.name,
    source: "curated",
    description: category.description,
    tokenCount: category.symbols.length,
    symbols: category.symbols,
  }));

  if (!getApiKey()) {
    return {
      categories: curated,
      meta: {
        cmcApiConfigured: false,
        source: "curated",
        note: "CMC_API_KEY is not configured. Showing curated categories.",
      },
    };
  }

  try {
    const payload = await fetchCmc("/v1/cryptocurrency/categories", { start: 1, limit: 60 });
    const cmcCategories = (payload?.data || [])
      .filter((item) => item?.id && item?.name)
      .slice(0, 40)
      .map((item) => ({
        id: `cmc:${item.id}`,
        cmcId: item.id,
        name: item.name,
        source: "coinmarketcap",
        description: item.title || item.name,
        tokenCount: Number(item.num_tokens || item.num_tokens || 0),
        marketCap: item.market_cap ? Number(item.market_cap) : undefined,
        volume24h: item.volume ? Number(item.volume) : undefined,
      }));

    return {
      categories: [...curated, ...cmcCategories],
      meta: {
        cmcApiConfigured: true,
        source: cmcCategories.length ? "coinmarketcap+curated" : "curated",
        note: cmcCategories.length
          ? "Using curated categories plus CoinMarketCap categories."
          : "CoinMarketCap category list returned no categories. Showing curated categories.",
      },
    };
  } catch (error) {
    return {
      categories: curated,
      meta: {
        cmcApiConfigured: true,
        source: "curated",
        note: error instanceof Error ? `CMC categories unavailable: ${error.message}` : "CMC categories unavailable. Showing curated categories.",
      },
    };
  }
}

async function getCmcCategorySymbols(cmcId, requestedLimit) {
  const payload = await fetchCmc("/v1/cryptocurrency/category", {
    id: cmcId,
    start: 1,
    limit: Math.max(10, Math.min(50, Number(requestedLimit || 10) + 10)),
    convert: "USD",
  });

  const category = payload?.data;
  const coins = category?.coins || category?.cryptocurrencies || [];
  const symbols = uniqueSymbols(coins.map((coin) => coin?.symbol));

  return {
    id: `cmc:${cmcId}`,
    name: category?.name || category?.title || "CoinMarketCap Category",
    source: "coinmarketcap",
    description: category?.title || category?.name || "CoinMarketCap category token universe.",
    symbols,
    tokenCount: symbols.length,
  };
}

export async function resolveCategory(categoryId, requestedLimit = 10) {
  const normalized = String(categoryId || "popular").trim();

  if (normalized.startsWith("cmc:")) {
    const cmcId = normalized.slice(4);
    if (!cmcId) throw new Error("Invalid CoinMarketCap category id.");
    const category = await getCmcCategorySymbols(cmcId, requestedLimit);
    if (!category.symbols.length) {
      throw new Error("CoinMarketCap category returned no token symbols.");
    }
    return category;
  }

  const curated = CURATED_CATEGORIES.find((category) => category.id === normalized) || CURATED_CATEGORIES[0];
  return {
    ...curated,
    symbols: uniqueSymbols(curated.symbols),
    tokenCount: curated.symbols.length,
  };
}
