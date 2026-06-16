import { useState, type ReactNode } from "react";
import {
  Ban,
  Brain,
  Check,
  CheckCircle2,
  Circle,
  Copy,
  Download,
  LogIn,
  LogOut,
  Scale,
  ShieldAlert,
  XOctagon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RecentStrategyRunsTable } from "./RecentStrategyRunsTable";
import type { AutoSelectionCandidate, RecentRun, Signal, StrategyResponse } from "../../types/strategy";

function ReturnCell({ value }: { value: string }) {
  return <span className={value.startsWith("-") ? "text-[#F6465D]" : "text-[#0ECB81]"}>{value}</span>;
}

function ScoreBar({ score }: { score: number }) {
  const normalized = Math.max(0, Math.min(100, Number(score) || 0));
  const color = normalized >= 70 ? "#0ECB81" : normalized >= 55 ? "#F0B90B" : "#F6465D";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-[#2B3139] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${normalized}%`, background: color }} />
      </div>
      <span className="text-xs font-medium w-6 text-right" style={{ color }}>{normalized}</span>
    </div>
  );
}

function normalizeForExport(value: unknown) {
  if (typeof value === "string") return value;
  return JSON.stringify(value ?? {}, null, 2);
}

function formatLabel(value?: string) {
  if (!value) return "—";
  return value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function getSelectionRationale(data: StrategyResponse) {
  if (data.autoSelection?.enabled && data.autoSelection.reason) return data.autoSelection.reason;
  if (data.decisionRationale?.length) return data.decisionRationale.join(" ");
  return data.strategySummary;
}

function AutoSelectionComparison({ candidates }: { candidates: AutoSelectionCandidate[] }) {
  if (!candidates.length) return null;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
        <span className="text-white text-xs font-semibold uppercase tracking-wide">Auto Strategy Selection</span>
        <span className="text-[#4B5563] text-xs">
          {candidates.length} candidates evaluated by return, drawdown, win rate, risk score, outperformance and regime fit
        </span>
      </div>
      <div className="bg-[#0F1318] border border-[#2B3139] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2B3139]">
                {["", "Strategy", "Regime", "Return", "Max DD", "Win Rate", "Risk Score", "Selection"].map((col) => (
                  <th key={col} className="px-3.5 py-2.5 text-left text-[#4B5563] text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, index) => (
                <tr
                  key={`${candidate.focus}-${candidate.strategyName}`}
                  className={`transition-colors ${index < candidates.length - 1 ? "border-b border-[#1A1F26]" : ""} ${candidate.selected ? "bg-[#F0B90B]/5" : "hover:bg-[#1A1F26]"}`}
                >
                  <td className="px-3.5 py-3 w-8">
                    {candidate.selected ? <CheckCircle2 size={14} className="text-[#F0B90B]" /> : <Circle size={14} className="text-[#2B3139]" />}
                  </td>
                  <td className="px-3.5 py-3 min-w-56">
                    <div className={`font-medium ${candidate.selected ? "text-white" : "text-[#C8CDD6]"}`}>{candidate.strategyName}</div>
                    <div className="text-[#4B5563] text-xs mt-0.5">{candidate.focusLabel}</div>
                  </td>
                  <td className="px-3.5 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-[#1E2329] text-[#848E9C] border border-[#2B3139] whitespace-nowrap">{candidate.regime}</span>
                  </td>
                  <td className="px-3.5 py-3 whitespace-nowrap font-medium"><ReturnCell value={candidate.totalReturn} /></td>
                  <td className="px-3.5 py-3 text-[#F6465D] whitespace-nowrap">{candidate.maxDrawdown}</td>
                  <td className="px-3.5 py-3 text-[#848E9C] whitespace-nowrap">{candidate.winRate}</td>
                  <td className="px-3.5 py-3 min-w-28"><ScoreBar score={candidate.riskAdjustedScore} /></td>
                  <td className="px-3.5 py-3 whitespace-nowrap">
                    {candidate.selected ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F0B90B]/10 text-[#F0B90B] border border-[#F0B90B]/30">
                        Selected · {candidate.selectionScore}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs text-[#4B5563] bg-[#1E2329] border border-[#2B3139]">
                        {candidate.selectionScore}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ data }: { data: StrategyResponse }) {
  const isAuto = data.autoSelection?.enabled;

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-[#0F1318] border border-[#2B3139] rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2B3139]">
          <div className="flex items-center justify-center w-5 h-5 rounded bg-[#F0B90B]/10">
            <Brain size={12} className="text-[#F0B90B]" />
          </div>
          <span className="text-white text-xs font-semibold uppercase tracking-wide">Why this strategy was selected</span>
        </div>
        <div className="px-4 py-4">
          <p className="text-[#9CA3AF] text-sm leading-relaxed">{getSelectionRationale(data)}</p>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {[
              { label: `Regime: ${data.detectedRegime}`, cls: "text-[#F0B90B] bg-[#F0B90B]/8 border-[#F0B90B]/20" },
              { label: `Risk score: ${data.backtest.riskAdjustedScore}/100`, cls: "text-[#0ECB81] bg-[#0ECB81]/8 border-[#0ECB81]/20" },
              { label: `Max DD: ${data.backtest.maxDrawdown}`, cls: "text-[#F6465D] bg-[#F6465D]/8 border-[#F6465D]/20" },
              { label: `Win rate: ${data.backtest.winRate}`, cls: "text-[#848E9C] bg-[#1E2329] border-[#2B3139]" },
            ].map(({ label, cls }) => (
              <span key={label} className={`px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}>{label}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#0F1318] border border-[#2B3139] rounded-xl p-4">
        <div className="text-white text-xs font-semibold uppercase tracking-wide mb-2">Market Condition Summary</div>
        <p className="text-[#9CA3AF] text-sm leading-relaxed">{data.marketSummary}</p>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: "Trend", value: data.trendState },
            { label: "Volatility", value: data.volatilityState },
            { label: "Sentiment", value: data.sentimentState },
            { label: "Liquidity", value: data.liquidityState },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#161A20] rounded-lg px-3 py-2 border border-[#2B3139]">
              <div className="text-[#4B5563] text-xs mb-0.5">{label}</div>
              <div className="text-white text-sm font-medium">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {isAuto && <AutoSelectionComparison candidates={data.autoSelection?.candidates ?? []} />}
    </div>
  );
}

function RuleList({ items, dot }: { items: string[]; dot: string }) {
  if (!items?.length) return <p className="text-[#4B5563] text-sm">No rules provided.</p>;
  return (
    <ul className="space-y-2">
      {items.map((rule, index) => (
        <li key={index} className="flex items-start gap-2.5 text-sm">
          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dot}`} />
          <span className="text-[#C8CDD6] leading-relaxed">{rule}</span>
        </li>
      ))}
    </ul>
  );
}

function RuleBlock({ icon, title, items, dot, accent }: { icon: ReactNode; title: string; items: string[]; dot: string; accent: string }) {
  return (
    <div className={`bg-[#0F1318] border border-[#2B3139] border-l-2 rounded-xl p-4 ${accent}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-white text-xs font-semibold uppercase tracking-wide">{title}</span>
      </div>
      <RuleList items={items} dot={dot} />
    </div>
  );
}

function StrategyRulesTab({ data }: { data: StrategyResponse }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <RuleBlock icon={<LogIn size={13} className="text-[#0ECB81]" />} title="Entry Rules" items={data.entryRules} dot="bg-[#0ECB81]" accent="border-l-[#0ECB81]" />
      <RuleBlock icon={<LogOut size={13} className="text-[#F0B90B]" />} title="Exit Rules" items={data.exitRules} dot="bg-[#F0B90B]" accent="border-l-[#F0B90B]" />
      <RuleBlock icon={<ShieldAlert size={13} className="text-[#F6465D]" />} title="Risk Rules" items={data.riskRules} dot="bg-[#F6465D]" accent="border-l-[#F6465D]" />
      <RuleBlock icon={<XOctagon size={13} className="text-[#848E9C]" />} title="Invalidation Rules" items={data.invalidationRules} dot="bg-[#848E9C]" accent="border-l-[#848E9C]" />
      <div className="bg-[#0F1318] border border-[#2B3139] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Scale size={13} className="text-[#848E9C]" />
          <span className="text-white text-xs font-semibold uppercase tracking-wide">Position Sizing</span>
        </div>
        <p className="text-[#C8CDD6] text-sm leading-relaxed">{data.positionSizing}</p>
      </div>
      <div className="bg-[#0F1318] border border-[#2B3139] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Ban size={13} className="text-[#848E9C]" />
          <span className="text-white text-xs font-semibold uppercase tracking-wide">No-Trade Conditions</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {data.noTradeConditions.map((condition, index) => (
            <span key={index} className="px-2.5 py-1 rounded-full text-xs bg-[#161A20] text-[#848E9C] border border-[#2B3139]">
              {condition}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function scoreStyle(score: number) {
  if (score >= 65) return { text: "text-[#0ECB81]", bar: "#0ECB81", badge: "bg-[#0ECB81]/8 text-[#0ECB81] border-[#0ECB81]/25" };
  if (score >= 45) return { text: "text-[#F0B90B]", bar: "#F0B90B", badge: "bg-[#F0B90B]/8 text-[#F0B90B] border-[#F0B90B]/25" };
  return { text: "text-[#F6465D]", bar: "#F6465D", badge: "bg-[#F6465D]/8 text-[#F6465D] border-[#F6465D]/25" };
}

function SignalScoreCard({ signal }: { signal: Signal }) {
  const { text, bar, badge } = scoreStyle(signal.score);
  return (
    <div className="bg-[#0F1318] border border-[#2B3139] rounded-xl p-3.5 hover:border-[#3B4149] transition-colors">
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex-1 min-w-0">
          <div className="text-white text-xs font-semibold mb-0.5">{signal.name}</div>
          <div className="text-[#4B5563] text-xs leading-relaxed">{signal.reason}</div>
        </div>
        <div className={`text-lg font-bold ml-3 flex-shrink-0 ${text}`}>{signal.score}</div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 h-1 bg-[#2B3139] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${signal.score}%`, background: bar }} />
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${badge}`}>{signal.status}</span>
      </div>
    </div>
  );
}

function SignalsTab({ data }: { data: StrategyResponse }) {
  const avg = data.signals.length ? Math.round(data.signals.reduce((total, signal) => total + signal.score, 0) / data.signals.length) : 0;
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 text-[#4B5563] text-xs">
        <span>{data.signals.length} signals analyzed</span>
        <span>·</span>
        <span>Average score: <span className="text-[#F0B90B] font-medium">{avg}</span></span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {data.signals.map((signal) => <SignalScoreCard key={signal.name} signal={signal} />)}
      </div>
    </div>
  );
}

const chartTooltipStyle = {
  backgroundColor: "#161A20",
  border: "1px solid #2B3139",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "11px",
  padding: "5px 9px",
};


function BacktestEvidenceChart({ data }: { data: StrategyResponse }) {
  const chartData = data.priceChart ?? [];
  const evidence = data.backtestEvidence;
  const snapshot = data.meta?.dataSnapshotAt ? new Date(data.meta.dataSnapshotAt).toLocaleString() : "Current request";
  const dataSource = data.meta?.dataSource || data.meta?.dataProvider || "BestStrat data layer";

  return (
    <div className="bg-[#0F1318] border border-[#2B3139] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#2B3139] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
        <div>
          <div className="text-white text-xs font-semibold uppercase tracking-wide">Backtest Evidence Chart</div>
          <p className="text-[#4B5563] text-xs mt-1">Price path, simulated entries, exits, and strategy context used for this historical simulation.</p>
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs">
          <span className="px-2 py-1 rounded-full bg-[#161A20] border border-[#2B3139] text-[#C8CDD6]">{data.symbol} / {data.timeframe} / {data.lookbackDays}d</span>
          <span className="px-2 py-1 rounded-full bg-[#F0B90B]/8 border border-[#F0B90B]/20 text-[#F0B90B]">Historical simulation — not future performance</span>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {[
            { label: "Strategy", value: data.strategyName },
            { label: "Data Source", value: dataSource },
            { label: "Snapshot", value: snapshot },
            { label: "Regime", value: `${data.detectedRegime} · ${data.regimeConfidence}%` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#161A20] rounded-lg border border-[#2B3139] px-3 py-2 min-w-0">
              <div className="text-[#4B5563] text-xs mb-0.5">{label}</div>
              <div className="text-white text-xs font-semibold truncate" title={String(value)}>{value}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#0B0E11] border border-[#1A1F26] rounded-xl p-3">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={chartData} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2329" />
                <XAxis dataKey="time" tick={{ fill: "#4B5563", fontSize: 9 }} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={28} />
                <YAxis yAxisId="price" tick={{ fill: "#4B5563", fontSize: 9 }} axisLine={false} tickLine={false} width={58} domain={["dataMin", "dataMax"]} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(value, name) => [value, name === "price" ? "Price" : name === "entryPrice" ? "Entry" : name === "exitPrice" ? "Exit" : name]} />
                <Line yAxisId="price" type="monotone" dataKey="price" stroke="#848E9C" strokeWidth={1.5} dot={false} activeDot={{ r: 4, fill: "#F0B90B", stroke: "#0B0E11" }} />
                <Line yAxisId="price" type="monotone" dataKey="entryPrice" stroke="transparent" strokeWidth={0} dot={{ r: 4, fill: "#0ECB81", stroke: "#0B0E11", strokeWidth: 1.5 }} activeDot={{ r: 6, fill: "#0ECB81" }} connectNulls={false} />
                <Line yAxisId="price" type="monotone" dataKey="exitPrice" stroke="transparent" strokeWidth={0} dot={{ r: 4, fill: "#F6465D", stroke: "#0B0E11", strokeWidth: 1.5 }} activeDot={{ r: 6, fill: "#F6465D" }} connectNulls={false} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-[#4B5563] text-sm">No price evidence chart is available for this run.</div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-[#848E9C]">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#848E9C]" /> Price path</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0ECB81]" /> Simulated entry</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F6465D]" /> Simulated exit</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2 mt-4">
          {[
            { label: "Candles tested", value: evidence?.candlesTested ?? data.meta?.candlesAnalyzed ?? "—" },
            { label: "Trades simulated", value: data.backtest.numberOfTrades },
            { label: "Starting capital", value: data.backtest.startingCapital || "$1,000 simulated" },
            { label: "Fee assumption", value: data.backtest.feeAssumption || "0.10%" },
            { label: "Buy & Hold", value: data.backtest.benchmarkReturn || "—" },
            { label: "Strategy return", value: data.backtest.totalReturn },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#161A20] rounded-lg border border-[#2B3139] px-3 py-2">
              <div className="text-[#4B5563] text-xs mb-0.5">{label}</div>
              <div className="text-white text-sm font-semibold">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TradeLedgerTable({ data }: { data: StrategyResponse }) {
  const rows = data.tradeLedger ?? [];
  return (
    <div className="bg-[#0F1318] border border-[#2B3139] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#2B3139] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div>
          <div className="text-white text-xs font-semibold uppercase tracking-wide">Simulated Trade Ledger</div>
          <p className="text-[#4B5563] text-xs mt-1">Trade-by-trade evidence behind the backtest result.</p>
        </div>
        <span className="text-[#848E9C] text-xs">{rows.length} ledger rows</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2B3139] bg-[#0B0E11]">
              {["#", "Action", "Time", "Price", "PnL", "Equity", "Reason"].map((col) => (
                <th key={col} className="px-3.5 py-2.5 text-left text-[#848E9C] text-xs font-medium whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? rows.slice(0, 24).map((row, index) => (
              <tr key={row.id ?? `${row.tradeNumber}-${index}`} className={index < rows.length - 1 ? "border-b border-[#1A1F26]" : ""}>
                <td className="px-3.5 py-3 text-[#4B5563] whitespace-nowrap">{row.tradeNumber}</td>
                <td className="px-3.5 py-3 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${row.action === "Entry" ? "bg-[#0ECB81]/8 text-[#0ECB81] border-[#0ECB81]/20" : "bg-[#F6465D]/8 text-[#F6465D] border-[#F6465D]/20"}`}>
                    {row.action}
                  </span>
                </td>
                <td className="px-3.5 py-3 text-[#848E9C] whitespace-nowrap">{row.time}</td>
                <td className="px-3.5 py-3 text-white font-medium whitespace-nowrap">{row.price}</td>
                <td className="px-3.5 py-3 font-medium whitespace-nowrap"><ReturnCell value={row.pnl} /></td>
                <td className="px-3.5 py-3 text-[#C8CDD6] whitespace-nowrap">{row.equity}</td>
                <td className="px-3.5 py-3 text-[#848E9C] min-w-96">{row.reason}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#4B5563] text-sm">No simulated trades were generated for this strategy window.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {rows.length > 24 && (
        <div className="px-4 py-2.5 border-t border-[#2B3139] text-[#4B5563] text-xs">Showing first 24 rows out of {rows.length}. Full ledger is available in the JSON export.</div>
      )}
    </div>
  );
}

function BacktestMethodologyCard({ data }: { data: StrategyResponse }) {
  return (
    <div className="bg-[#0F1318] border border-[#2B3139] rounded-xl p-4">
      <div className="text-white text-xs font-semibold uppercase tracking-wide mb-3">Backtest Methodology</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: "Starting Capital", value: data.backtest.startingCapital || "$1,000 simulated" },
          { label: "Fee Assumption", value: data.backtest.feeAssumption || "0.10% per entry or exit" },
          { label: "Best Trade", value: data.backtest.bestTrade, color: "text-[#0ECB81]" },
          { label: "Worst Trade", value: data.backtest.worstTrade, color: "text-[#F6465D]" },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div className="text-[#4B5563] text-xs mb-0.5">{label}</div>
            <div className={`text-sm font-semibold ${color ?? "text-white"}`}>{value}</div>
          </div>
        ))}
      </div>
      <div className="space-y-2 text-xs text-[#4B5563] leading-relaxed border-t border-[#2B3139] pt-3">
        <p>
          <span className="text-[#848E9C] font-medium">Buy &amp; Hold Benchmark ({data.backtest.benchmarkReturn || "—"}): </span>
          Return from holding {data.symbol} for the same lookback period with no active strategy logic.
        </p>
        <p>
          <span className="text-[#848E9C] font-medium">Outperformance ({data.backtest.alphaVsBenchmark || "—"}): </span>
          Strategy total return minus the buy-and-hold benchmark over the same period.
        </p>
        <p>
          Results are historical simulations for research only. They are not forecasts, financial advice, or a guarantee of future performance.
        </p>
      </div>
    </div>
  );
}

