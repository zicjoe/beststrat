import { ScanLine } from "lucide-react";
import type { ScannerCategory, ScannerRequest } from "../../types/strategy";

const timeframes = ["5m", "15m", "1h", "4h", "1d"];
const lookbacks = [7, 14, 30, 60, 90];
const limits = [5, 10, 15];

export function CategorySelect({
  value,
  onChange,
  categories,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  categories: ScannerCategory[];
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-[#848E9C] text-xs font-medium mb-1.5 uppercase tracking-wider">Category</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled || !categories.length}
        className="w-full bg-[#1E2329] border border-[#2B3139] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#F0B90B]/60 focus:ring-1 focus:ring-[#F0B90B]/30 transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {categories.length ? (
          categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))
        ) : (
          <option value="popular">Loading categories...</option>
        )}
      </select>
    </div>
  );
}

export function CategoryQuickChips({
  value,
  onChange,
  categories,
}: {
  value: string;
  onChange: (value: string) => void;
  categories: ScannerCategory[];
}) {
  const quickCategories = categories.slice(0, 8);

  if (!quickCategories.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {quickCategories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
            value === category.id
              ? "bg-[#F0B90B]/15 text-[#F0B90B] border-[#F0B90B]/40"
              : "bg-[#1E2329] text-[#848E9C] border-[#2B3139] hover:border-[#3B4149] hover:text-white"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export function CandidateLimitSelect({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div>
      <label className="block text-[#848E9C] text-xs font-medium mb-1.5 uppercase tracking-wider">Candidate Limit</label>
      <div className="grid grid-cols-3 gap-1">
        {limits.map((limit) => (
          <button
            key={limit}
            type="button"
            onClick={() => onChange(limit)}
            className={`py-2 rounded-lg text-sm font-medium transition-colors border ${
              value === limit
                ? "bg-[#F0B90B] text-[#0B0E11] border-[#F0B90B]"
                : "bg-[#1E2329] text-[#848E9C] border-[#2B3139] hover:bg-[#2B3139] hover:text-white"
            }`}
          >
            Top {limit}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TimeframeSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="block text-[#848E9C] text-xs font-medium mb-1.5 uppercase tracking-wider">Timeframe</label>
      <div className="grid grid-cols-5 gap-1">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe}
            type="button"
            onClick={() => onChange(timeframe)}
            className={`py-2 rounded-lg text-sm font-medium transition-colors border ${
              value === timeframe
                ? "bg-[#F0B90B] text-[#0B0E11] border-[#F0B90B]"
                : "bg-[#1E2329] text-[#848E9C] border-[#2B3139] hover:bg-[#2B3139] hover:text-white"
            }`}
          >
            {timeframe}
          </button>
        ))}
      </div>
    </div>
  );
}

export function LookbackSelect({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div>
      <label className="block text-[#848E9C] text-xs font-medium mb-1.5 uppercase tracking-wider">Lookback Period</label>
      <div className="grid grid-cols-5 gap-1">
        {lookbacks.map((days) => (
          <button
            key={days}
            type="button"
            onClick={() => onChange(days)}
            className={`py-2 rounded-lg text-sm font-medium transition-colors border ${
              value === days
                ? "bg-[#F0B90B] text-[#0B0E11] border-[#F0B90B]"
                : "bg-[#1E2329] text-[#848E9C] border-[#2B3139] hover:bg-[#2B3139] hover:text-white"
            }`}
          >
            {days}d
          </button>
        ))}
      </div>
    </div>
  );
}

export function RiskLevelSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const options = [
    { id: "conservative", label: "Conservative", color: "text-[#0ECB81]" },
    { id: "moderate", label: "Moderate", color: "text-[#F0B90B]" },
    { id: "aggressive", label: "Aggressive", color: "text-[#F6465D]" },
  ];

  return (
    <div>
      <label className="block text-[#848E9C] text-xs font-medium mb-1.5 uppercase tracking-wider">Risk Level</label>
      <div className="grid grid-cols-3 gap-1.5">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`py-2 rounded-lg text-sm font-medium transition-all border ${
              value === option.id
                ? "bg-[#1E2329] border-[#F0B90B]/60 text-white"
                : "bg-[#161A20] border-[#2B3139] text-[#848E9C] hover:text-white hover:border-[#3B4149]"
            }`}
          >
            <span className={value === option.id ? option.color : ""}>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function StrategyFocusSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
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
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border text-left ${
              value === option.id
                ? "bg-[#F0B90B]/10 border-[#F0B90B]/40 text-white"
                : "bg-[#161A20] border-[#2B3139] text-[#848E9C] hover:border-[#3B4149] hover:text-white"
            }`}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${value === option.id ? "bg-[#F0B90B]" : "bg-[#2B3139]"}`} />
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScanCategoryButton({ isScanning, disabled }: { isScanning: boolean; disabled: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled || isScanning}
      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[#F0B90B] text-[#0B0E11] hover:bg-[#F0B90B]/90 active:scale-[0.98]"
    >
      {isScanning ? (
        <>
          <span className="w-4 h-4 border-2 border-[#0B0E11]/30 border-t-[#0B0E11] rounded-full animate-spin" />
          Scanning Category…
        </>
      ) : (
        <>
          <ScanLine size={16} />
          Scan Category
        </>
      )}
    </button>
  );
}

export interface ScannerControlPanelProps extends ScannerRequest {
  categories: ScannerCategory[];
  categoryId: string;
  isLoadingCategories: boolean;
  isScanning: boolean;
  onCategoryChange: (value: string) => void;
  onLimitChange: (value: number) => void;
  onTimeframeChange: (value: string) => void;
  onLookbackChange: (value: number) => void;
  onRiskLevelChange: (value: string) => void;
  onStrategyFocusChange: (value: string) => void;
  onScan: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function ScannerControlPanel({
  categories,
  categoryId,
  timeframe,
  lookbackDays,
  riskLevel,
  strategyFocus,
  limit,
  isLoadingCategories,
  isScanning,
  onCategoryChange,
  onLimitChange,
  onTimeframeChange,
  onLookbackChange,
  onRiskLevelChange,
  onStrategyFocusChange,
  onScan,
}: ScannerControlPanelProps) {
  return (
    <div className="bg-[#161A20] border border-[#2B3139] rounded-2xl overflow-hidden md:max-h-[calc(100vh-7rem)] md:flex md:flex-col">
      <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-4 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-1 h-4 rounded-full bg-[#F0B90B] flex-shrink-0" />
          <h2 className="text-white text-sm font-semibold truncate">Scanner Controls</h2>
        </div>
        <span className="hidden sm:inline-flex px-2 py-1 rounded-full bg-[#1E2329] border border-[#2B3139] text-[#848E9C] text-[11px] font-medium">
          Top {limit}
        </span>
      </div>

      <form onSubmit={onScan} className="md:min-h-0 md:flex md:flex-1 md:flex-col">
        <div className="px-5 pb-4 flex flex-col gap-4 md:min-h-0 md:overflow-y-auto md:pr-4 beststrat-sidebar-scroll">
          <div className="flex flex-col gap-2">
            <CategorySelect value={categoryId} onChange={onCategoryChange} categories={categories} disabled={isLoadingCategories} />
            <CategoryQuickChips value={categoryId} onChange={onCategoryChange} categories={categories} />
          </div>

          <CandidateLimitSelect value={limit} onChange={onLimitChange} />
          <TimeframeSelect value={timeframe} onChange={onTimeframeChange} />
          <LookbackSelect value={lookbackDays} onChange={onLookbackChange} />
          <RiskLevelSelect value={riskLevel} onChange={onRiskLevelChange} />
          <StrategyFocusSelect value={strategyFocus} onChange={onStrategyFocusChange} />
        </div>

        <div className="border-t border-[#2B3139] bg-[#161A20] p-4 flex-shrink-0">
          <ScanCategoryButton isScanning={isScanning} disabled={isLoadingCategories || !categories.length} />
          <p className="text-[#4B5563] text-xs text-center leading-relaxed mt-3">
            Scanner ranks strategy candidates only. It does not execute trades.
          </p>
        </div>
      </form>
    </div>
  );
}
