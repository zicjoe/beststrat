export interface TokenOption {
  symbol: string;
  name: string;
  category: "Major" | "BNB Chain" | "DeFi" | "Stablecoin" | "Layer 1" | "Meme" | "Oracle" | "Lending";
  tags: string[];
  popular?: boolean;
}

export const TOKEN_OPTIONS: TokenOption[] = [
  { symbol: "BTC", name: "Bitcoin", category: "Major", tags: ["bitcoin", "store of value", "market leader"], popular: true },
  { symbol: "ETH", name: "Ethereum", category: "Major", tags: ["ethereum", "smart contracts", "l1"], popular: true },
  { symbol: "BNB", name: "BNB", category: "BNB Chain", tags: ["bnb chain", "gas", "exchange token"], popular: true },
  { symbol: "CAKE", name: "PancakeSwap", category: "DeFi", tags: ["pancakeswap", "dex", "bnb defi"], popular: true },
  { symbol: "USDT", name: "Tether USDt", category: "Stablecoin", tags: ["stable", "dollar", "tether"], popular: true },
  { symbol: "USDC", name: "USDC", category: "Stablecoin", tags: ["stable", "dollar", "circle"], popular: true },
  { symbol: "DAI", name: "Dai", category: "Stablecoin", tags: ["stable", "makerdao", "dollar"], popular: true },
  { symbol: "FDUSD", name: "First Digital USD", category: "Stablecoin", tags: ["stable", "dollar"], popular: true },
  { symbol: "XRP", name: "XRP", category: "Major", tags: ["payments", "ripple"] },
  { symbol: "TRX", name: "TRON", category: "Layer 1", tags: ["tron", "l1"] },
  { symbol: "DOGE", name: "Dogecoin", category: "Meme", tags: ["meme", "dogecoin"] },
  { symbol: "SHIB", name: "Shiba Inu", category: "Meme", tags: ["meme", "shiba"] },
  { symbol: "ADA", name: "Cardano", category: "Layer 1", tags: ["cardano", "l1"] },
  { symbol: "AVAX", name: "Avalanche", category: "Layer 1", tags: ["avalanche", "l1"] },
  { symbol: "LINK", name: "Chainlink", category: "Oracle", tags: ["oracle", "chainlink"] },
  { symbol: "DOT", name: "Polkadot", category: "Layer 1", tags: ["polkadot", "interoperability"] },
  { symbol: "UNI", name: "Uniswap", category: "DeFi", tags: ["dex", "defi"] },
  { symbol: "AAVE", name: "Aave", category: "Lending", tags: ["lending", "defi"] },
  { symbol: "LTC", name: "Litecoin", category: "Major", tags: ["litecoin", "payments"] },
  { symbol: "BCH", name: "Bitcoin Cash", category: "Major", tags: ["bitcoin cash", "payments"] },
  { symbol: "TON", name: "Toncoin", category: "Layer 1", tags: ["ton", "telegram"] },
  { symbol: "ATOM", name: "Cosmos", category: "Layer 1", tags: ["cosmos", "interoperability"] },
  { symbol: "INJ", name: "Injective", category: "DeFi", tags: ["injective", "defi"] },
  { symbol: "FIL", name: "Filecoin", category: "Layer 1", tags: ["storage", "filecoin"] },
  { symbol: "FET", name: "Artificial Superintelligence Alliance", category: "DeFi", tags: ["ai", "agent", "fetch"] },
  { symbol: "PENDLE", name: "Pendle", category: "DeFi", tags: ["yield", "defi"] },
  { symbol: "LDO", name: "Lido DAO", category: "DeFi", tags: ["staking", "liquid staking"] },
  { symbol: "TWT", name: "Trust Wallet Token", category: "BNB Chain", tags: ["trust wallet", "wallet", "bnb chain"] },
  { symbol: "1INCH", name: "1inch Network", category: "DeFi", tags: ["aggregator", "dex"] },
  { symbol: "SUSHI", name: "SushiSwap", category: "DeFi", tags: ["dex", "defi"] },
];

export const POPULAR_TOKEN_SYMBOLS = TOKEN_OPTIONS.filter((token) => token.popular).map((token) => token.symbol);

export function findTokenBySymbol(symbol: string) {
  return TOKEN_OPTIONS.find((token) => token.symbol.toLowerCase() === symbol.trim().toLowerCase());
}

export function searchTokens(query: string, limit = 8) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return TOKEN_OPTIONS.filter((token) => token.popular).slice(0, limit);
  }

  return TOKEN_OPTIONS.filter((token) => {
    const searchable = [token.symbol, token.name, token.category, ...token.tags].join(" ").toLowerCase();
    return searchable.includes(normalized);
  }).slice(0, limit);
}