function BacktestTab({ data }: { data: StrategyResponse }) {
  return (
    <div className="flex flex-col gap-3">
      <BacktestEvidenceChart data={data} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <div className="bg-[#0F1318] border border-[#2B3139] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0ECB81]" />
              <span className="text-white text-xs font-semibold uppercase tracking-wide">Equity Curve</span>
            </div>
            <span className="text-[#4B5563] text-xs">Portfolio value · {data.lookbackDays}-day simulation</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={data.equityCurve} margin={{ top: 2, right: 2, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="beststratEquityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ECB81" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#0ECB81" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2329" />
              <XAxis dataKey="time" tick={{ fill: "#4B5563", fontSize: 9 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fill: "#4B5563", fontSize: 9 }} axisLine={false} tickLine={false} width={46} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Area type="monotone" dataKey="value" stroke="#0ECB81" strokeWidth={1.5} fill="url(#beststratEquityGradient)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0F1318] border border-[#2B3139] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F6465D]" />
              <span className="text-white text-xs font-semibold uppercase tracking-wide">Drawdown</span>
            </div>
            <span className="text-[#4B5563] text-xs">% from peak · lower is better</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={data.drawdownCurve} margin={{ top: 2, right: 2, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="beststratDrawdownGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F6465D" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#F6465D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2329" />
              <XAxis dataKey="time" tick={{ fill: "#4B5563", fontSize: 9 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fill: "#4B5563", fontSize: 9 }} axisLine={false} tickLine={false} width={38} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <ReferenceLine y={0} stroke="#2B3139" />
              <Area type="monotone" dataKey="value" stroke="#F6465D" strokeWidth={1.5} fill="url(#beststratDrawdownGradient)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#0F1318] border border-[#2B3139] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F0B90B]" />
            <span className="text-white text-xs font-semibold uppercase tracking-wide">Signal Strength</span>
          </div>
          <span className="text-[#4B5563] text-xs">Composite scores · 0–100</span>
        </div>
        <ResponsiveContainer width="100%" height={135}>
          <BarChart data={data.signalStrength} margin={{ top: 2, right: 2, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2329" />
            <XAxis dataKey="name" tick={{ fill: "#4B5563", fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "#4B5563", fontSize: 9 }} axisLine={false} tickLine={false} width={28} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <ReferenceLine y={50} stroke="#F0B90B" strokeDasharray="3 3" strokeOpacity={0.3} />
            <Bar dataKey="value" fill="#F0B90B" radius={[3, 3, 0, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <TradeLedgerTable data={data} />
      <BacktestMethodologyCard data={data} />
    </div>
  );
}

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return { copied, copy };
}

function ExportCodePanel({ content, label }: { content: string; label: string }) {
  const { copied, copy } = useCopy();
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#4B5563] text-xs">{label}</span>
        <button
          type="button"
          onClick={() => copy(content)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#1E2329] text-[#848E9C] hover:bg-[#2B3139] hover:text-white border border-[#2B3139] transition-colors"
        >
          {copied ? <Check size={11} className="text-[#0ECB81]" /> : <Copy size={11} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="bg-[#0B0E11] border border-[#2B3139] rounded-xl p-4 overflow-x-auto leading-relaxed min-h-44 max-h-72 text-[#C8CDD6]" style={{ fontSize: "11px" }}>
        <code>{content}</code>
      </pre>
    </div>
  );
}

const EXPORT_TABS = [
  { id: "json", label: "JSON Strategy Spec", desc: "Structured spec for direct integration" },
  { id: "markdown", label: "Markdown Report", desc: "Human-readable research report" },
  { id: "cmc", label: "CMC Skill Output", desc: "CoinMarketCap Skill-compatible output" },
  { id: "llm", label: "LLM Skill Output", desc: "Agent-readable Skill output" },
];

function ExportsTab({ data }: { data: StrategyResponse }) {
  const [active, setActive] = useState("json");
  const tab = EXPORT_TABS.find((item) => item.id === active) ?? EXPORT_TABS[0];
  const contentMap: Record<string, string> = {
    json: normalizeForExport(data.jsonOutput),
    markdown: normalizeForExport(data.markdownReport),
    cmc: normalizeForExport(data.cmcSkillOutput),
    llm: normalizeForExport(data.llmSkillOutput),
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 text-[#4B5563] text-xs">
        <Download size={11} />
        <span>Research and developer handoff · {data.symbol} / {data.timeframe}</span>
      </div>
      <div className="flex overflow-x-auto border-b border-[#2B3139] mb-4">
        {EXPORT_TABS.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex-shrink-0 px-4 py-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
              active === item.id ? "text-[#F0B90B] border-b-2 border-[#F0B90B]" : "text-[#848E9C] hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <ExportCodePanel content={contentMap[active] ?? ""} label={tab.desc} />
    </div>
  );
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "rules", label: "Strategy Rules" },
  { id: "signals", label: "Signals" },
  { id: "backtest", label: "Backtest" },
  { id: "exports", label: "Exports" },
  { id: "runs", label: "Recent Runs" },
];

interface Props {
  data: StrategyResponse;
  recentRuns: RecentRun[];
  onViewRun: (run: RecentRun) => void;
}

export function StrategyResultTabs({ data, recentRuns, onViewRun }: Props) {
  const [active, setActive] = useState("overview");

  return (
    <section className="bg-[#161A20] border border-[#2B3139] rounded-2xl overflow-hidden">
      <div className="flex overflow-x-auto border-b border-[#2B3139] bg-[#0F1318]">
        {TABS.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex-shrink-0 px-5 py-3.5 text-xs font-medium transition-colors whitespace-nowrap ${
              active === tab.id
                ? "text-[#F0B90B] border-b-2 border-[#F0B90B] bg-[#F0B90B]/5"
                : "text-[#848E9C] hover:text-white hover:bg-[#161A20]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {active === "overview" && <OverviewTab data={data} />}
        {active === "rules" && <StrategyRulesTab data={data} />}
        {active === "signals" && <SignalsTab data={data} />}
        {active === "backtest" && <BacktestTab data={data} />}
        {active === "exports" && <ExportsTab data={data} />}
        {active === "runs" && <RecentStrategyRunsTable runs={recentRuns} onView={onViewRun} />}
      </div>
    </section>
  );
}
