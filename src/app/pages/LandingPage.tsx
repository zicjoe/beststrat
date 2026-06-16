import { useNavigate } from "react-router";
import {
  Zap,
  Shield,
  BarChart2,
  FileCode,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Copy,
  Check,
  Database,
  Brain,
  GitCompareArrows,
  FileText,
  Activity,
  Layers,
} from "lucide-react";
import { useState } from "react";

// ─── Launch Button ──────────────────────────────────────────────────
export function LaunchStrategyButton({ size = "default" }: { size?: "default" | "large" }) {
  const navigate = useNavigate();
  const cls =
    size === "large"
      ? "px-7 py-3.5 rounded-xl text-base font-semibold"
      : "px-5 py-2.5 rounded-lg text-sm font-semibold";
  return (
    <button
      onClick={() => navigate("/builder")}
      className={`inline-flex items-center justify-center gap-2 bg-[#F0B90B] text-[#0B0E11] hover:bg-[#F0B90B]/90 active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(240,185,11,0.16)] ${cls}`}
    >
      <Zap size={size === "large" ? 18 : 15} />
      Launch Strategy Builder
      <ArrowRight size={size === "large" ? 18 : 15} />
    </button>
  );
}

function ProductPreviewCard() {
  const candidates = [
    { name: "Momentum", score: 84, status: "Selected", color: "#0ECB81" },
    { name: "Risk Off", score: 78, status: "Candidate", color: "#F0B90B" },
    { name: "Sentiment", score: 61, status: "Candidate", color: "#848E9C" },
  ];

  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-[#F0B90B]/10 blur-2xl" />
      <div className="relative bg-[#12161C] border border-[#2B3139] rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2B3139] bg-[#0B0E11]">
          <div>
            <div className="text-white text-sm font-semibold">BestStrat Output Preview</div>
            <div className="text-[#848E9C] text-xs mt-0.5">CMC data → strategy spec → LLM Skill output</div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#0ECB81]/10 text-[#0ECB81] border border-[#0ECB81]/20">
            CMC Ready
          </span>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0B0E11] border border-[#2B3139] rounded-2xl p-4">
              <div className="text-[#848E9C] text-xs uppercase tracking-wider">Detected Regime</div>
              <div className="text-[#F0B90B] font-bold mt-1" style={{ fontSize: "1.25rem" }}>
                Momentum
              </div>
              <div className="mt-3 h-2 rounded-full bg-[#2B3139] overflow-hidden">
                <div className="h-full w-[78%] bg-gradient-to-r from-[#F0B90B] to-[#0ECB81]" />
              </div>
            </div>
            <div className="bg-[#0B0E11] border border-[#2B3139] rounded-2xl p-4">
              <div className="text-[#848E9C] text-xs uppercase tracking-wider">Selected Strategy</div>
              <div className="text-white font-semibold mt-1 leading-tight">Guarded Momentum</div>
              <div className="text-[#848E9C] text-xs mt-2">Chosen by risk-adjusted candidate selection</div>
            </div>
          </div>

          <div className="bg-[#0B0E11] border border-[#2B3139] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-white text-sm font-semibold">
                <GitCompareArrows size={14} className="text-[#F0B90B]" />
                Auto Strategy Selection
              </div>
              <span className="text-[#848E9C] text-xs">3 candidates</span>
            </div>
            <div className="space-y-2">
              {candidates.map((candidate) => (
                <div key={candidate.name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full" style={{ background: candidate.color }} />
                    <span className="text-[#C8CDD6] text-xs truncate">{candidate.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-[#2B3139] overflow-hidden">
                      <div className="h-full" style={{ width: `${candidate.score}%`, background: candidate.color }} />
                    </div>
                    <span className="text-[#848E9C] text-xs w-8 text-right">{candidate.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#0B0E11] border border-[#2B3139] rounded-xl p-3 text-center">
              <div className="text-[#848E9C] text-[10px] uppercase tracking-wider">Return</div>
              <div className="text-[#0ECB81] font-bold mt-1">23.9%</div>
            </div>
            <div className="bg-[#0B0E11] border border-[#2B3139] rounded-xl p-3 text-center">
              <div className="text-[#848E9C] text-[10px] uppercase tracking-wider">Drawdown</div>
              <div className="text-[#F6465D] font-bold mt-1">2.6%</div>
            </div>
            <div className="bg-[#0B0E11] border border-[#2B3139] rounded-xl p-3 text-center">
              <div className="text-[#848E9C] text-[10px] uppercase tracking-wider">Export</div>
              <div className="text-[#F0B90B] font-bold mt-1">Skill</div>
            </div>
          </div>

          <p className="text-[#4B5563] text-xs leading-relaxed">
            Backtest results are historical research outputs. BestStrat does not place trades or predict future returns.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[#2B3139]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(240,185,11,0.12) 0%, transparent 70%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.02fr_0.98fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E2329] border border-[#2B3139] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0ECB81] animate-pulse" />
              <span className="text-[#848E9C] text-xs font-medium">CMC Strategy Skill · Backtestable Specs</span>
            </div>
            <h1
              className="text-white max-w-3xl mb-6"
              style={{ fontSize: "clamp(2rem, 4.2vw, 3.35rem)", fontWeight: 800, lineHeight: 1.08 }}
            >
              Generate backtestable crypto strategy specs from <span className="text-[#F0B90B]">CMC market data</span>
            </h1>
            <p className="text-[#A1A8B3] max-w-2xl mb-8" style={{ fontSize: "1.05rem", lineHeight: 1.75 }}>
              BestStrat detects market regimes, compares strategy candidates, backtests the selected logic, and exports reusable strategy specs for agents and researchers.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <LaunchStrategyButton size="large" />
              <button
                onClick={() => document.getElementById("output-preview")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-[#1E2329] border border-[#2B3139] hover:bg-[#2B3139] hover:border-[#3B4149] transition-all"
              >
                View Skill Output
              </button>
            </div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
              {[
                "CMC-powered strategy generation",
                "Auto strategy candidate selection",
                "Backtest methodology and benchmark",
                "JSON, Markdown, CMC Skill, and LLM Skill exports",
              ].map((item) => (
                <span key={item} className="flex items-center gap-2 text-sm text-[#848E9C]">
                  <CheckCircle size={14} className="text-[#0ECB81] shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <ProductPreviewCard />
        </div>
      </div>
    </section>
  );
}

// ─── Feature Cards ────────────────────────────────────────────────────
const features = [
  {
    icon: Database,
    title: "CMC Data Layer",
    desc: "Accepts token, timeframe, lookback, risk profile, and strategy focus, then prepares the market context for strategy generation.",
    accent: "#F0B90B",
  },
  {
    icon: Brain,
    title: "Regime-Aware Logic",
    desc: "Classifies market behavior before generating rules, so BestStrat does not apply a momentum strategy to every condition.",
    accent: "#0ECB81",
  },
  {
    icon: GitCompareArrows,
    title: "Auto Strategy Selection",
    desc: "Auto Detect compares candidate strategies using return, drawdown, win rate, alpha, and risk-adjusted score before selecting one.",
    accent: "#3B82F6",
  },
  {
    icon: FileCode,
    title: "LLM Skill Output",
    desc: "Exports structured JSON, Markdown, CMC Skill output, and LLM Skill output that an agent can reuse as a repeatable workflow.",
    accent: "#A855F7",
  },
];

export function FeatureCards() {
  return (
    <section className="border-b border-[#2B3139]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <div className="text-[#848E9C] text-xs font-medium uppercase tracking-widest mb-2">Built for strategy research</div>
          <h2 className="text-white" style={{ fontSize: "1.75rem", fontWeight: 700 }}>
            From market input to backtestable Skill output
          </h2>
          <p className="text-[#848E9C] text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
            BestStrat is not a live trading bot. It is a strategy-spec engine built to generate testable, explainable,
            agent-readable trading logic.
          </p>
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
  {
    n: 1,
    title: "Define the strategy request",
    desc: "Choose a token, timeframe, lookback window, risk level, and whether BestStrat should auto-select the strategy focus.",
  },
  {
    n: 2,
    title: "Read market context",
    desc: "BestStrat prepares CMC-powered market context and technical signals for the requested asset and timeframe.",
  },
  {
    n: 3,
    title: "Compare strategy candidates",
    desc: "Momentum, Risk Off, Sentiment Divergence, and Regime Detection candidates are scored against return and risk quality.",
  },
  {
    n: 4,
    title: "Backtest the selected spec",
    desc: "The selected strategy is tested with transparent assumptions, benchmark comparison, equity curve, and drawdown curve.",
  },
  {
    n: 5,
    title: "Export the Skill",
    desc: "Generate JSON, Markdown, CMC Skill output, and LLM Skill output for demos, review, and agent workflows.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-[#2B3139]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="text-[#848E9C] text-xs font-medium uppercase tracking-widest mb-2">The BestStrat workflow</div>
          <h2 className="text-white" style={{ fontSize: "1.75rem", fontWeight: 700 }}>
            A repeatable strategy-generation process
          </h2>
        </div>
        <div className="relative">
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

function StrategySkillPositioning() {
  const items = [
    { icon: Layers, title: "Quantopian-style", desc: "Strategy rules are explicit, testable, and exportable instead of being presented as a simple buy/sell signal." },
    { icon: Shield, title: "No execution layer", desc: "BestStrat does not connect wallets or place live trades. The deliverable is the strategy spec and backtest output." },
    { icon: Activity, title: "Research-first", desc: "Backtests are framed as historical analysis with methodology, assumptions, drawdown, and benchmark context." },
  ];

  return (
    <section className="border-b border-[#2B3139]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 items-start">
          <div>
            <div className="text-[#848E9C] text-xs font-medium uppercase tracking-widest mb-2">Product positioning</div>
            <h2 className="text-white mb-4" style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.2 }}>
              Designed as a Strategy Skill, not a trading agent
            </h2>
            <p className="text-[#848E9C] text-sm leading-relaxed">
              BestStrat focuses on a clear strategy workflow: market data in, strategy logic out, with a backtestable spec
              that can be read by humans and reused by LLM agents.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[#161A20] border border-[#2B3139] rounded-2xl p-5">
                <Icon size={18} className="text-[#F0B90B] mb-4" />
                <h3 className="text-white text-sm font-semibold mb-2">{title}</h3>
                <p className="text-[#848E9C] text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



function DeveloperApiSection() {
  const [copied, setCopied] = useState<string | null>(null);
  const endpoint = `POST /api/strategy/generate`;
  const requestBody = `{
  "symbol": "BTC",
  "timeframe": "1h",
  "lookbackDays": 30,
  "riskLevel": "moderate",
  "strategyFocus": "auto"
}`;
  const fetchExample = `const response = await fetch("https://your-beststrat-api.com/api/strategy/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    symbol: "BTC",
    timeframe: "1h",
    lookbackDays: 30,
    riskLevel: "moderate",
    strategyFocus: "auto"
  })
});

const strategy = await response.json();
console.log(strategy.llmSkillOutput);`;

  const copyText = (key: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    });
  };

  const codeBlock = (key: string, label: string, value: string) => (
    <div className="bg-[#0B0E11] border border-[#2B3139] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2B3139] bg-[#101419]">
        <div className="flex items-center gap-2">
          <FileCode size={14} className="text-[#F0B90B]" />
          <span className="text-[#C8CDD6] text-xs font-medium">{label}</span>
        </div>
        <button
          onClick={() => copyText(key, value)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#2B3139] text-[#848E9C] hover:bg-[#3B4149] hover:text-white transition-colors"
        >
          {copied === key ? <Check size={11} className="text-[#0ECB81]" /> : <Copy size={11} />}
          {copied === key ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 text-xs text-[#C8CDD6] leading-relaxed overflow-x-auto">
        <code>{value}</code>
      </pre>
    </div>
  );

  return (
    <section id="api" className="border-b border-[#2B3139]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr] gap-8 items-start">
          <div>
            <div className="text-[#848E9C] text-xs font-medium uppercase tracking-widest mb-2">Use it as a Skill or API</div>
            <h2 className="text-white mb-4" style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.2 }}>
              Connect BestStrat to another product
            </h2>
            <p className="text-[#848E9C] text-sm leading-relaxed mb-6">
              BestStrat can be used from the web app, copied as an LLM Skill output, or called by another backend as a strategy-generation endpoint.
              The external product sends a strategy request and receives regime, selected strategy, rules, backtest metrics, and Skill-ready output.
            </p>
            <div className="space-y-3">
              {[
                "Keep the CMC API key on the BestStrat backend, not inside another frontend.",
                "Call the generation endpoint with symbol, timeframe, lookback, risk level, and strategy focus.",
                "Use llmSkillOutput or jsonOutput inside an agent, dashboard, research tool, or trading journal.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-[#A1A8B3]">
                  <CheckCircle size={15} className="text-[#0ECB81] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#161A20] border border-[#2B3139] rounded-2xl p-4">
                <div className="text-[#848E9C] text-xs uppercase tracking-wider mb-1">Endpoint</div>
                <div className="text-white text-sm font-semibold">/api/strategy/generate</div>
              </div>
              <div className="bg-[#161A20] border border-[#2B3139] rounded-2xl p-4">
                <div className="text-[#848E9C] text-xs uppercase tracking-wider mb-1">Method</div>
                <div className="text-[#F0B90B] text-sm font-semibold">POST JSON</div>
              </div>
              <div className="bg-[#161A20] border border-[#2B3139] rounded-2xl p-4">
                <div className="text-[#848E9C] text-xs uppercase tracking-wider mb-1">Output</div>
                <div className="text-[#0ECB81] text-sm font-semibold">Skill-ready spec</div>
              </div>
            </div>
            {codeBlock("endpoint", "Endpoint", endpoint)}
            {codeBlock("request", "Request body", requestBody)}
            {codeBlock("fetch", "Example integration", fetchExample)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Output Preview ────────────────────────────────────────────────────
const sampleJson = `{
  "skill": "beststrat.generate_strategy",
  "input": {
    "symbol": "BTC",
    "timeframe": "1h",
    "lookbackDays": 30,
    "riskLevel": "moderate",
    "strategyFocus": "auto"
  },
  "autoSelection": {
    "selected": "Guarded Momentum Strategy",
    "reason": "Highest risk-adjusted candidate score"
  },
  "strategySpec": {
    "regime": "Momentum",
    "entryRules": ["price > EMA20", "RSI between 50 and 70"],
    "exitRules": ["price loses EMA20", "momentum weakens"],
    "riskRules": ["reject high-volatility/no-trend setups"],
    "invalidationRules": ["regime changes to Risk Off"]
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
          <div className="text-[#848E9C] text-xs font-medium uppercase tracking-widest mb-2">Exportable output</div>
          <h2 className="text-white" style={{ fontSize: "1.75rem", fontWeight: 700 }}>
            What BestStrat produces
          </h2>
          <p className="text-[#848E9C] text-sm mt-2 max-w-2xl mx-auto leading-relaxed">
            A structured, backtestable strategy spec with rationale, strategy candidate selection, methodology, and agent-readable exports.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col gap-4">
            <div className="bg-[#161A20] border border-[#F0B90B]/30 rounded-2xl p-5">
              <div className="text-[#848E9C] text-xs uppercase tracking-wider mb-1">LLM Skill Invocation</div>
              <div className="text-[#F0B90B] font-bold" style={{ fontSize: "1.15rem" }}>
                beststrat.generate_strategy
              </div>
              <p className="text-[#848E9C] text-sm mt-2">
                A repeatable workflow for turning market context into strategy rules, backtest output, and exportable specs.
              </p>
            </div>

            <div className="bg-[#161A20] border border-[#2B3139] rounded-2xl p-5">
              <div className="text-[#848E9C] text-xs uppercase tracking-wider mb-1">Selected Strategy</div>
              <div className="text-white font-semibold" style={{ fontSize: "1.1rem" }}>Guarded Momentum Strategy</div>
              <p className="text-[#848E9C] text-sm mt-1.5">
                Chosen after comparing momentum, risk-off, sentiment-divergence, and regime-detection candidates.
              </p>
            </div>

            <div className="bg-[#161A20] border border-[#0ECB81]/20 rounded-2xl p-5">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#0ECB81]" />
                <span className="text-white text-sm font-semibold">Generated rules</span>
              </div>
              <ul className="space-y-1.5">
                {["Entry rules", "Exit rules", "Risk rules", "Invalidation rules", "No-trade conditions"].map((rule) => (
                  <li key={rule} className="flex items-center gap-2 text-[#848E9C] text-sm">
                    <ChevronRight size={12} className="text-[#0ECB81]" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#161A20] border border-[#2B3139] rounded-xl p-4 text-center">
                <div className="text-[#848E9C] text-xs uppercase tracking-wider mb-1">Backtest</div>
                <div className="text-[#0ECB81] font-bold" style={{ fontSize: "1.15rem" }}>Ready</div>
              </div>
              <div className="bg-[#161A20] border border-[#2B3139] rounded-xl p-4 text-center">
                <div className="text-[#848E9C] text-xs uppercase tracking-wider mb-1">Exports</div>
                <div className="text-[#F0B90B] font-bold" style={{ fontSize: "1.15rem" }}>4</div>
              </div>
              <div className="bg-[#161A20] border border-[#2B3139] rounded-xl p-4 text-center">
                <div className="text-[#848E9C] text-xs uppercase tracking-wider mb-1">Wallets</div>
                <div className="text-[#F6465D] font-bold" style={{ fontSize: "1.15rem" }}>None</div>
              </div>
            </div>
          </div>

          <div className="bg-[#161A20] border border-[#2B3139] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2B3139] bg-[#0B0E11]">
              <div className="flex items-center gap-2">
                <FileCode size={14} className="text-[#F0B90B]" />
                <span className="text-[#848E9C] text-xs font-medium">LLM Skill Output Preview</span>
              </div>
              <button
                onClick={copyJson}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#2B3139] text-[#848E9C] hover:bg-[#3B4149] hover:text-white transition-colors"
              >
                {copied ? <Check size={11} className="text-[#0ECB81]" /> : <Copy size={11} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="p-5 text-xs text-[#C8CDD6] leading-relaxed overflow-x-auto max-h-[420px]">
              <code>{sampleJson}</code>
            </pre>
            <div className="px-4 py-3 border-t border-[#2B3139] bg-[#0B0E11]">
              <p className="text-[#4B5563] text-xs">
                Exportable as JSON Strategy Spec · Markdown Report · CMC Skill Output · LLM Skill Output
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
      <StrategySkillPositioning />
      <DeveloperApiSection />
      <OutputPreview />
      <footer className="border-t border-[#2B3139] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#4B5563] text-sm leading-relaxed max-w-3xl mx-auto">
            BestStrat generates strategy specifications for research and demonstration purposes only.
            It is not financial advice, does not execute trades, does not connect to any wallet, and does not predict future returns.
            Backtest results are historical simulations based on the selected market window and assumptions.
          </p>
          <p className="text-[#2B3139] text-xs mt-4">
            BestStrat · CMC Strategy Skill Builder
          </p>
        </div>
      </footer>
    </main>
  );
}
