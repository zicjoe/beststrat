import { useEffect, useState } from "react";
import { StrategyInputPanel } from "../components/StrategyInputPanel";
import { MarketRegimeSection } from "../components/MarketRegimeSection";
import { GeneratedStrategySpec } from "../components/GeneratedStrategySpec";
import { SignalBreakdownSection } from "../components/SignalBreakdownSection";
import { BacktestResultsSection } from "../components/BacktestResultsSection";
import { ChartsSection } from "../components/Charts";
import { ExportSection } from "../components/ExportSection";
import { RecentStrategyRunsTable } from "../components/RecentStrategyRunsTable";
import { LoadingState, EmptyState, ErrorState } from "../components/StateComponents";
import { fetchRecentRuns, fetchStrategyRun, generateStrategy } from "../../lib/api";
import { mockRecentRuns } from "../../data/mockStrategy";
import type { StrategyResponse, StrategyRequest, RecentRun, AppState } from "../../types/strategy";

export function BuilderPage() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [strategyData, setStrategyData] = useState<StrategyResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [recentRuns, setRecentRuns] = useState<RecentRun[]>(mockRecentRuns);

  useEffect(() => {
    fetchRecentRuns()
      .then((runs) => {
        if (runs.length) setRecentRuns(runs);
      })
      .catch(() => {
        // Keep Figma sample rows visible if the backend has not generated runs yet.
      });
  }, []);

  const handleGenerate = async (request: StrategyRequest) => {
    setAppState("loading");
    setStrategyData(null);
    setErrorMessage("");
    try {
      const result = await generateStrategy(request);
      setStrategyData(result);
      setAppState("success");
      const nextRuns = await fetchRecentRuns().catch(() => []);
      if (nextRuns.length) {
        setRecentRuns(nextRuns);
      } else {
        const newRun: RecentRun = {
          id: result.id || Date.now().toString(),
          token: result.symbol,
          timeframe: result.timeframe,
          regime: result.detectedRegime,
          strategy: result.strategyName,
          totalReturn: result.backtest.totalReturn,
          maxDrawdown: result.backtest.maxDrawdown,
          createdAt: result.createdAt || new Date().toISOString().slice(0, 16).replace("T", " "),
        };
        setRecentRuns((prev) => [newRun, ...prev.slice(0, 9)]);
      }
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
      setAppState("error");
    }
  };

  const handleViewRun = async (run: RecentRun) => {
    if (!run.id || ["1", "2", "3", "4", "5"].includes(run.id)) return;
    setAppState("loading");
    setErrorMessage("");
    try {
      const result = await fetchStrategyRun(run.id);
      setStrategyData(result);
      setAppState("success");
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Could not load the strategy run.");
      setAppState("error");
    }
  };

  const handleRetry = () => {
    setAppState("idle");
    setErrorMessage("");
  };

  return (
    <div>
      <div className="border-b border-[#2B3139] bg-[#0B0E11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-white" style={{ fontSize: "1.1rem", fontWeight: 700, lineHeight: 1.2 }}>
                Strategy Builder
              </h1>
              <p className="text-[#848E9C] text-xs mt-0.5">
                Configure parameters · Generate regime-aware strategy · Export CMC Skill spec
              </p>
            </div>
            <span className="ml-auto hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#0ECB81]/10 text-[#0ECB81] border border-[#0ECB81]/30">
              Strategy Spec Mode — no trades executed
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-72 xl:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <StrategyInputPanel onGenerate={handleGenerate} isLoading={appState === "loading"} />
            </div>
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-8">
            {appState === "idle" && <EmptyState />}
            {appState === "loading" && <LoadingState />}
            {appState === "error" && <ErrorState message={errorMessage} onRetry={handleRetry} />}

            {appState === "success" && strategyData && (
              <>
                <MarketRegimeSection data={strategyData} />
                <GeneratedStrategySpec data={strategyData} />
                <SignalBreakdownSection signals={strategyData.signals} />
                <BacktestResultsSection backtest={strategyData.backtest} />
                <ChartsSection
                  equityCurve={strategyData.equityCurve}
                  drawdownCurve={strategyData.drawdownCurve}
                  signalStrength={strategyData.signalStrength}
                />
                <ExportSection data={strategyData} />
              </>
            )}

            <RecentStrategyRunsTable runs={recentRuns} onView={handleViewRun} />
          </div>
        </div>
      </div>

      <footer className="border-t border-[#2B3139] mt-8 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[#4B5563] text-xs">
            BestStrat · CMC Strategy Skill Builder · Track 2 · BNB Hack AI Trading Agent Edition
          </span>
          <span className="text-[#4B5563] text-xs">
            Generates strategy specs only · Not financial advice · Does not execute trades
          </span>
        </div>
      </footer>
    </div>
  );
}
