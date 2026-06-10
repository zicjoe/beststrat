import { Database, CheckCircle2, AlertTriangle } from "lucide-react";
import type { StrategyResponse } from "../../types/strategy";

export function DataSourceBadge({ data }: { data: StrategyResponse }) {
  const meta = data.meta;
  const isCmc = Boolean(meta?.cmcQuoteUsed);
  const label = isCmc ? "CMC quote connected" : "Demo fallback data";
  const detail = isCmc
    ? "Using CoinMarketCap latest quote with deterministic candles for backtesting."
    : meta?.fallbackReason || "Set CMC_API_KEY to enable CoinMarketCap latest quote data.";

  return (
    <div
      className={`rounded-xl border p-3 flex items-start gap-3 ${
        isCmc ? "bg-[#0ECB81]/5 border-[#0ECB81]/25" : "bg-[#F0B90B]/5 border-[#F0B90B]/25"
      }`}
    >
      <div className={`mt-0.5 ${isCmc ? "text-[#0ECB81]" : "text-[#F0B90B]"}`}>
        {isCmc ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wider ${isCmc ? "text-[#0ECB81]" : "text-[#F0B90B]"}`}>
            {label}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-[#848E9C]">
            <Database size={11} /> {meta?.candlesAnalyzed ?? 0} candles analyzed
          </span>
        </div>
        <p className="text-xs text-[#848E9C] mt-1 leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}
