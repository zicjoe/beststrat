import { Clock, Database, ShieldCheck, TrendingUp } from "lucide-react";
import type { StrategyResponse } from "../../types/strategy";

function formatLabel(value?: string) {
  if (!value) return "—";
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function riskColor(level: string) {
  const normalized = level.toLowerCase();
  if (normalized === "conservative") return "text-[#0ECB81]";
  if (normalized === "aggressive") return "text-[#F6465D]";
  return "text-[#F0B90B]";
}

function getDataSource(data: StrategyResponse) {
  if (data.meta?.dataProvider) return data.meta.dataProvider;
  if (data.meta?.cmcQuoteUsed) return "CoinMarketCap";
  if (data.meta?.dataSource) return data.meta.dataSource;
  return "Strategy data";
}

function getSnapshot(data: StrategyResponse) {
  const raw = data.meta?.dataSnapshotAt || data.meta?.generatedAt || data.createdAt;
  if (!raw) return "Latest snapshot";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Props {
  data: StrategyResponse;
}

interface SummaryMetaItem {
  label: string;
  value: string | number;
  colorClass?: string;
}

function SummaryMetaCard({ label, value, colorClass }: SummaryMetaItem) {
  return (
    <div className="bg-[#0F1318] px-4 py-3 min-w-0">
      <div className="text-[#4B5563] text-[11px] uppercase tracking-wider mb-1 leading-tight">{label}</div>
      <div className={`text-sm font-semibold leading-snug whitespace-normal break-words ${colorClass ?? "text-white"}`}>
        {value}
      </div>
    </div>
  );
}

export function StrategyDecisionSummary({ data }: Props) {
  const selectedFocus = data.autoSelection?.enabled
    ? data.autoSelection.selectedFocusLabel
    : formatLabel(data.selectedStrategyFocus || data.strategyFocus);

  const metaItems: SummaryMetaItem[] = [
    { label: "Token", value: data.symbol },
    { label: "Timeframe", value: data.timeframe },
    { label: "Lookback", value: `${data.lookbackDays}d` },
    { label: "Risk Level", value: formatLabel(data.riskLevel), colorClass: riskColor(data.riskLevel) },
    { label: "Input Focus", value: formatLabel(data.strategyFocus) },
    { label: "Selected", value: selectedFocus, colorClass: "text-[#F0B90B]" },
    { label: "Mode", value: "Historical Sim.", colorClass: "text-[#C8CDD6]" },
  ];

  return (
    <section
      className="rounded-2xl border border-[#2B3139] overflow-hidden"
      style={{ background: "linear-gradient(135deg, #161A20 0%, #0F1318 100%)" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-3 border-b border-[#2B3139] bg-[#0B0E11]/60">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#0ECB81]" />
          <span className="text-[#848E9C] text-xs font-medium tracking-wider uppercase">Strategy Decision</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#848E9C]">
          <span className="inline-flex items-center gap-1.5 min-w-0">
            <Database size={12} className="flex-shrink-0" />
            <span className="whitespace-normal break-words">{getDataSource(data)}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 min-w-0">
            <Clock size={12} className="flex-shrink-0" />
            <span className="whitespace-normal break-words">{getSnapshot(data)}</span>
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 mb-5">
          <div className="min-w-0 flex-1">
            <div className="text-[#4B5563] text-xs uppercase tracking-wider mb-1">Selected Strategy</div>
            <h2
              className="text-white mb-2"
              style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.45rem)", fontWeight: 700, lineHeight: 1.2 }}
            >
              {data.strategyName}
            </h2>
            <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-3xl">{data.strategySummary}</p>
          </div>

          <div className="flex flex-row xl:flex-col items-start xl:items-end gap-3 flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border bg-[#F0B90B]/10 border-[#F0B90B]/30 text-[#F0B90B] whitespace-normal">
              <TrendingUp size={13} className="flex-shrink-0" />
              {data.detectedRegime}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-[#0ECB81]/10 border-[#0ECB81]/25 text-[#0ECB81] whitespace-normal">
              <ShieldCheck size={12} className="flex-shrink-0" />
              {data.regimeConfidence}% confidence
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-px rounded-xl overflow-hidden bg-[#2B3139]">
          {metaItems.map((item) => (
            <SummaryMetaCard key={item.label} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
