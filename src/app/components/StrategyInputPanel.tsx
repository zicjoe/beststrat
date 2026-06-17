import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, Sparkles } from "lucide-react";
import { POPULAR_TOKEN_SYMBOLS, findTokenBySymbol, searchTokens, type TokenOption } from "../../data/tokens";
import type { StrategyRequest } from "../../types/strategy";

interface Props {
  onGenerate: (req: StrategyRequest) => void;
  isLoading: boolean;
  initialRequest?: Partial<StrategyRequest> | null;
}

const categoryStyles: Record<TokenOption["category"], string> = {
  Major: "border-[#F0B90B]/20 bg-[#F0B90B]/10 text-[#F0B90B]",
  "BNB Chain": "border-[#F0B90B]/20 bg-[#F0B90B]/10 text-[#F0B90B]",
  DeFi: "border-[#0ECB81]/20 bg-[#0ECB81]/10 text-[#0ECB81]",
  Stablecoin: "border-[#3B82F6]/20 bg-[#3B82F6]/10 text-[#8AB4FF]",
  "Layer 1": "border-[#A78BFA]/20 bg-[#A78BFA]/10 text-[#C4B5FD]",
  Meme: "border-[#F97316]/20 bg-[#F97316]/10 text-[#FDBA74]",
  Oracle: "border-[#38BDF8]/20 bg-[#38BDF8]/10 text-[#7DD3FC]",
  Lending: "border-[#34D399]/20 bg-[#34D399]/10 text-[#86EFAC]",
};

function TokenRow({ token, selected, onSelect }: { token: TokenOption; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
        selected ? "bg-[#F0B90B]/10" : "hover:bg-[#1E2329]"
      }`}
    >
      <span className="w-10 h-10 rounded-xl bg-[#1E2329] border border-[#2B3139] flex items-center justify-center text-[#F0B90B] text-xs font-bold flex-shrink-0">
        {token.symbol.slice(0, 4)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-white text-sm font-semibold truncate">{token.symbol}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${categoryStyles[token.category]}`}>
            {token.category}
          </span>
        </span>
        <span className="block text-[#848E9C] text-xs truncate mt-0.5">{token.name}</span>
      </span>
      {selected && <Check size={16} className="text-[#F0B90B] flex-shrink-0" />}
    </button>
  );
}

