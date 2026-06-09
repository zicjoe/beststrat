import { useNavigate } from "react-router";
import {
  Zap,
  TrendingUp,
  Shield,
  BarChart2,
  FileCode,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

// ─── Launch Button ──────────────────────────────────────────────────
export function LaunchStrategyButton({ size = "default" }: { size?: "default" | "large" }) {
  const navigate = useNavigate();
  const cls =
    size === "large"
      ? "px-8 py-4 rounded-xl text-base font-semibold"
      : "px-5 py-2.5 rounded-lg text-sm font-semibold";
  return (
    <button
      onClick={() => navigate("/builder")}
      className={`inline-flex items-center gap-2 bg-[#F0B90B] text-[#0B0E11] hover:bg-[#F0B90B]/90 active:scale-[0.98] transition-all ${cls}`}
    >
      <Zap size={size === "large" ? 18 : 15} />
      Launch Strategy Builder
      <ArrowRight size={size === "large" ? 18 : 15} />
    </button>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────
function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden border-b border-[#2B3139]">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(240,185,11,0.12) 0%, transparent 70%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E2329] border border-[#2B3139] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0ECB81] animate-pulse" />
          <span className="text-[#848E9C] text-xs font-medium">BNB Hack · AI Trading Agent Edition · Track 2</span>
        </div>
        <h1
          className="text-white max-w-3xl mx-auto mb-6"
          style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 800, lineHeight: 1.15 }}
        >
          Generate backtestable crypto strategies from{" "}
          <span className="text-[#F0B90B]">CMC market data</span>
        </h1>
        <p className="text-[#848E9C] max-w-xl mx-auto mb-10" style={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
          BestStrat detects market regimes, builds entry and exit rules, tests strategy logic, and exports a
          CMC Skill&#8209;ready strategy spec. No trades. No wallets. Pure strategy.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <LaunchStrategyButton size="large" />
          <button
            onClick={() => document.getElementById("output-preview")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white bg-[#1E2329] border border-[#2B3139] hover:bg-[#2B3139] hover:border-[#3B4149] transition-all"
          >
            View Sample Strategy
          </button>
        </div>
        {/* Trust strip */}
        <div className="mt-14 flex flex-wrap justify-center gap-6 text-xs text-[#4B5563]">
          {["No wallet connect", "No live trading", "No buy / sell buttons", "Generates strategy specs only"].map(
            (item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle size={12} className="text-[#0ECB81]" />
                {item}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Feature Cards ────────────────────────────────────────────────────
const features = [
  {
    icon: TrendingUp,
    title: "Regime Detection",
    desc: "Automatically classifies the current market as Momentum, Trend, Risk Off, or Sentiment Divergence so your rules match real conditions.",
    accent: "#F0B90B",
  },
  {
    icon: Shield,
    title: "Risk-First Rules",
    desc: "Every generated strategy comes with explicit entry, exit, risk, and invalidation rules designed to protect downside before chasing upside.",
    accent: "#0ECB81",
  },
  {
    icon: BarChart2,
    title: "Backtest Metrics",
    desc: "Simulated performance metrics including total return, win rate, max drawdown, and risk-adjusted score — all from CMC historical data.",
    accent: "#3B82F6",
  },
  {
    icon: FileCode,
    title: "CMC Skill Output",
    desc: "Outputs a structured, machine-readable strategy spec ready to drop into the CoinMarketCap Skills API without extra translation.",
    accent: "#A855F7",
  },
];

export function FeatureCards() {
  return (
    <section className="border-b border-[#2B3139]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <div className="text-[#848E9C] text-xs font-medium uppercase tracking-widest mb-2">What BestStrat does</div>
          <h2 className="text-white" style={{ fontSize: "1.6rem", fontWeight: 700 }}>
            From raw market data to a testable strategy spec
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc, accent }) => (
            <div
              key={title}
              className="bg-[#161A20] border border-[#2B3139] rounded-2xl p-5 hover:border-[#3B4149] transition-colors group"
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl mb-4"
                style={{ background: `${accent}18` }}
              >
                <Icon size={18} style={{ color: accent }} />
              </div>
              <h3 className="text-white mb-2" style={{ fontSize: "0.95rem", fontWeight: 600 }}>
                {title}
              </h3>
              <p className="text-[#848E9C] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How it Works ─────────────────────────────────────────────────────
const steps = [
  { n: 1, title: "Choose token and timeframe", desc: "Enter any CMC-listed token symbol and pick your analysis timeframe from 5m to 1d." },
  { n: 2, title: "Detect market regime", desc: "BestStrat analyzes CMC data to classify the current regime: Momentum, Trend, Risk Off, or Sentiment Divergence." },
  { n: 3, title: "Generate strategy rules", desc: "Entry, exit, risk, and invalidation rules are generated to match the detected regime and your chosen risk level." },
  { n: 4, title: "Backtest performance", desc: "Strategy logic is tested against historical CMC data. View equity curve, drawdown, and key performance metrics." },
  { n: 5, title: "Export strategy spec", desc: "Download the strategy as a JSON spec, Markdown report, or CMC Skill-compatible output ready for submission." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-[#2B3139]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="text-[#848E9C] text-xs font-medium uppercase tracking-widest mb-2">Simple 5-step process</div>
          <h2 className="text-white" style={{ fontSize: "1.6rem", fontWeight: 700 }}>
            How BestStrat works
          </h2>
        </div>
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#2B3139] to-transparent" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step) => (
              <div key={step.n} className="flex flex-col items-center text-center lg:items-center">
                <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl bg-[#161A20] border border-[#2B3139] mb-4">
                  <span className="text-[#F0B90B] font-bold" style={{ fontSize: "1.1rem" }}>
                    {step.n}
                  </span>
                </div>
                <h3 className="text-white mb-2" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                  {step.title}
                </h3>
                <p className="text-[#848E9C] text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-12">
          <LaunchStrategyButton size="large" />
        </div>
      </div>
    </section>
  );
}

// ─── Output Preview ────────────────────────────────────────────────────
const sampleJson = `{
  "strategySpec": {
    "name": "Guarded Momentum",
    "asset": "CAKE",
    "timeframe": "1h",
    "regime": "Momentum",
    "entry": {
      "conditions": [
        "price > ema(20)",
        "rsi >= 50 AND rsi <= 70"
      ]
    },
    "exit": {
      "conditions": [
        "price < ema(20)",
        "rsi < 48"
      ]
    }
  }
}`;

export function OutputPreview() {
  const [copied, setCopied] = useState(false);

  const copyJson = () => {
    navigator.clipboard.writeText(sampleJson).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section id="output-preview" className="border-b border-[#2B3139]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <div className="text-[#848E9C] text-xs font-medium uppercase tracking-widest mb-2">Sample output</div>
          <h2 className="text-white" style={{ fontSize: "1.6rem", fontWeight: 700 }}>
            What you get from BestStrat
          </h2>
          <p className="text-[#848E9C] text-sm mt-2">
            A structured, backtestable strategy spec — not a signal, not a call, not advice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left: Metric preview cards */}
          <div className="flex flex-col gap-4">
            {/* Regime card */}
            <div className="bg-[#161A20] border border-[#F0B90B]/30 rounded-2xl p-5">
              <div className="text-[#848E9C] text-xs uppercase tracking-wider mb-1">Detected Regime</div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-[#F0B90B] font-bold" style={{ fontSize: "1.4rem" }}>Momentum</span>
                <span className="text-[#0ECB81] text-xs font-medium">78% confidence</span>
              </div>
              <p className="text-[#848E9C] text-sm">
                Trend positive, volume expanding, risk conditions acceptable.
              </p>
            </div>
            {/* Strategy name */}
            <div className="bg-[#161A20] border border-[#2B3139] rounded-2xl p-5">
              <div className="text-[#848E9C] text-xs uppercase tracking-wider mb-1">Strategy Name</div>
              <div className="text-white font-semibold" style={{ fontSize: "1.1rem" }}>Guarded Momentum Strategy</div>
              <p className="text-[#848E9C] text-sm mt-1.5">
                Enter only when trend, volume, and sentiment confirm momentum while volatility remains controlled.
              </p>
            </div>
            {/* Entry rules */}
            <div className="bg-[#161A20] border border-[#0ECB81]/20 rounded-2xl p-5">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#0ECB81]" />
                <span className="text-white text-sm font-semibold">Entry Rules</span>
              </div>
              <ul className="space-y-1.5">
                {["Price above EMA 20", "RSI between 50 and 70", "Volume above 7d average"].map((rule) => (
                  <li key={rule} className="flex items-center gap-2 text-[#848E9C] text-sm">
                    <ChevronRight size={12} className="text-[#0ECB81]" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
            {/* Metrics row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#161A20] border border-[#2B3139] rounded-xl p-4 text-center">
                <div className="text-[#848E9C] text-xs uppercase tracking-wider mb-1">Total Return</div>
                <div className="text-[#0ECB81] font-bold" style={{ fontSize: "1.3rem" }}>12.4%</div>
              </div>
              <div className="bg-[#161A20] border border-[#2B3139] rounded-xl p-4 text-center">
                <div className="text-[#848E9C] text-xs uppercase tracking-wider mb-1">Max Drawdown</div>
                <div className="text-[#F6465D] font-bold" style={{ fontSize: "1.3rem" }}>6.2%</div>
              </div>
              <div className="bg-[#161A20] border border-[#2B3139] rounded-xl p-4 text-center">
                <div className="text-[#848E9C] text-xs uppercase tracking-wider mb-1">Win Rate</div>
                <div className="text-[#F0B90B] font-bold" style={{ fontSize: "1.3rem" }}>58%</div>
              </div>
            </div>
          </div>

          {/* Right: JSON preview */}
          <div className="bg-[#161A20] border border-[#2B3139] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2B3139] bg-[#0B0E11]">
              <div className="flex items-center gap-2">
                <FileCode size={14} className="text-[#F0B90B]" />
                <span className="text-[#848E9C] text-xs font-medium">JSON Strategy Spec Preview</span>
              </div>
              <button
                onClick={copyJson}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#2B3139] text-[#848E9C] hover:bg-[#3B4149] hover:text-white transition-colors"
              >
                {copied ? <Check size={11} className="text-[#0ECB81]" /> : <Copy size={11} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="p-5 text-xs text-[#C8CDD6] leading-relaxed overflow-x-auto">
              <code>{sampleJson}</code>
            </pre>
            <div className="px-4 py-3 border-t border-[#2B3139] bg-[#0B0E11]">
              <p className="text-[#4B5563] text-xs">
                CMC Skill-compatible format · exportable as JSON, Markdown, or CMC Skill output
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <LaunchStrategyButton size="large" />
        </div>
      </div>
    </section>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────
export function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FeatureCards />
      <HowItWorks />
      <OutputPreview />
      <footer className="border-t border-[#2B3139] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#4B5563] text-sm leading-relaxed max-w-2xl mx-auto">
            BestStrat generates strategy specifications for research and hackathon demonstration purposes only.
            It is not financial advice, does not execute trades, and does not connect to any wallet.
            All backtest results are simulated and do not represent actual trading performance.
          </p>
          <p className="text-[#2B3139] text-xs mt-4">
            BestStrat · CMC Strategy Skill Builder · BNB Hack AI Trading Agent Edition · Track 2
          </p>
        </div>
      </footer>
    </main>
  );
}
