import { useNavigate } from "react-router";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  Database,
  FileCode2,
  FileText,
  GitCompareArrows,
  Layers3,
  Radar,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";

function PrimaryButton({ children = "Start Strategy Builder", to = "/builder" }: { children?: string; to?: string }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F0B90B] px-6 py-3 text-sm font-semibold text-[#0B0E11] shadow-[0_18px_45px_rgba(240,185,11,0.16)] transition-all hover:bg-[#F0B90B]/90 active:scale-[0.98] sm:px-7 sm:py-3.5 sm:text-base"
    >
      {children}
      <ArrowRight size={17} />
    </button>
  );
}

function SecondaryButton({ children = "Scan Market Category", to = "/scanner" }: { children?: string; to?: string }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2B3139] bg-[#161A20] px-6 py-3 text-sm font-semibold text-white transition-all hover:border-[#F0B90B]/40 hover:bg-[#1E2329] active:scale-[0.98] sm:px-7 sm:py-3.5 sm:text-base"
    >
      {children}
      <ChevronRight size={17} />
    </button>
  );
}

function MetricCard({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "gold" | "green" | "red" }) {
  const toneClass = {
    neutral: "text-white",
    gold: "text-[#F0B90B]",
    green: "text-[#0ECB81]",
    red: "text-[#F6465D]",
  }[tone];

  return (
    <div className="min-h-[94px] rounded-2xl border border-[#2B3139] bg-[#0B0E11] p-4">
      <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#848E9C]">{label}</div>
      <div className={`mt-3 text-xl font-bold ${toneClass}`}>{value}</div>
    </div>
  );
}

