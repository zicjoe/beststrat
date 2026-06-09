import { Eye } from "lucide-react";
import type { RecentRun } from "../../types/strategy";

function ReturnBadge({ value }: { value: string }) {
  const isNeg = value.startsWith("-");
  return (
    <span className={`font-medium ${isNeg ? "text-[#F6465D]" : "text-[#0ECB81]"}`}>{value}</span>
  );
}

interface Props {
  runs: RecentRun[];
  onView: (run: RecentRun) => void;
}

export function RecentStrategyRunsTable({ runs, onView }: Props) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-4 rounded-full bg-[#F0B90B]" />
        <h2 className="text-white" style={{ fontSize: "1rem", fontWeight: 600 }}>Recent Strategy Runs</h2>
        <span className="text-[#848E9C] text-xs ml-1">{runs.length} results</span>
      </div>
      <div className="bg-[#161A20] border border-[#2B3139] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2B3139]">
                {["Token", "Timeframe", "Regime", "Strategy", "Total Return", "Max Drawdown", "Created", ""].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-[#848E9C] text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {runs.map((run, i) => (
                <tr
                  key={run.id}
                  className={`hover:bg-[#1E2329] transition-colors ${i < runs.length - 1 ? "border-b border-[#2B3139]" : ""}`}
                >
                  <td className="px-4 py-3">
                    <span className="text-[#F0B90B] font-semibold text-sm">{run.token}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[#C8CDD6] text-sm">{run.timeframe}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-[#2B3139] text-[#C8CDD6]">{run.regime}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[#C8CDD6] text-sm">{run.strategy}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <ReturnBadge value={run.totalReturn} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[#F6465D] text-sm">{run.maxDrawdown}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[#848E9C] text-xs whitespace-nowrap">{run.createdAt}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onView(run)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1E2329] text-[#848E9C] hover:bg-[#2B3139] hover:text-white border border-[#2B3139] transition-colors"
                    >
                      <Eye size={12} />
                      View
                    </button>
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
