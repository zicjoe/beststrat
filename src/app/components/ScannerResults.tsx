import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, ExternalLink, Loader2, LogIn, ScanLine, Search, Shield } from "lucide-react";
import type { ScannerResponse, ScannerResultRow, StrategyRequest } from "../../types/strategy";

type ScannerState = "ready" | "scanning" | "complete" | "error";

type ScannerResultLike = ScannerResultRow & {
  name?: string;
  category?: string;
  regime?: string;
  entryEvidence?: string[];
  riskEvidence?: string[];
  builderRequest?: StrategyRequest;
};

type ScannerResponseLike = ScannerResponse & {
  categoryId?: string;
  categoryName?: string;
  timeframe?: string;
  lookbackDays?: number;
  riskLevel?: string;
  strategyFocus?: string;
  dataSource?: string;
  fallbackUsed?: boolean;
  summary?: ScannerResponse["summary"] & {
    totalScanned?: number;
    rankedReturned?: number;
    topReturn?: string;
    topRiskScore?: number;
  };
};

function responseResults(result: ScannerResponseLike | null) {
  return (result?.results ?? []) as ScannerResultLike[];
}

function resultCount(result: ScannerResponseLike | null) {
  return result?.summary?.rankedReturned ?? result?.summary?.resultCount ?? responseResults(result).length;
}

function failedCount(result: ScannerResponseLike | null) {
  return result?.summary?.failedCount ?? result?.failures?.length ?? 0;
}

function totalScanned(result: ScannerResponseLike | null) {
  if (!result) return 0;
  return result.summary?.totalScanned ?? result.summary?.resultCount + failedCount(result) ?? responseResults(result).length + failedCount(result);
}

function categoryName(result: ScannerResponseLike | null, fallback = "Selected category") {
  return result?.categoryName ?? result?.category?.name ?? fallback;
}

function timeframe(result: ScannerResponseLike | null) {
  return result?.timeframe ?? result?.request?.timeframe ?? "—";
}

function lookbackDays(result: ScannerResponseLike | null) {
  return result?.lookbackDays ?? result?.request?.lookbackDays ?? "—";
}

function riskLevel(result: ScannerResponseLike | null) {
  return result?.riskLevel ?? result?.request?.riskLevel ?? "—";
}

function dataSourceLabel(result: ScannerResponseLike | null) {
  const source = String(result?.dataSource ?? result?.meta?.source ?? result?.category?.source ?? "cmc").toLowerCase();
  if (source.includes("coinmarketcap") || source.includes("cmc")) return "CMC";
  if (source.includes("sample")) return "Sample data";
  if (source.includes("curated")) return "Curated";
  return source.toUpperCase();
}

function snapshotLabel(result: ScannerResponseLike | null) {
  const snapshot = result?.scannedAt || responseResults(result)[0]?.dataSnapshotAt || "";
  if (!snapshot) return "";
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(snapshot));
  } catch {
    return snapshot;
  }
}

function fallbackNotice(result: ScannerResponseLike | null) {
  const fallbackReason = result?.category?.fallbackReason || result?.meta?.categoryFallbackReason || result?.meta?.note;
  if (result?.fallbackUsed || fallbackReason) {
    return fallbackReason || "Scanner used fallback market data for this scan.";
  }
  return "";
}

function topReturn(result: ScannerResponseLike | null) {
  return result?.summary?.topReturn ?? responseResults(result)[0]?.totalReturn ?? "—";
}

function topRiskScore(result: ScannerResponseLike | null) {
  return result?.summary?.topRiskScore ?? responseResults(result)[0]?.scannerScore ?? result?.summary?.averageScannerScore ?? null;
}

function candidateName(candidate: ScannerResultLike) {
  return candidate.name || candidate.dataSource || "";
}

function candidateCategory(candidate: ScannerResultLike) {
  return candidate.category || candidate.categoryName || "—";
}

function candidateRegime(candidate: ScannerResultLike) {
  return candidate.regime || candidate.detectedRegime || "—";
}

