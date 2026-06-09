import type { Signal } from "../../types/strategy";

function scoreColor(score: number) {
  if (score >= 65) return "text-[#0ECB81]";
  if (score >= 45) return "text-[#F0B90B]";
  return "text-[#F6465D]";
}

function scoreBarColor(score: number) {
  if (score >= 65) return "bg-[#0ECB81]";
  if (score >= 45) return "bg-[#F0B90B]";
  return "bg-[#F6465D]";
}

function statusBadge(status: string) {
  const s = status.toLowerCase();
  if (["bullish", "positive", "strong", "momentum"].includes(s))
    return "bg-[#0ECB81]/10 text-[#0ECB81] border-[#0ECB81]/30";
  if (["bearish", "negative", "weak"].includes(s))
    return "bg-[#F6465D]/10 text-[#F6465D] border-[#F6465D]/30";
  return "bg-[#F0B90B]/10 text-[#F0B90B] border-[#F0B90B]/30";
}

export function SignalScoreCard({ signal }: { signal: Signal }) {
  return (
    <div className="bg-[#161A20] border border-[#2B3139] rounded-xl p-4 hover:border-[#3B4149] transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-white text-sm font-semibold">{signal.name}</div>
          <div className="text-[#848E9C] text-xs mt-0.5 leading-relaxed">{signal.reason}</div>
        </div>
        <div className="flex flex-col items-end gap-1 ml-3">
          <div className={`text-lg font-bold ${scoreColor(signal.score)}`}>{signal.score}</div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge(signal.status)}`}>
            {signal.status}
          </span>
        </div>
      </div>
      <div className="h-1 bg-[#2B3139] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${scoreBarColor(signal.score)}`}
          style={{ width: `${signal.score}%` }}
        />
      </div>
    </div>
  );
}

export function SignalBreakdownSection({ signals }: { signals: Signal[] }) {
  return (
    <section id="signals">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-4 rounded-full bg-[#F0B90B]" />
        <h2 className="text-white" style={{ fontSize: "1rem", fontWeight: 600 }}>Signal Breakdown</h2>
        <span className="text-[#848E9C] text-xs ml-1">{signals.length} signals analyzed</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {signals.map((signal) => (
          <SignalScoreCard key={signal.name} signal={signal} />
        ))}
      </div>
    </section>
  );
}
