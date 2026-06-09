import { Sparkles, AlertTriangle, BarChart2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-[#2B3139] border-t-[#F0B90B] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles size={20} className="text-[#F0B90B]" />
        </div>
      </div>
      <div className="text-center">
        <div className="text-white font-semibold mb-1">Analyzing Market Data</div>
        <div className="text-[#848E9C] text-sm">Detecting regime · Building rules · Running backtest</div>
      </div>
      <div className="flex gap-2">
        {["Regime Detection", "Signal Analysis", "Backtest Engine", "Strategy Spec"].map((step, i) => (
          <div key={step} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full bg-[#F0B90B] animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
            <span className="text-[#848E9C] text-xs hidden sm:block">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#161A20] border border-[#2B3139]">
        <BarChart2 size={28} className="text-[#2B3139]" />
      </div>
      <div className="text-center max-w-sm">
        <div className="text-white font-semibold mb-2">No strategy generated yet</div>
        <div className="text-[#848E9C] text-sm leading-relaxed">
          Configure your parameters in the Strategy Input Panel and click{" "}
          <span className="text-[#F0B90B]">Generate Strategy</span> to detect the market regime and build your strategy spec.
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {["Regime Detection", "Entry Rules", "Exit Rules", "Backtest", "CMC Export"].map((feature) => (
          <span
            key={feature}
            className="px-3 py-1 rounded-full text-xs bg-[#161A20] text-[#4B5563] border border-[#2B3139]"
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F6465D]/10 border border-[#F6465D]/30">
        <AlertTriangle size={28} className="text-[#F6465D]" />
      </div>
      <div className="text-center max-w-sm">
        <div className="text-white font-semibold mb-2">Strategy Generation Failed</div>
        <div className="text-[#848E9C] text-sm leading-relaxed mb-4">{message}</div>
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-[#F0B90B] text-[#0B0E11] hover:bg-[#F0B90B]/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