function entryEvidence(candidate: ScannerResultLike) {
  return candidate.entryEvidence?.length ? candidate.entryEvidence : candidate.entryRules || [];
}

function riskEvidence(candidate: ScannerResultLike) {
  return candidate.riskEvidence?.length ? candidate.riskEvidence : candidate.riskRules || [];
}

function scoreColor(score: number) {
  if (score >= 80) return "text-[#0ECB81]";
  if (score >= 60) return "text-[#F0B90B]";
  return "text-[#F6465D]";
}

function returnColor(value?: string) {
  const parsed = Number(String(value ?? "0").replace(/[%+,]/g, ""));
  if (parsed > 0) return "text-[#0ECB81]";
  if (parsed < 0) return "text-[#F6465D]";
  return "text-[#848E9C]";
}

function ScoreBar({ score }: { score: number }) {
  const normalized = Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0;

  return (
    <div className="flex items-center gap-2 min-w-28">
      <div className="h-1.5 flex-1 rounded-full bg-[#2B3139] overflow-hidden">
        <div className="h-full rounded-full bg-[#F0B90B]" style={{ width: `${normalized}%` }} />
      </div>
      <span className={`text-xs font-semibold ${scoreColor(normalized)}`}>{normalized}</span>
    </div>
  );
}

export function ScannerReadyState({ selectedCategoryName }: { selectedCategoryName?: string }) {
  return (
    <div className="bg-[#161A20] border border-[#2B3139] rounded-xl px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#F0B90B]/10 flex items-center justify-center">
          <Search size={15} className="text-[#F0B90B]" />
        </div>
        <div>
          <div className="text-white text-sm font-semibold">Ready to scan</div>
          <div className="text-[#848E9C] text-xs">Select Scan Category to rank strategy candidates{selectedCategoryName ? ` from ${selectedCategoryName}` : ""}.</div>
        </div>
      </div>
    </div>
  );
}

export function ScannerLoadingState({ selectedCategoryName }: { selectedCategoryName?: string }) {
  return (
    <div className="bg-[#161A20] border border-[#F0B90B]/30 rounded-xl px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#F0B90B]/10 flex items-center justify-center">
          <Loader2 size={15} className="text-[#F0B90B] animate-spin" />
        </div>
        <div>
          <div className="text-white text-sm font-semibold">Scanning category</div>
          <div className="text-[#848E9C] text-xs">Ranking candidates{selectedCategoryName ? ` from ${selectedCategoryName}` : ""} by historical simulation quality.</div>
        </div>
      </div>
    </div>
  );
}

export function ScannerCompleteState({ result }: { result: ScannerResponseLike }) {
  const snapshot = snapshotLabel(result);

  return (
    <div className="bg-[#161A20] border border-[#0ECB81]/25 rounded-xl px-5 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#0ECB81]/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={15} className="text-[#0ECB81]" />
          </div>
          <div className="min-w-0">
            <div className="text-white text-sm font-semibold">
              Scan complete <span className="text-[#848E9C] font-normal">{resultCount(result)} candidates ranked · {categoryName(result)} · {timeframe(result)} · {lookbackDays(result)}d</span>
            </div>
            {fallbackNotice(result) ? <div className="text-[#F0B90B] text-xs mt-0.5">Fallback notice: {fallbackNotice(result)}</div> : null}
          </div>
        </div>
        <div className="text-[#4B5563] text-xs whitespace-nowrap">
          Source: <span className="text-[#848E9C]">{dataSourceLabel(result)}</span>{snapshot ? <span> · {snapshot}</span> : null}
        </div>
      </div>
    </div>
  );
}

export function ScannerErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-[#161A20] border border-[#F6465D]/25 rounded-xl px-5 py-4">
      <div className="flex items-start gap-3">
        <AlertTriangle size={15} className="text-[#F6465D] flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-semibold mb-0.5">Scan failed</div>
          <div className="text-[#848E9C] text-xs leading-relaxed">{message || "The scanner could not complete this request."}</div>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F0B90B] text-[#0B0E11] hover:bg-[#F0B90B]/90 transition-colors"
        >
          Retry Scan
        </button>
      </div>
    </div>
  );
}

