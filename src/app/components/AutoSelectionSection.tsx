import { CheckCircle2 } from "lucide-react";
import type { AutoSelection } from "../../types/strategy";

function Metric({ label, value, positive }: { label: string; value: string | number; positive?: boolean }) {
  return (
    <div>
      <div className="text-[#848E9C] text-[10px] uppercase tracking-wider mb-0.5">{label}</div>
      <div className={`text-sm font-semibold ${positive ? "text-[#0ECB81]" : "text-[#C8CDD6]"}`}>{value}</div>
    </div>
  );
}

export function AutoSelectionSection({ autoSelection }: { autoSelection?: AutoSelection | null }) {
  if (!autoSelection?.enabled) return null;

  return (
    <section id="auto-selection">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-4 rounded-full bg-[#F0B90B]" />
        <h2 className="text-white" style={{ fontSize: "1rem", fontWeight: 600 }}>Auto Strategy Selection</h2>
        <span className="text-[#848E9C] text-xs ml-1">risk-adjusted comparison</span>
      </div>

      <div className="bg-[#161A20] border border-[#F0B90B]/20 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#2B3139] flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#0ECB81]" />
            <div>
              <div className="text-white font-semibold">Selected: {autoSelection.selectedStrategy}</div>
              <div className="text-[#848E9C] text-xs">
                {autoSelection.selectedFocusLabel} · {autoSelection.selectedRegime} · {autoSelection.selectionScore} selection score
              </div>
            </div>
          </div>
          <p className="text-[#C8CDD6] text-sm md:ml-auto md:max-w-xl leading-relaxed">{autoSelection.reason}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2B3139]">
                {["Rank", "Focus", "Strategy", "Return", "Drawdown", "Win Rate", "Risk Score", "Selection"].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-[#848E9C] text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {autoSelection.candidates.map((candidate, index) => (
                <tr key={candidate.focus} className={`${index < autoSelection.candidates.length - 1 ? "border-b border-[#2B3139]" : ""} ${candidate.selected ? "bg-[#F0B90B]/5" : ""}`}>
                  <td className="px-4 py-3 text-sm text-[#C8CDD6]">#{candidate.rank}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-[#2B3139] text-[#C8CDD6]">{candidate.focusLabel}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white min-w-48">{candidate.strategyName}</td>
                  <td className="px-4 py-3"><Metric label="Total" value={candidate.totalReturn} positive={!candidate.totalReturn.startsWith("-")} /></td>
                  <td className="px-4 py-3"><Metric label="Max DD" value={candidate.maxDrawdown} /></td>
                  <td className="px-4 py-3"><Metric label="Win" value={candidate.winRate} /></td>
                  <td className="px-4 py-3"><Metric label="Risk Adj." value={candidate.riskAdjustedScore} /></td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold text-sm ${candidate.selected ? "text-[#F0B90B]" : "text-[#848E9C]"}`}>
                      {candidate.selected ? `${candidate.selectionScore} · Selected` : `${candidate.selectionScore}`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