function HeroProductPreview() {
  const exports = ["JSON", "Markdown", "CMC Skill", "LLM Skill"];

  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-[#2B3139] bg-[#12161C] shadow-xl">
        <div className="flex items-center justify-between border-b border-[#2B3139] bg-[#0B0E11] px-5 py-4">
          <div>
            <div className="text-sm font-semibold text-white">BestStrat Strategy Preview</div>
            <div className="mt-0.5 text-xs text-[#848E9C]">CMC context → regime → backtestable spec</div>
          </div>
          <span className="rounded-full border border-[#0ECB81]/20 bg-[#0ECB81]/10 px-2.5 py-1 text-xs font-medium text-[#0ECB81]">
            Research-ready
          </span>
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-2xl border border-[#F0B90B]/25 bg-[#0B0E11] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#848E9C]">Selected strategy</div>
                <div className="mt-2 text-lg font-bold leading-tight text-white">Capital Protection Regime Strategy</div>
              </div>
              <div className="shrink-0 rounded-full border border-[#F0B90B]/25 bg-[#F0B90B]/10 px-3 py-1 text-xs font-semibold text-[#F0B90B]">
                Risk Off
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#848E9C]">
              Avoid new momentum entries until trend structure, sentiment, and volatility return to acceptable conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MetricCard label="Backtest return" value="45.8%" tone="green" />
            <MetricCard label="Max drawdown" value="2.4%" tone="red" />
            <MetricCard label="Risk score" value="100" tone="gold" />
          </div>

          <div className="rounded-2xl border border-[#2B3139] bg-[#0B0E11] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <GitCompareArrows size={15} className="text-[#F0B90B]" />
                Candidate ranking
              </div>
              <span className="text-xs text-[#848E9C]">4 strategies compared</span>
            </div>
            <div className="space-y-2.5">
              {[
                ["Risk Off", "119", "100%"],
                ["Momentum", "98", "82%"],
                ["Sentiment Divergence", "98", "82%"],
              ].map(([name, score, width]) => (
                <div key={name} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="truncate text-[#C8CDD6]">{name}</span>
                      <span className="font-semibold text-[#F0B90B]">{score}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#2B3139]">
                      <div className="h-full rounded-full bg-[#F0B90B]" style={{ width }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {exports.map((item) => (
              <span key={item} className="rounded-full border border-[#2B3139] bg-[#0B0E11] px-3 py-1.5 text-xs font-medium text-[#C8CDD6]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="border-b border-[#2B3139] bg-[#0B0E11]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2B3139] bg-[#1E2329] px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0ECB81]" />
            <span className="text-xs font-medium text-[#A1A8B3]">CMC-powered strategy research</span>
          </div>

          <h1
            className="max-w-3xl text-white"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4.25rem)", fontWeight: 820, lineHeight: 1.03, letterSpacing: "-0.045em" }}
          >
            Turn market data into <span className="text-[#F0B90B]">backtestable crypto strategies.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#A1A8B3] sm:text-lg">
            BestStrat uses CoinMarketCap-powered market context to detect regimes, rank strategy candidates, backtest selected logic, and export reusable strategy specs.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton />
            <SecondaryButton />
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              "CMC-powered context",
              "Backtestable specs",
              "No wallet connection",
              "Skill-ready exports",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-[#848E9C]">
                <CheckCircle2 size={15} className="shrink-0 text-[#0ECB81]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <HeroProductPreview />
      </div>
    </section>
  );
}

const workflowSteps = [
  {
    icon: Target,
    title: "Choose asset or category",
    desc: "Start with one token in Builder or scan a full market category in Scanner.",
  },
  {
    icon: Radar,
    title: "Detect the regime",
    desc: "BestStrat scores trend, momentum, volume, sentiment, volatility, and liquidity.",
  },
  {
    icon: GitCompareArrows,
    title: "Rank strategy candidates",
    desc: "Momentum, risk-off, sentiment-divergence, and regime-aware setups are compared.",
  },
  {
    icon: FileCode2,
    title: "Export the spec",
    desc: "Copy JSON, Markdown, CMC Skill Output, or LLM Skill Output for reuse.",
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-b border-[#2B3139]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#848E9C]">How it works</div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">A simple strategy-generation workflow</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map(({ icon: Icon, title, desc }, index) => (
            <div key={title} className="relative rounded-2xl border border-[#2B3139] bg-[#161A20] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F0B90B]/20 bg-[#F0B90B]/10">
                  <Icon size={18} className="text-[#F0B90B]" />
                </div>
                <span className="text-sm font-bold text-[#2B3139]">0{index + 1}</span>
              </div>
              <h3 className="text-base font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#848E9C]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolCard({
  icon: Icon,
  title,
  desc,
  button,
  to,
}: {
  icon: typeof Sparkles;
  title: string;
  desc: string;
  button: string;
  to: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="group rounded-[1.5rem] border border-[#2B3139] bg-[#12161C] p-6 transition-all hover:border-[#F0B90B]/35 hover:bg-[#161A20]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#F0B90B]/20 bg-[#F0B90B]/10">
          <Icon size={21} className="text-[#F0B90B]" />
        </div>
        <ArrowRight size={18} className="text-[#3B4149] transition-colors group-hover:text-[#F0B90B]" />
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="mt-3 min-h-[72px] text-sm leading-7 text-[#848E9C]">{desc}</p>
      <button
        onClick={() => navigate(to)}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#2B3139] bg-[#0B0E11] px-4 py-3 text-sm font-semibold text-white transition-all hover:border-[#F0B90B]/35 hover:bg-[#1E2329]"
      >
        {button}
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function BuilderScannerSection() {
  return (
    <section className="border-b border-[#2B3139]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#848E9C]">Two ways to start</div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Build one strategy or scan the market</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#848E9C]">
            Builder is for focused single-asset research. Scanner is for ranking multiple candidates before choosing what to inspect.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ToolCard
            icon={Workflow}
            title="Strategy Builder"
            desc="Generate a strategy for one asset using timeframe, lookback, risk level, and strategy focus. Review the logic, chart, ledger, and exports in one workspace."
            button="Open Builder"
            to="/builder"
          />
          <ToolCard
            icon={ScanSearch}
            title="Strategy Scanner"
            desc="Scan a market category and rank the strongest candidates by return, drawdown, win rate, outperformance, and risk-adjusted score."
            button="Open Scanner"
            to="/scanner"
          />
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Brain,
    title: "Market Regime Detection",
    desc: "Scores trend, momentum, volume, volatility, sentiment, and liquidity before selecting a strategy.",
  },
  {
    icon: BarChart3,
    title: "Strategy Candidate Ranking",
    desc: "Compares multiple strategy types and selects the strongest risk-adjusted candidate.",
  },
  {
    icon: Layers3,
    title: "Skill-Ready Exports",
    desc: "Export JSON, Markdown, CMC Skill Output, and LLM Skill Output for research, documentation, and AI workflows.",
  },
];

function WhatYouGetSection() {
  return (
    <section className="border-b border-[#2B3139]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#848E9C]">What you get</div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Clear outputs, not vague market opinions</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-[#2B3139] bg-[#161A20] p-6">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#F0B90B]/20 bg-[#F0B90B]/10">
                <Icon size={19} className="text-[#F0B90B]" />
              </div>
              <h3 className="text-base font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#848E9C]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OutputPreviewSection() {
  const outputs = [
    {
      icon: Database,
      title: "JSON strategy spec",
      desc: "Machine-readable rules, metrics, backtest assumptions, and selected strategy metadata.",
    },
    {
      icon: FileText,
      title: "Markdown research brief",
      desc: "Readable strategy summary for docs, reports, product notes, and community updates.",
    },
    {
      icon: FileCode2,
      title: "CMC Skill Output",
      desc: "A CMC-compatible package showing market context, strategy selection, and backtest evidence.",
    },
    {
      icon: Sparkles,
      title: "LLM Skill Output",
      desc: "An instruction-ready object another AI can use to explain, audit, or convert the strategy.",
    },
  ];

  return (
    <section id="output-preview" className="border-b border-[#2B3139]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#848E9C]">Skill outputs</div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Reusable strategy artifacts</h2>
          </div>
          <p className="text-sm leading-7 text-[#848E9C]">
            BestStrat packages the strategy into formats that work for users, developers, documentation, and AI-agent workflows without adding an execution layer.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {outputs.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-[#2B3139] bg-[#12161C] p-5">
              <Icon size={18} className="mb-4 text-[#F0B90B]" />
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="mt-2 text-xs leading-6 text-[#848E9C]">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-[#2B3139] bg-[#0B0E11] p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-[#848E9C]">Compact output preview</div>
              <h3 className="mt-2 text-xl font-bold text-white">From strategy logic to agent-readable Skill</h3>
              <p className="mt-3 text-sm leading-7 text-[#848E9C]">
                The export includes detected regime, decision rationale, entry rules, exit rules, risk controls, invalidation rules, backtest metrics, and the research-only disclaimer.
              </p>
            </div>
            <div className="rounded-2xl border border-[#2B3139] bg-[#12161C] p-4 font-mono text-xs leading-6 text-[#C8CDD6]">
              <div className="text-[#848E9C]">beststrat.generate_strategy</div>
              <div className="mt-2 text-[#F0B90B]">strategy: Capital Protection Regime</div>
              <div className="text-[#0ECB81]">backtest: return 45.8% · drawdown 2.4%</div>
              <div className="text-[#C8CDD6]">exports: JSON · Markdown · CMC Skill · LLM Skill</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SafetySection() {
  return (
    <section className="border-b border-[#2B3139]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-[1.5rem] border border-[#F0B90B]/20 bg-[#F0B90B]/[0.04] p-6 sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#F0B90B]/20 bg-[#F0B90B]/10">
                <ShieldCheck size={21} className="text-[#F0B90B]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Research-only by design.</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-[#A1A8B3]">
                  BestStrat does not connect wallets, place trades, collect private keys, or present historical backtests as guaranteed returns.
                </p>
              </div>
            </div>
            <SecondaryButton to="/scanner">Explore Scanner</SecondaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-[#F0B90B]/25 bg-[#F0B90B]/10">
              <img src="/assets/beststrat-logo-mark.png" alt="BestStrat logo" className="h-9 w-9 object-contain" draggable={false} />
            </div>
            <div>
              <div className="font-semibold text-white">BestStrat</div>
              <div className="text-xs text-[#848E9C]">CMC-powered strategy research</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-[#848E9C]">
            <button onClick={() => navigate("/builder")} className="rounded-lg px-3 py-1.5 hover:bg-[#1E2329] hover:text-white">
              Strategy Builder
            </button>
            <button onClick={() => navigate("/scanner")} className="rounded-lg px-3 py-1.5 hover:bg-[#1E2329] hover:text-white">
              Scanner
            </button>
            <button onClick={() => document.getElementById("output-preview")?.scrollIntoView({ behavior: "smooth" })} className="rounded-lg px-3 py-1.5 hover:bg-[#1E2329] hover:text-white">
              Skill Outputs
            </button>
          </div>
        </div>
        <p className="max-w-4xl text-xs leading-6 text-[#4B5563]">
          BestStrat generates research strategy specifications only. It is not financial advice, does not execute trades, and does not predict future returns. Backtest results are historical simulations based on the selected market window and assumptions.
        </p>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <main className="overflow-hidden bg-[#0B0E11]">
      <HeroSection />
      <HowItWorksSection />
      <BuilderScannerSection />
      <WhatYouGetSection />
      <OutputPreviewSection />
      <SafetySection />
      <Footer />
    </main>
  );
}
