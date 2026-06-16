import type { Backtest } from "../../types/strategy";

interface MetricCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  variant?: "positive" | "negative" | "accent" | "neutral";
  large?: boolean;
}

function isNegative(value?: string | number) {
  return String(value ?? "").trim().startsWith("-");
}

function MetricCard({ label, value, subLabel, variant = "neutral", large }: MetricCardProps) {
  const colorMap = {
    positive: "text-[#0ECB81]",
    negative: "text-[#F6465D]",
    accent: "text-[#F0B90B]",
    neutral: "text-white",
  };
  const borderMap = {
    positive: "border-[#0ECB81]/20",
    negative: "border-[#F6465D]/20",
    accent: "border-[#F0B90B]/20",
    neutral: "border-[#2B3139]",
  };

  return (
    <div className={`bg-[#161A20] border rounded-xl p-3.5 ${borderMap[variant]}`}>
      <div className="text-[#4B5563] text-xs font-medium uppercase tracking-wider mb-1.5">{label}</div>
      <div
        className={`font-bold ${colorMap[variant]}`}
        style={{ fontSize: large ? "1.5rem" : "1.12rem", lineHeight: 1 }}
      >
        {value}
      </div>
      {subLabel && <div className="text-[#4B5563] text-xs mt-1.5 leading-snug">{subLabel}</div>}
    </div>
  );
}

export function PerformanceSnapshot({ backtest }: { backtest: Backtest }) {
  const benchmark = backtest.benchmarkReturn || "—";
  const outperformance = backtest.alphaVsBenchmark || "—";
  const outIsPositive = !isNegative(outperformance);

  return (
    <section>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="w-1 h-4 rounded-full bg-[#0ECB81]" />
        <span className="text-white text-xs font-semibold tracking-wide uppercase">Performance Snapshot</span>
        <span className="text-[#4B5563] text-xs">Historical simulation — not future performance</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-7 gap-2.5">
        <MetricCard label="Total Return" value={backtest.totalReturn} subLabel={`vs ${benchmark} B&H`} variant={isNegative(backtest.totalReturn) ? "negative" : "positive"} large />
        <MetricCard label="Max Drawdown" value={backtest.maxDrawdown} subLabel="Peak-to-trough" variant="negative" large />
        <MetricCard label="Win Rate" value={backtest.winRate} subLabel={`${backtest.numberOfTrades} trades`} variant="accent" large />
        <MetricCard label="Buy & Hold" value={benchmark} subLabel="Benchmark" variant={isNegative(benchmark) ? "negative" : "neutral"} />
        <MetricCard label="Outperformance" value={outperformance} subLabel="vs benchmark" variant={outIsPositive ? "positive" : "negative"} />
        <MetricCard label="No. of Trades" value={backtest.numberOfTrades} subLabel={`${backtest.averageTradeReturn} avg`} />
        <MetricCard label="Risk Score" value={`${backtest.riskAdjustedScore}/100`} subLabel="Risk-adjusted" variant="accent" />
      </div>
    </section>
  );
}
