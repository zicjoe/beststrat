import type { Backtest } from "../../types/strategy";

interface MetricProps {
  label: string;
  value: string | number;
  positive?: boolean;
  negative?: boolean;
  neutral?: boolean;
  large?: boolean;
}

export function BacktestMetricCard({ label, value, positive, negative, neutral, large }: MetricProps) {
  let valueClass = "text-white";
  if (positive) valueClass = "text-[#0ECB81]";
  if (negative) valueClass = "text-[#F6465D]";
  if (neutral) valueClass = "text-[#F0B90B]";

  return (
    <div className="bg-[#161A20] border border-[#2B3139] rounded-xl p-4">
      <div className="text-[#848E9C] text-xs font-medium uppercase tracking-wider mb-1.5">{label}</div>
      <div className={`font-bold ${valueClass}`} style={{ fontSize: large ? "1.5rem" : "1.25rem" }}>
        {value}
      </div>
    </div>
  );
}

export function BacktestResultsSection({ backtest }: { backtest: Backtest }) {
  return (
    <section id="backtest">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-4 rounded-full bg-[#F0B90B]" />
        <h2 className="text-white" style={{ fontSize: "1rem", fontWeight: 600 }}>Backtest Results</h2>
        <span className="text-[#848E9C] text-xs ml-1">Simulated — not live performance</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <BacktestMetricCard label="Total Return" value={backtest.totalReturn} positive large />
        <BacktestMetricCard label="Win Rate" value={backtest.winRate} positive />
        <BacktestMetricCard label="Max Drawdown" value={backtest.maxDrawdown} negative />
        <BacktestMetricCard label="Risk Adj. Score" value={backtest.riskAdjustedScore} neutral />
        <BacktestMetricCard label="Number of Trades" value={backtest.numberOfTrades} />
        <BacktestMetricCard label="Avg Trade Return" value={backtest.averageTradeReturn} positive />
        <BacktestMetricCard label="Best Trade" value={backtest.bestTrade} positive />
        <BacktestMetricCard label="Worst Trade" value={backtest.worstTrade} negative />
        {backtest.benchmarkReturn && <BacktestMetricCard label="Benchmark" value={backtest.benchmarkReturn} neutral />}
        {backtest.alphaVsBenchmark && <BacktestMetricCard label="Alpha vs Benchmark" value={backtest.alphaVsBenchmark} positive={String(backtest.alphaVsBenchmark).startsWith("-") === false} negative={String(backtest.alphaVsBenchmark).startsWith("-")} />}
        {backtest.modelExposure && <BacktestMetricCard label="Model Exposure" value={backtest.modelExposure} />}
        {backtest.feeAssumption && <BacktestMetricCard label="Fee Assumption" value={backtest.feeAssumption} />}
      </div>
      <div className="mt-3 bg-[#161A20] border border-[#2B3139] rounded-xl p-4">
        <div className="text-[#848E9C] text-xs font-medium uppercase tracking-wider mb-2">Backtest Methodology</div>
        <p className="text-[#C8CDD6] text-sm leading-relaxed">
          Starting capital: {backtest.startingCapital || "$1,000 simulated"}. Fees: {backtest.feeAssumption || "0.10% per entry or exit"}.
          Benchmark compares the generated strategy against buy-and-hold over the same backtest window. Results are simulated and for research only.
        </p>
      </div>
    </section>
  );
}
