import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { fetchScannerCategories, scanStrategyCategory } from "../../lib/api";
import type { ScannerCategory, ScannerRequest, ScannerResponse, ScannerResultRow } from "../../types/strategy";
import { ScannerControlPanel } from "../components/ScannerControlPanel";
import {
  RankedCandidatesSection,
  ScanSummarySection,
  ScannerEmptyState,
  ScannerErrorPanel,
  ScannerNoResultsState,
  ScannerSkippedTokens,
  ScannerStatusCard,
} from "../components/ScannerResults";

type ScannerState = "ready" | "scanning" | "complete" | "error";

type ScannerResultLike = ScannerResultRow & {
  builderRequest?: ScannerResultRow["builderRequest"];
};

type ScannerResponseLike = ScannerResponse & {
  categoryName?: string;
  timeframe?: string;
  lookbackDays?: number;
  riskLevel?: string;
  summary?: ScannerResponse["summary"] & {
    rankedReturned?: number;
  };
};

function getResultCount(scan: ScannerResponseLike | null) {
  return scan?.summary?.rankedReturned ?? scan?.summary?.resultCount ?? scan?.results?.length ?? 0;
}

function getCategoryName(scan: ScannerResponseLike | null, fallback?: string) {
  return scan?.categoryName ?? scan?.category?.name ?? fallback ?? "Selected category";
}

function getScanTimeframe(scan: ScannerResponseLike | null, fallback: string) {
  return scan?.timeframe ?? scan?.request?.timeframe ?? fallback;
}

function getScanLookback(scan: ScannerResponseLike | null, fallback: number) {
  return scan?.lookbackDays ?? scan?.request?.lookbackDays ?? fallback;
}

function getScanRisk(scan: ScannerResponseLike | null, fallback: string) {
  return scan?.riskLevel ?? scan?.request?.riskLevel ?? fallback;
}

export function ScannerPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ScannerCategory[]>([]);
  const [categoryId, setCategoryId] = useState("popular");
  const [timeframe, setTimeframe] = useState("1h");
  const [lookbackDays, setLookbackDays] = useState(30);
  const [riskLevel, setRiskLevel] = useState("moderate");
  const [strategyFocus, setStrategyFocus] = useState("auto");
  const [limit, setLimit] = useState(5);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [scanState, setScanState] = useState<ScannerState>("ready");
  const [errorMessage, setErrorMessage] = useState("");
  const [scan, setScan] = useState<ScannerResponseLike | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchScannerCategories()
      .then((response) => {
        if (cancelled) return;
        const nextCategories = response.categories || [];
        setCategories(nextCategories);
        if (!nextCategories.find((category) => category.id === categoryId) && nextCategories[0]) {
          setCategoryId(nextCategories[0].id);
        }
      })
      .catch((error) => {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Could not load scanner categories.";
        setErrorMessage(message);
        setScanState("error");
      })
      .finally(() => {
        if (!cancelled) setIsLoadingCategories(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedCategory = useMemo(() => categories.find((category) => category.id === categoryId), [categories, categoryId]);

  const quickStats = scan
    ? [
        { label: "Category", value: getCategoryName(scan, selectedCategory?.name) },
        { label: "Candidates", value: `${getResultCount(scan)} ranked` },
        { label: "Timeframe", value: getScanTimeframe(scan, timeframe) },
        { label: "Lookback", value: `${getScanLookback(scan, lookbackDays)}d` },
        { label: "Risk Level", value: getScanRisk(scan, riskLevel) },
      ]
    : [];

  const handleCategoryChange = (nextCategoryId: string) => {
    setCategoryId(nextCategoryId);
  };

  const handleScan = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const request: ScannerRequest = { categoryId, timeframe, lookbackDays, riskLevel, strategyFocus, limit };
    setScanState("scanning");
    setErrorMessage("");
    setScan(null);

    try {
      const response = await scanStrategyCategory(request);
      setScan(response as ScannerResponseLike);
      setScanState("complete");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Strategy scanner failed.";
      setErrorMessage(message);
      setScanState("error");
    }
  };

  const handleRetry = () => {
    setScanState("ready");
    setErrorMessage("");
    setScan(null);
  };

  const openBuilder = (candidate: ScannerResultLike) => {
    const builderRequest = candidate.builderRequest;
    const params = new URLSearchParams({
      symbol: (builderRequest?.symbol || candidate.symbol || "BTC").toUpperCase(),
      timeframe: builderRequest?.timeframe || timeframe,
      lookbackDays: String(builderRequest?.lookbackDays || lookbackDays),
      riskLevel: builderRequest?.riskLevel || riskLevel,
      strategyFocus: builderRequest?.strategyFocus || strategyFocus,
      run: "1",
    });
    navigate(`/builder?${params.toString()}`);
  };

  return (
    <div>
      <div className="border-b border-[#2B3139] bg-[#0B0E11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-3">
            <h1 className="text-white mb-1" style={{ fontSize: "1.15rem", fontWeight: 700, lineHeight: 1.2 }}>
              Strategy Scanner
            </h1>
            <p className="text-[#848E9C] text-sm">Discover top backtested strategy candidates across token categories</p>
            <p className="text-[#4B5563] text-xs mt-1 max-w-2xl leading-relaxed">
              Select a category, scan strategy candidates, and inspect the strongest setups based on historical simulation and risk-adjusted scoring.
            </p>
          </div>

          {quickStats.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {quickStats.map(({ label, value }) => (
                <span key={label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#1E2329] border border-[#2B3139] text-[#848E9C]">
                  <span className="text-[#4B5563]">{label}:</span>
                  <span className="text-white font-medium">{value}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-5 items-start">
          <aside className="w-full md:w-72 xl:w-80 flex-shrink-0 min-w-0 md:sticky md:top-24 md:max-h-[calc(100vh-7rem)]">
            <ScannerControlPanel
              categories={categories}
              categoryId={categoryId}
              timeframe={timeframe}
              lookbackDays={lookbackDays}
              riskLevel={riskLevel}
              strategyFocus={strategyFocus}
              limit={limit}
              isLoadingCategories={isLoadingCategories}
              isScanning={scanState === "scanning"}
              onCategoryChange={handleCategoryChange}
              onLimitChange={setLimit}
              onTimeframeChange={setTimeframe}
              onLookbackChange={setLookbackDays}
              onRiskLevelChange={setRiskLevel}
              onStrategyFocusChange={setStrategyFocus}
              onScan={handleScan}
            />
          </aside>

          <main className="flex-1 min-w-0 w-full flex flex-col gap-5">
            <ScannerStatusCard
              state={scanState}
              result={scan}
              errorMessage={errorMessage}
              selectedCategoryName={selectedCategory?.name}
              onRetry={handleRetry}
            />

            {scanState === "ready" ? <ScannerEmptyState /> : null}
            {scanState === "error" ? <ScannerErrorPanel message={errorMessage} onRetry={handleRetry} /> : null}

            {scanState === "complete" && scan ? (
              <>
                <ScanSummarySection result={scan} />
                {scan.results?.length ? <RankedCandidatesSection candidates={scan.results as ScannerResultLike[]} onOpenBuilder={openBuilder} /> : <ScannerNoResultsState />}
                <ScannerSkippedTokens failures={scan.failures} />
              </>
            ) : null}
          </main>
        </div>
      </div>

      <footer className="border-t border-[#2B3139] mt-6 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[#4B5563] text-xs">BestStrat · CMC Strategy Skill Builder</span>
          <span className="text-[#4B5563] text-xs">Scanner ranks candidates only · Not financial advice · Does not execute trades</span>
        </div>
      </footer>
    </div>
  );
}
