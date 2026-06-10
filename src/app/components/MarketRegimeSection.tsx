import { TrendingUp, Activity, MessageSquare, Droplets } from "lucide-react";
import type { StrategyResponse } from "../../types/strategy";
import { DataSourceBadge } from "./DataSourceBadge";

interface MarketRegimeCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  accent?: boolean;
  confidence?: number;
}

export function MarketRegimeCard({ label, value, icon, accent, confidence }: MarketRegimeCardProps) {
  return (
    <div className="bg-[#161A20] border border-[#2B3139] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-[#848E9C]">{icon}</span>}
        <span className="text-[#848E9C] text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-sm font-semibold ${accent ? "text-[#F0B90B]" : "text-white"}`}>{value}</div>
      {confidence !== undefined && (
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#848E9C]">Confidence</span>
            <span className="text-[#0ECB81]">{confidence}%</span>
          </div>
          <div className="h-1 bg-[#2B3139] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#0ECB81] transition-all duration-700"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  data: StrategyResponse;
}

function stateColor(state: string) {
  const s = state.toLowerCase();
  if (["bullish", "positive", "high", "strong"].includes(s)) return "text-[#0ECB81]";
  if (["bearish", "negative", "low", "weak"].includes(s)) return "text-[#F6465D]";
  return "text-[#F0B90B]";
}

export function MarketRegimeSection({ data }: Props) {
  return (
    <section id="market-regime">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-4 rounded-full bg-[#F0B90B]" />
        <h2 className="text-white" style={{ fontSize: "1rem", fontWeight: 600 }}>Market Regime Detection</h2>
      </div>
      <DataSourceBadge data={data} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3 mt-3">
        <div className="col-span-2 lg:col-span-2 bg-[#161A20] border border-[#F0B90B]/30 rounded-xl p-4">
          <div className="text-[#848E9C] text-xs font-medium uppercase tracking-wider mb-1">Detected Regime</div>
          <div className="text-[#F0B90B] text-xl font-bold mb-1">{data.detectedRegime}</div>
          <div className="text-[#848E9C] text-xs mb-3">{data.marketSummary}</div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#848E9C]">Regime Confidence</span>
              <span className="text-[#0ECB81] font-medium">{data.regimeConfidence}%</span>
            </div>
            <div className="h-1.5 bg-[#2B3139] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#F0B90B] to-[#0ECB81] transition-all duration-700"
                style={{ width: `${data.regimeConfidence}%` }}
              />
            </div>
          </div>
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-3">
          <div className="bg-[#161A20] border border-[#2B3139] rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={12} className="text-[#848E9C]" />
              <span className="text-[#848E9C] text-xs uppercase tracking-wider">Trend</span>
            </div>
            <div className={`text-sm font-semibold ${stateColor(data.trendState)}`}>{data.trendState}</div>
          </div>
          <div className="bg-[#161A20] border border-[#2B3139] rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Activity size={12} className="text-[#848E9C]" />
              <span className="text-[#848E9C] text-xs uppercase tracking-wider">Volatility</span>
            </div>
            <div className={`text-sm font-semibold ${stateColor(data.volatilityState)}`}>{data.volatilityState}</div>
          </div>
          <div className="bg-[#161A20] border border-[#2B3139] rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <MessageSquare size={12} className="text-[#848E9C]" />
              <span className="text-[#848E9C] text-xs uppercase tracking-wider">Sentiment</span>
            </div>
            <div className={`text-sm font-semibold ${stateColor(data.sentimentState)}`}>{data.sentimentState}</div>
          </div>
          <div className="bg-[#161A20] border border-[#2B3139] rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Droplets size={12} className="text-[#848E9C]" />
              <span className="text-[#848E9C] text-xs uppercase tracking-wider">Liquidity</span>
            </div>
            <div className={`text-sm font-semibold ${stateColor(data.liquidityState)}`}>{data.liquidityState}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