export function ScannerStatusCard({
  state,
  result,
  errorMessage,
  selectedCategoryName,
  onRetry,
}: {
  state: ScannerState;
  result: ScannerResponseLike | null;
  errorMessage: string;
  selectedCategoryName?: string;
  onRetry: () => void;
}) {
  if (state === "ready") return <ScannerReadyState selectedCategoryName={selectedCategoryName} />;
  if (state === "scanning") return <ScannerLoadingState selectedCategoryName={selectedCategoryName} />;
  if (state === "error") return <ScannerErrorState message={errorMessage} onRetry={onRetry} />;
  if (state === "complete" && result) return <ScannerCompleteState result={result} />;
  return null;
}

export function ScannerEmptyState() {
  return (
    <div className="bg-[#161A20] border border-dashed border-[#2B3139] rounded-2xl p-8 text-center">
      <div className="w-12 h-12 mx-auto rounded-full bg-[#1E2329] flex items-center justify-center mb-3">
        <ScanLine size={20} className="text-[#848E9C]" />
      </div>
      <div className="text-white text-sm font-semibold">No scan results yet</div>
      <p className="text-[#848E9C] text-xs mt-1 max-w-md mx-auto">Use the scanner controls to rank token candidates by strategy fit, backtest quality, drawdown control, and risk-adjusted scoring.</p>
    </div>
  );
}

export function ScannerErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <ScannerErrorState message={message} onRetry={onRetry} />;
}

export function ScannerNoResultsState() {
  return (
    <div className="bg-[#161A20] border border-[#2B3139] rounded-2xl p-8 text-center">
      <div className="text-white text-sm font-semibold">No ranked candidates returned</div>
      <p className="text-[#848E9C] text-xs mt-1">Try a broader category, longer lookback period, or a different strategy focus.</p>
    </div>
  );
}

