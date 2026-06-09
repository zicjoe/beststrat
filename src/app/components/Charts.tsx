import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { ChartPoint, SignalStrengthPoint } from "../../types/strategy";

const tooltipStyle = {
  backgroundColor: "#1E2329",
  border: "1px solid #2B3139",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "12px",
};

export function EquityCurveChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="bg-[#161A20] border border-[#2B3139] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-[#0ECB81]" />
        <span className="text-white text-sm font-semibold">Equity Curve</span>
        <span className="text-[#848E9C] text-xs ml-auto">Portfolio value over time</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ECB81" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0ECB81" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2B3139" />
          <XAxis dataKey="time" tick={{ fill: "#848E9C", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#848E9C", fontSize: 10 }} axisLine={false} tickLine={false} width={50} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#0ECB81"
            strokeWidth={2}
            fill="url(#equityGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DrawdownChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="bg-[#161A20] border border-[#2B3139] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-[#F6465D]" />
        <span className="text-white text-sm font-semibold">Drawdown</span>
        <span className="text-[#848E9C] text-xs ml-auto">% from peak</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="drawdownGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F6465D" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#F6465D" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2B3139" />
          <XAxis dataKey="time" tick={{ fill: "#848E9C", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#848E9C", fontSize: 10 }} axisLine={false} tickLine={false} width={50} />
          <Tooltip contentStyle={tooltipStyle} />
          <ReferenceLine y={0} stroke="#2B3139" />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#F6465D"
            strokeWidth={2}
            fill="url(#drawdownGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SignalStrengthChart({ data }: { data: SignalStrengthPoint[] }) {
  return (
    <div className="bg-[#161A20] border border-[#2B3139] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-[#F0B90B]" />
        <span className="text-white text-sm font-semibold">Signal Strength</span>
        <span className="text-[#848E9C] text-xs ml-auto">Composite scores 0–100</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2B3139" />
          <XAxis dataKey="name" tick={{ fill: "#848E9C", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: "#848E9C", fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
          <Tooltip contentStyle={tooltipStyle} />
          <ReferenceLine y={50} stroke="#F0B90B" strokeDasharray="3 3" strokeOpacity={0.4} />
          <Bar dataKey="value" fill="#F0B90B" radius={[4, 4, 0, 0]} opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ChartsProps {
  equityCurve: ChartPoint[];
  drawdownCurve: ChartPoint[];
  signalStrength: SignalStrengthPoint[];
}

export function ChartsSection({ equityCurve, drawdownCurve, signalStrength }: ChartsProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-4 rounded-full bg-[#F0B90B]" />
        <h2 className="text-white" style={{ fontSize: "1rem", fontWeight: 600 }}>Performance Charts</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <EquityCurveChart data={equityCurve} />
        <DrawdownChart data={drawdownCurve} />
        <div className="lg:col-span-2">
          <SignalStrengthChart data={signalStrength} />
        </div>
      </div>
    </section>
  );
}
