import type { ReactNode } from "react";
import { LogIn, LogOut, Shield, XCircle, Scale, Ban } from "lucide-react";
import type { StrategyResponse } from "../../types/strategy";

function RuleList({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="space-y-1.5">
      {items.map((rule, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${color}`} />
          <span className="text-[#C8CDD6]">{rule}</span>
        </li>
      ))}
    </ul>
  );
}

interface RuleCardProps {
  title: string;
  icon: ReactNode;
  items: string[];
  dotColor: string;
  borderColor: string;
}

function RuleCard({ title, icon, items, dotColor, borderColor }: RuleCardProps) {
  return (
    <div className={`bg-[#161A20] border rounded-xl p-4 ${borderColor}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-white text-sm font-semibold">{title}</span>
      </div>
      <RuleList items={items} color={dotColor} />
    </div>
  );
}

export function StrategySummaryCard({ data }: { data: StrategyResponse }) {
  return (
    <div className="bg-[#161A20] border border-[#F0B90B]/20 rounded-xl p-5 col-span-full">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[#848E9C] text-xs uppercase tracking-wider mb-1">Strategy Name</div>
          <div className="text-[#F0B90B] font-bold" style={{ fontSize: "1.1rem" }}>{data.strategyName}</div>
        </div>
        <div className="flex gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#0ECB81]/10 text-[#0ECB81] border border-[#0ECB81]/30">
            {data.detectedRegime}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#F0B90B]/10 text-[#F0B90B] border border-[#F0B90B]/30">
            {data.symbol} / {data.timeframe}
          </span>
        </div>
      </div>
      <p className="text-[#848E9C] text-sm mt-3 leading-relaxed">{data.strategySummary}</p>
      <div className="mt-3 pt-3 border-t border-[#2B3139]">
        <div className="text-[#848E9C] text-xs uppercase tracking-wider mb-1.5">Position Sizing</div>
        <p className="text-[#C8CDD6] text-sm">{data.positionSizing}</p>
      </div>
    </div>
  );
}

export function EntryRulesCard({ data }: { data: StrategyResponse }) {
  return (
    <RuleCard
      title="Entry Rules"
      icon={<LogIn size={14} className="text-[#0ECB81]" />}
      items={data.entryRules}
      dotColor="bg-[#0ECB81]"
      borderColor="border-[#0ECB81]/20"
    />
  );
}

export function ExitRulesCard({ data }: { data: StrategyResponse }) {
  return (
    <RuleCard
      title="Exit Rules"
      icon={<LogOut size={14} className="text-[#F0B90B]" />}
      items={data.exitRules}
      dotColor="bg-[#F0B90B]"
      borderColor="border-[#2B3139]"
    />
  );
}

export function RiskRulesCard({ data }: { data: StrategyResponse }) {
  return (
    <RuleCard
      title="Risk Rules"
      icon={<Shield size={14} className="text-[#F6465D]" />}
      items={data.riskRules}
      dotColor="bg-[#F6465D]"
      borderColor="border-[#F6465D]/20"
    />
  );
}

export function InvalidationRulesCard({ data }: { data: StrategyResponse }) {
  return (
    <RuleCard
      title="Invalidation Rules"
      icon={<XCircle size={14} className="text-[#848E9C]" />}
      items={data.invalidationRules}
      dotColor="bg-[#848E9C]"
      borderColor="border-[#2B3139]"
    />
  );
}


function RationaleCard({ data }: { data: StrategyResponse }) {
  return (
    <div className="bg-[#161A20] border border-[#F0B90B]/20 rounded-xl p-4 col-span-full">
      <div className="flex items-center gap-2 mb-3">
        <Scale size={14} className="text-[#F0B90B]" />
        <span className="text-white text-sm font-semibold">Why This Strategy Was Generated</span>
      </div>
      <ul className="space-y-2">
        {(data.decisionRationale || ["BestStrat selected this strategy from the detected regime, signal scores, and risk settings."]).map((reason, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[#C8CDD6] leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F0B90B] mt-2 flex-shrink-0" />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NoTradeCard({ data }: { data: StrategyResponse }) {
  return (
    <div className="bg-[#161A20] border border-[#2B3139] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Ban size={14} className="text-[#848E9C]" />
        <span className="text-white text-sm font-semibold">No Trade Conditions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.noTradeConditions.map((cond, i) => (
          <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-[#1E2329] text-[#848E9C] border border-[#2B3139]">
            {cond}
          </span>
        ))}
      </div>
    </div>
  );
}

export function GeneratedStrategySpec({ data }: { data: StrategyResponse }) {
  return (
    <section id="strategy-spec">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-4 rounded-full bg-[#F0B90B]" />
        <h2 className="text-white" style={{ fontSize: "1rem", fontWeight: 600 }}>Generated Strategy Spec</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <StrategySummaryCard data={data} />
        <RationaleCard data={data} />
        <EntryRulesCard data={data} />
        <ExitRulesCard data={data} />
        <RiskRulesCard data={data} />
        <InvalidationRulesCard data={data} />
        <NoTradeCard data={data} />
      </div>
    </section>
  );
}
