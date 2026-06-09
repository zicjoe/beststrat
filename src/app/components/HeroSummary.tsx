import { BarChart2, ShieldCheck, FileCode } from "lucide-react";

export function HeroSummary() {
  return (
    <div className="border-b border-[#2B3139] bg-gradient-to-b from-[#161A20] to-[#0B0E11] px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0ECB81] animate-pulse" />
          <span className="text-[#0ECB81] text-xs font-medium tracking-widest uppercase">Live Strategy Engine</span>
        </div>
        <h1 className="text-white mb-3 max-w-2xl" style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.25 }}>
          Generate backtestable crypto strategies
          <span className="text-[#F0B90B]"> from CMC market data</span>
        </h1>
        <p className="text-[#848E9C] max-w-xl mb-8" style={{ fontSize: "1rem", lineHeight: 1.6 }}>
          BestStrat detects market regimes, builds strategy rules, and outputs a testable strategy spec for CMC Skills.
          Not financial advice — a structured, backtestable specification.
        </p>
        <div className="flex flex-wrap gap-6">
          {[
            { icon: BarChart2, label: "Regime Detection", desc: "Auto-classify market conditions" },
            { icon: ShieldCheck, label: "Risk-First Rules", desc: "Entry, exit & invalidation logic" },
            { icon: FileCode, label: "CMC Skill Output", desc: "Exportable strategy spec format" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1E2329] border border-[#2B3139]">
                <Icon size={14} className="text-[#F0B90B]" />
              </div>
              <div>
                <div className="text-white text-sm font-medium">{label}</div>
                <div className="text-[#848E9C] text-xs">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