export function ScannerSkippedTokens({ failures }: { failures?: { symbol: string; error: string }[] }) {
  if (!failures?.length) return null;

  return (
    <div className="bg-[#161A20] border border-[#F0B90B]/20 rounded-xl p-4">
      <div className="text-white text-xs font-semibold uppercase tracking-wide mb-2">Skipped tokens</div>
      <div className="flex flex-wrap gap-2">
        {failures.map((failure) => (
          <span key={`${failure.symbol}-${failure.error}`} className="px-2 py-1 rounded-lg bg-[#F0B90B]/10 text-[#F0B90B] border border-[#F0B90B]/20 text-xs">
            {failure.symbol}: {failure.error}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ScanSummaryMetricCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-[#161A20] border border-[#2B3139] rounded-xl p-3.5 min-w-0 min-h-[5.5rem] flex flex-col justify-between">
      <div className="text-[#4B5563] text-xs uppercase tracking-wider leading-snug">{label}</div>
      <div className={`text-base font-bold leading-tight break-words ${color ?? "text-white"}`}>{value}</div>
    </div>
  );
}

function ScanTopStrategyCard({ value }: { value: string | number }) {
  return (
    <div className="bg-[#161A20] border border-[#2B3139] rounded-xl p-4 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <div className="text-[#4B5563] text-xs uppercase tracking-wider whitespace-nowrap">Top Strategy</div>
        <div className="text-white text-sm sm:text-base font-semibold leading-snug break-words">{value}</div>
      </div>
    </div>
  );
}

export function ScanSummarySection({ result }: { result: ScannerResponseLike }) {
  const score = topRiskScore(result);
  const topStrategy = result.summary?.topStrategy ?? responseResults(result)[0]?.selectedStrategy ?? "—";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-2.5">
        <span className="w-1 h-4 rounded-full bg-[#F0B90B]" />
        <span className="text-white text-xs font-semibold uppercase tracking-wide">Scan Summary</span>
        <span className="text-[#4B5563] text-xs ml-1">Executive overview</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5">
        <ScanSummaryMetricCard label="Category" value={categoryName(result)} color="text-[#F0B90B]" />
        <ScanSummaryMetricCard label="Total Scanned" value={totalScanned(result)} />
        <ScanSummaryMetricCard label="Ranked" value={resultCount(result)} color="text-[#0ECB81]" />
        <ScanSummaryMetricCard label="Top Symbol" value={result.summary?.topSymbol ?? responseResults(result)[0]?.symbol ?? "—"} color="text-[#F0B90B]" />
        <ScanSummaryMetricCard label="Top Return" value={topReturn(result)} color="text-[#0ECB81]" />
        <ScanSummaryMetricCard label="Top Risk Score" value={score === null ? "—" : `${score}/100`} color="text-[#0ECB81]" />
      </div>
      <div className="mt-2.5">
        <ScanTopStrategyCard value={topStrategy} />
      </div>
    </div>
  );
}

export function OpenInBuilderButton({ candidate, onOpenBuilder, primary }: { candidate: ScannerResultLike; onOpenBuilder: (candidate: ScannerResultLike) => void; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => onOpenBuilder(candidate)}
      className={
        primary
          ? "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-[#F0B90B] text-[#0B0E11] hover:bg-[#F0B90B]/90 active:scale-[0.98] transition-all"
          : "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#F0B90B]/10 text-[#F0B90B] border border-[#F0B90B]/30 hover:bg-[#F0B90B]/20 transition-colors whitespace-nowrap"
      }
    >
      {primary ? "Open Full Strategy in Builder" : "Builder"}
      {primary ? <ArrowRight size={15} /> : <ExternalLink size={11} />}
    </button>
  );
}

function InspectCandidateButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
        active ? "bg-[#2B3139] text-white border-[#3B4149]" : "bg-[#1E2329] text-[#848E9C] border-[#2B3139] hover:bg-[#2B3139] hover:text-white"
      }`}
    >
      {active ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
      Inspect
    </button>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-[#F0B90B] text-[#0B0E11]">1</span>;
  if (rank === 2) return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-[#848E9C]/30 text-[#C8CDD6]">2</span>;
  if (rank === 3) return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-[#CD7F32]/20 text-[#CD7F32]">3</span>;
  return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium text-[#4B5563]">{rank}</span>;
}

function CandidateMetricPill({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="min-w-[5.5rem] rounded-xl border border-[#2B3139] bg-[#0F1318] px-3 py-2">
      <div className="text-[#4B5563] text-[10px] uppercase tracking-wider leading-none mb-1.5">{label}</div>
      <div className={`text-sm font-semibold leading-tight ${color ?? "text-white"}`}>{value || "—"}</div>
    </div>
  );
}

function CandidateScorePill({ score }: { score: number }) {
  const normalized = Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0;

  return (
    <div className="min-w-[7rem] rounded-xl border border-[#2B3139] bg-[#0F1318] px-3 py-2">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[#4B5563] text-[10px] uppercase tracking-wider leading-none">Score</span>
        <span className={`text-xs font-bold ${scoreColor(normalized)}`}>{normalized}/100</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#2B3139] overflow-hidden">
        <div className="h-full rounded-full bg-[#F0B90B]" style={{ width: `${normalized}%` }} />
      </div>
    </div>
  );
}

function CandidateHeaderCard({
  candidate,
  isInspected,
  onInspect,
  onOpenBuilder,
}: {
  candidate: ScannerResultLike;
  isInspected: boolean;
  onInspect: () => void;
  onOpenBuilder: (candidate: ScannerResultLike) => void;
}) {
  return (
    <div className={`p-4 transition-colors ${candidate.rank === 1 ? "bg-[#F0B90B]/3" : "bg-[#161A20]"}`}>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] xl:grid-cols-[auto_minmax(9rem,0.8fr)_minmax(13rem,1.1fr)_minmax(16rem,1fr)] gap-3 xl:gap-4 items-start">
        <div className="pt-0.5">
          <RankBadge rank={candidate.rank} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#F0B90B] font-bold text-base leading-tight">{candidate.symbol}</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] bg-[#1E2329] text-[#848E9C] border border-[#2B3139]">{candidateCategory(candidate)}</span>
          </div>
          <div className="text-[#4B5563] text-xs truncate mt-1">{candidateName(candidate) || "CoinMarketCap latest quote + deterministic backtest candles"}</div>
        </div>

        <div className="min-w-0 col-span-2 xl:col-span-1">
          <div className="text-[#4B5563] text-[10px] uppercase tracking-wider mb-1">Selected Strategy</div>
          <div className="text-[#C8CDD6] text-sm font-semibold leading-snug break-words">{candidate.selectedStrategy}</div>
          <div className="mt-2 inline-flex max-w-full px-2 py-0.5 rounded-full text-xs bg-[#F0B90B]/8 text-[#F0B90B] border border-[#F0B90B]/20">
            <span className="truncate">{candidateRegime(candidate)}</span>
          </div>
        </div>

        <div className="col-span-2 xl:col-span-1 min-w-0 flex flex-col gap-3 xl:items-end">
          <div className="flex flex-wrap gap-2 xl:justify-end">
            <CandidateMetricPill label="Return" value={candidate.totalReturn} color={returnColor(candidate.totalReturn)} />
            <CandidateMetricPill label="Win Rate" value={candidate.winRate} />
            <CandidateScorePill score={candidate.scannerScore} />
          </div>
          <div className="flex flex-wrap gap-2 xl:justify-end">
            <InspectCandidateButton active={isInspected} onClick={onInspect} />
            <OpenInBuilderButton candidate={candidate} onOpenBuilder={onOpenBuilder} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CandidateOverviewCard({ candidate }: { candidate: ScannerResultLike }) {
  const overview = [
    { label: "Strategy", value: candidate.selectedStrategy },
    { label: "Regime", value: candidateRegime(candidate), color: "text-[#F0B90B]" },
    { label: "Return", value: candidate.totalReturn, color: returnColor(candidate.totalReturn) },
    { label: "Max DD", value: candidate.maxDrawdown, color: "text-[#F6465D]" },
    { label: "Win Rate", value: candidate.winRate },
    { label: "Outperf.", value: candidate.outperformance, color: returnColor(candidate.outperformance) },
    { label: "Score", value: `${candidate.scannerScore}/100`, color: scoreColor(candidate.scannerScore) },
  ];

  return (
    <div className="bg-[#0F1318] border border-[#2B3139] rounded-xl p-4">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-[#4B5563] text-xs uppercase tracking-wider mb-0.5">Inspecting</div>
          <div className="flex items-baseline gap-2">
            <span className="text-[#F0B90B] font-bold text-xl">{candidate.symbol}</span>
            <span className="text-[#848E9C] text-sm">{candidate.name || candidateCategory(candidate)}</span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#F0B90B]/10 text-[#F0B90B] border border-[#F0B90B]/30">Rank #{candidate.rank}</span>
      </div>
      <div className="grid gap-px rounded-xl overflow-hidden border border-[#2B3139] bg-[#2B3139]" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(7rem, 1fr))" }}>
        {overview.map(({ label, value, color }) => (
          <div key={label} className="bg-[#0F1318] px-3 py-2.5 min-w-0">
            <div className="text-[#4B5563] text-xs uppercase tracking-wider mb-0.5">{label}</div>
            <div className={`text-sm font-semibold truncate ${color ?? "text-white"}`}>{value || "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CandidateSummaryCard({ candidate }: { candidate: ScannerResultLike }) {
  return (
    <div className="bg-[#0F1318] border border-[#2B3139] rounded-xl p-4">
      <div className="text-white text-xs font-semibold uppercase tracking-wide mb-2">Why this candidate ranked highly</div>
      <p className="text-[#9CA3AF] text-sm leading-relaxed">{candidate.strategySummary || "The scanner ranked this candidate using historical return, drawdown control, win rate, outperformance, and regime fit."}</p>
    </div>
  );
}

function CandidateEvidenceCard({ candidate }: { candidate: ScannerResultLike }) {
  const entries = entryEvidence(candidate);
  const risks = riskEvidence(candidate);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="bg-[#0F1318] border border-[#0ECB81]/20 border-l-2 border-l-[#0ECB81] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <LogIn size={12} className="text-[#0ECB81]" />
          <span className="text-white text-xs font-semibold uppercase tracking-wide">Entry Evidence</span>
        </div>
        <ul className="space-y-1.5">
          {(entries.length ? entries : ["No entry evidence returned for this candidate."]).map((item, index) => (
            <li key={`${item}-${index}`} className="flex items-start gap-2 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0ECB81] mt-1.5 flex-shrink-0" />
              <span className="text-[#C8CDD6]">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-[#0F1318] border border-[#F6465D]/20 border-l-2 border-l-[#F6465D] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <Shield size={12} className="text-[#F6465D]" />
          <span className="text-white text-xs font-semibold uppercase tracking-wide">Risk Evidence</span>
        </div>
        <ul className="space-y-1.5">
          {(risks.length ? risks : ["No risk evidence returned for this candidate."]).map((item, index) => (
            <li key={`${item}-${index}`} className="flex items-start gap-2 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F6465D] mt-1.5 flex-shrink-0" />
              <span className="text-[#C8CDD6]">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function CandidateInspectPanel({ candidate, onOpenBuilder }: { candidate: ScannerResultLike; onOpenBuilder: (candidate: ScannerResultLike) => void }) {
  return (
    <div className="border-t border-[#2B3139] bg-[#161A20] rounded-b-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-[#2B3139] bg-[#0F1318]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F0B90B]" />
        <span className="text-white text-xs font-semibold uppercase tracking-wide">Research Detail — {candidate.symbol}</span>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <CandidateOverviewCard candidate={candidate} />
        <CandidateSummaryCard candidate={candidate} />
        <CandidateEvidenceCard candidate={candidate} />
        <OpenInBuilderButton candidate={candidate} onOpenBuilder={onOpenBuilder} primary />
      </div>
    </div>
  );
}

export function RankedCandidatesTable({
  candidates,
  onOpenBuilder,
}: {
  candidates: ScannerResultLike[];
  onOpenBuilder: (candidate: ScannerResultLike) => void;
}) {
  const [inspectedRank, setInspectedRank] = useState<number | null>(null);

  useEffect(() => {
    setInspectedRank(null);
  }, [candidates]);

  return (
    <div className="space-y-3">
      {candidates.map((candidate) => {
        const isInspected = inspectedRank === candidate.rank;

        return (
          <article key={`${candidate.rank}-${candidate.symbol}`} className="bg-[#161A20] border border-[#2B3139] rounded-2xl overflow-hidden min-w-0">
            <CandidateHeaderCard
              candidate={candidate}
              isInspected={isInspected}
              onInspect={() => setInspectedRank((previous) => (previous === candidate.rank ? null : candidate.rank))}
              onOpenBuilder={onOpenBuilder}
            />
            {isInspected ? <CandidateInspectPanel candidate={candidate} onOpenBuilder={onOpenBuilder} /> : null}
          </article>
        );
      })}
    </div>
  );
}

export function RankedCandidatesSection({
  candidates,
  onOpenBuilder,
}: {
  candidates: ScannerResultLike[];
  onOpenBuilder: (candidate: ScannerResultLike) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-1 h-4 rounded-full bg-[#F0B90B]" />
        <span className="text-white text-xs font-semibold uppercase tracking-wide">Top Strategy Candidates</span>
        <span className="text-[#4B5563] text-xs ml-1">Ranked by historical performance, drawdown control, and strategy quality</span>
      </div>
      <RankedCandidatesTable candidates={candidates} onOpenBuilder={onOpenBuilder} />
    </div>
  );
}
