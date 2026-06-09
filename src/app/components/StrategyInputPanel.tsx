import { useState } from "react";
import { Sparkles } from "lucide-react";
import type { StrategyRequest } from "../../types/strategy";

interface Props {
  onGenerate: (req: StrategyRequest) => void;
  isLoading: boolean;
}

export function TokenInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[#848E9C] text-xs font-medium mb-1.5 uppercase tracking-wider">Token Symbol</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        placeholder="e.g. CAKE, BTC, ETH"
        className="w-full bg-[#1E2329] border border-[#2B3139] rounded-lg px-3 py-2.5 text-white placeholder-[#4B5563] focus:outline-none focus:border-[#F0B90B]/60 focus:ring-1 focus:ring-[#F0B90B]/30 transition-colors"
      />
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

export function StrategyInputPanel({ onGenerate, isLoading }: Props) {
  const [symbol, setSymbol] = useState("CAKE");
  const [timeframe, setTimeframe] = useState("1h");
  const [lookbackDays, setLookbackDays] = useState(30);
  const [riskLevel, setRiskLevel] = useState("moderate");
  const [strategyFocus, setStrategyFocus] = useState("auto");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ symbol, timeframe, lookbackDays, riskLevel, strategyFocus });
  };

  return (
    <div className="bg-[#161A20] border border-[#2B3139] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-1 h-4 rounded-full bg-[#F0B90B]" />
        <h2 className="text-white" style={{ fontSize: "0.9rem", fontWeight: 600 }}>Strategy Parameters</h2>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <TokenInput value={symbol} onChange={setSymbol} />
        <TimeframeSelect value={timeframe} onChange={setTimeframe} />
        <LookbackSelect value={lookbackDays} onChange={setLookbackDays} />
        <RiskLevelSelect value={riskLevel} onChange={setRiskLevel} />
        <StrategyFocusSelect value={strategyFocus} onChange={setStrategyFocus} />
        <GenerateStrategyButton isLoading={isLoading} disabled={!symbol.trim()} />
        <p className="text-[#4B5563] text-xs text-center leading-relaxed">
          BestStrat generates strategy specs only. Does not execute trades, connect wallets, or place live orders.
        </p>
      </form>
    </div>
  );
}