export function TokenInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const selectedToken = findTokenBySymbol(value);
  const filteredTokens = useMemo(() => searchTokens(query, 8), [query]);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery(value);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [value]);

  const selectToken = (token: TokenOption) => {
    onChange(token.symbol);
    setQuery(token.symbol);
    setIsOpen(false);
  };

  const useCustomSymbol = () => {
    const customSymbol = query.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!customSymbol) return;
    onChange(customSymbol);
    setQuery(customSymbol);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setQuery(value);
      return;
    }

    if (event.key === "Enter" && isOpen) {
      event.preventDefault();
      if (filteredTokens.length > 0) {
        selectToken(filteredTokens[0]);
      } else {
        useCustomSymbol();
      }
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-[#848E9C] text-xs font-medium mb-1.5 uppercase tracking-wider">Token</label>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563] pointer-events-none" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            const exactMatch = findTokenBySymbol(e.target.value);
            if (exactMatch || /^[a-zA-Z0-9]{2,12}$/.test(e.target.value.trim())) {
              onChange(e.target.value.trim().toUpperCase());
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search by symbol or name"
          className="w-full bg-[#1E2329] border border-[#2B3139] rounded-lg pl-9 pr-10 py-2.5 text-white placeholder-[#4B5563] focus:outline-none focus:border-[#F0B90B]/60 focus:ring-1 focus:ring-[#F0B90B]/30 transition-colors"
        />
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#848E9C] hover:text-white hover:bg-[#2B3139] transition-colors"
          aria-label="Open token selector"
        >
          <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {selectedToken ? (
        <div className="mt-2 flex items-center justify-between gap-2 text-xs">
          <span className="text-[#848E9C] truncate">Selected: <span className="text-white">{selectedToken.symbol}</span> · {selectedToken.name}</span>
          <span className={`px-1.5 py-0.5 rounded-full border flex-shrink-0 ${categoryStyles[selectedToken.category]}`}>{selectedToken.category}</span>
        </div>
      ) : (
        <div className="mt-2 text-[#848E9C] text-xs">
          Custom symbol: <span className="text-white">{value || "—"}</span>
        </div>
      )}

      <div className="mt-3">
        <p className="text-[#4B5563] text-[11px] mb-1.5 uppercase tracking-wider">Popular</p>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_TOKEN_SYMBOLS.slice(0, 8).map((symbol) => (
            <button
              key={symbol}
              type="button"
              onClick={() => {
                const token = findTokenBySymbol(symbol);
                if (token) selectToken(token);
              }}
              className={`px-2 py-1 rounded-md border text-xs font-medium transition-colors ${
                value === symbol
                  ? "bg-[#F0B90B] text-[#0B0E11] border-[#F0B90B]"
                  : "bg-[#161A20] text-[#848E9C] border-[#2B3139] hover:text-white hover:border-[#3B4149]"
              }`}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-[#2B3139] bg-[#0B0E11] shadow-2xl shadow-black/40">
          <div className="px-3 py-2 border-b border-[#2B3139] bg-[#161A20]">
            <p className="text-[#848E9C] text-xs">
              {query.trim() ? "Search results" : "Popular tokens"}
            </p>
          </div>
          <div className="max-h-72 overflow-y-auto beststrat-sidebar-scroll divide-y divide-[#1E2329]">
            {filteredTokens.length > 0 ? (
              filteredTokens.map((token) => (
                <TokenRow
                  key={token.symbol}
                  token={token}
                  selected={token.symbol === value}
                  onSelect={() => selectToken(token)}
                />
              ))
            ) : (
              <div className="p-3">
                <p className="text-[#848E9C] text-xs mb-2">No curated token match found.</p>
                <button
                  type="button"
                  onClick={useCustomSymbol}
                  className="w-full px-3 py-2 rounded-lg border border-[#F0B90B]/30 bg-[#F0B90B]/10 text-[#F0B90B] text-sm font-medium hover:bg-[#F0B90B]/15 transition-colors"
                >
                  Use custom symbol {query.trim().toUpperCase().replace(/[^A-Z0-9]/g, "") || ""}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function TimeframeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = ["5m", "15m", "1h", "4h", "1d"];
  return (
    <div>
      <label className="block text-[#848E9C] text-xs font-medium mb-1.5 uppercase tracking-wider">Timeframe</label>
      <div className="grid grid-cols-5 gap-1">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${
              value === opt
                ? "bg-[#F0B90B] text-[#0B0E11]"
                : "bg-[#1E2329] text-[#848E9C] hover:bg-[#2B3139] hover:text-white border border-[#2B3139]"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function LookbackSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const options = [7, 14, 30, 60, 90];
  return (
    <div>
      <label className="block text-[#848E9C] text-xs font-medium mb-1.5 uppercase tracking-wider">Lookback Period</label>
      <div className="grid grid-cols-5 gap-1">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${
              value === opt
                ? "bg-[#F0B90B] text-[#0B0E11]"
                : "bg-[#1E2329] text-[#848E9C] hover:bg-[#2B3139] hover:text-white border border-[#2B3139]"
            }`}
          >
            {opt}d
          </button>
        ))}
      </div>
    </div>
  );
}

export function RiskLevelSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    { id: "conservative", label: "Conservative", color: "text-[#0ECB81]" },
    { id: "moderate", label: "Moderate", color: "text-[#F0B90B]" },
    { id: "aggressive", label: "Aggressive", color: "text-[#F6465D]" },
  ];
  return (
    <div>
      <label className="block text-[#848E9C] text-xs font-medium mb-1.5 uppercase tracking-wider">Risk Level</label>
      <div className="grid grid-cols-3 gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`py-2 rounded-lg text-sm font-medium transition-all border ${
              value === opt.id
                ? "bg-[#1E2329] border-[#F0B90B]/60 text-white"
                : "bg-[#161A20] border-[#2B3139] text-[#848E9C] hover:border-[#2B3139] hover:text-white"
            }`}
          >
            <span className={value === opt.id ? opt.color : ""}>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function StrategyFocusSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    { id: "auto", label: "Auto Detect" },
    { id: "momentum", label: "Momentum" },
    { id: "sentiment_divergence", label: "Sentiment Divergence" },
    { id: "regime_detection", label: "Regime Detection" },
    { id: "risk_off", label: "Risk Off" },
  ];
  return (
    <div>
      <label className="block text-[#848E9C] text-xs font-medium mb-1.5 uppercase tracking-wider">Strategy Focus</label>
      <div className="flex flex-col gap-1">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border text-left ${
              value === opt.id
                ? "bg-[#F0B90B]/10 border-[#F0B90B]/40 text-white"
                : "bg-[#161A20] border-[#2B3139] text-[#848E9C] hover:border-[#3B4149] hover:text-white"
            }`}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${value === opt.id ? "bg-[#F0B90B]" : "bg-[#2B3139]"}`} />
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function GenerateStrategyButton({ isLoading, disabled }: { isLoading: boolean; disabled: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ background: disabled || isLoading ? "#4B5563" : "#F0B90B", color: "#0B0E11" }}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-[#0B0E11]/30 border-t-[#0B0E11] rounded-full animate-spin" />
          Analyzing Market Data...
        </>
      ) : (
        <>
          <Sparkles size={16} />
          Generate Strategy
        </>
      )}
    </button>
  );
}

export function StrategyInputPanel({ onGenerate, isLoading, initialRequest }: Props) {
  const [symbol, setSymbol] = useState(initialRequest?.symbol || "CAKE");
  const [timeframe, setTimeframe] = useState(initialRequest?.timeframe || "1h");
  const [lookbackDays, setLookbackDays] = useState(Number(initialRequest?.lookbackDays || 30));
  const [riskLevel, setRiskLevel] = useState(initialRequest?.riskLevel || "moderate");
  const [strategyFocus, setStrategyFocus] = useState(initialRequest?.strategyFocus || "auto");

  useEffect(() => {
    if (!initialRequest) return;
    if (initialRequest.symbol) setSymbol(initialRequest.symbol);
    if (initialRequest.timeframe) setTimeframe(initialRequest.timeframe);
    if (initialRequest.lookbackDays) setLookbackDays(Number(initialRequest.lookbackDays));
    if (initialRequest.riskLevel) setRiskLevel(initialRequest.riskLevel);
    if (initialRequest.strategyFocus) setStrategyFocus(initialRequest.strategyFocus);
  }, [initialRequest?.symbol, initialRequest?.timeframe, initialRequest?.lookbackDays, initialRequest?.riskLevel, initialRequest?.strategyFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ symbol, timeframe, lookbackDays, riskLevel, strategyFocus });
  };

  return (
    <div className="bg-[#161A20] border border-[#2B3139] rounded-2xl overflow-hidden lg:max-h-[calc(100vh-7rem)] lg:flex lg:flex-col">
      <div className="flex items-center gap-2 px-5 pt-5 pb-4 flex-shrink-0">
        <span className="w-1 h-4 rounded-full bg-[#F0B90B]" />
        <h2 className="text-white" style={{ fontSize: "0.9rem", fontWeight: 600 }}>Strategy Parameters</h2>
      </div>

      <form onSubmit={handleSubmit} className="lg:min-h-0 lg:flex lg:flex-1 lg:flex-col">
        <div className="px-5 pb-4 flex flex-col gap-4 lg:min-h-0 lg:overflow-y-auto lg:pr-4 beststrat-sidebar-scroll">
          <TokenInput value={symbol} onChange={setSymbol} />
          <TimeframeSelect value={timeframe} onChange={setTimeframe} />
          <LookbackSelect value={lookbackDays} onChange={setLookbackDays} />
          <RiskLevelSelect value={riskLevel} onChange={setRiskLevel} />
          <StrategyFocusSelect value={strategyFocus} onChange={setStrategyFocus} />
        </div>

        <div className="border-t border-[#2B3139] bg-[#161A20] p-4 flex-shrink-0">
          <GenerateStrategyButton isLoading={isLoading} disabled={!symbol.trim()} />
          <p className="text-[#4B5563] text-xs text-center leading-relaxed mt-3">
            BestStrat generates strategy specs only. Does not execute trades, connect wallets, or place live orders.
          </p>
        </div>
      </form>
    </div>
  );
}
