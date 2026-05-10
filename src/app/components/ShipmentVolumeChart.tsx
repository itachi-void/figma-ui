"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { BarChart2, TrendingUp, Package } from "lucide-react";

/* ── Monthly seed data per partner (last 6 months) ── */
const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

const partnerMonthlyData = [
  { month: "Nov", "EcoFactory Cairo": 9.2, "PlastiRecycle Ltd": 6.8, "GreenManufacture Co.": 16.4, "Cairo Bottles Inc.": 3.5, "Delta Recyclers": 2.8, "Nile Green Materials": 2.1 },
  { month: "Dec", "EcoFactory Cairo": 11.5, "PlastiRecycle Ltd": 7.4, "GreenManufacture Co.": 18.9, "Cairo Bottles Inc.": 4.2, "Delta Recyclers": 3.1, "Nile Green Materials": 2.4 },
  { month: "Jan", "EcoFactory Cairo": 10.3, "PlastiRecycle Ltd": 6.9, "GreenManufacture Co.": 17.2, "Cairo Bottles Inc.": 3.8, "Delta Recyclers": 2.9, "Nile Green Materials": 2.6 },
  { month: "Feb", "EcoFactory Cairo": 13.1, "PlastiRecycle Ltd": 8.6, "GreenManufacture Co.": 21.3, "Cairo Bottles Inc.": 5.1, "Delta Recyclers": 3.8, "Nile Green Materials": 3.2 },
  { month: "Mar", "EcoFactory Cairo": 14.7, "PlastiRecycle Ltd": 9.2, "GreenManufacture Co.": 23.8, "Cairo Bottles Inc.": 5.6, "Delta Recyclers": 4.1, "Nile Green Materials": 3.5 },
  { month: "Apr", "EcoFactory Cairo": 12.4, "PlastiRecycle Ltd": 7.8, "GreenManufacture Co.": 20.1, "Cairo Bottles Inc.": 4.8, "Delta Recyclers": 3.6, "Nile Green Materials": 2.8 },
];

/* Partner colour palette – mirrors B2B avatarColor hues */
const PARTNER_COLORS: Record<string, string> = {
  "EcoFactory Cairo":      "#10b981", // emerald-500
  "PlastiRecycle Ltd":     "#3b82f6", // blue-500
  "GreenManufacture Co.":  "#8b5cf6", // violet-500
  "Cairo Bottles Inc.":    "#f59e0b", // amber-500
  "Delta Recyclers":       "#14b8a6", // teal-500
  "Nile Green Materials":  "#f43f5e", // rose-500
};

const PARTNER_KEYS = Object.keys(PARTNER_COLORS);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s: number, p: any) => s + p.value, 0);
  return (
    <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl p-4 min-w-[200px]">
      <p className="font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" />
        {label} — Intake
      </p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 mb-1.5">
          <span className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: entry.fill }} />
            {entry.dataKey}
          </span>
          <span className="font-bold text-gray-800 text-xs">{entry.value} t</span>
        </div>
      ))}
      <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between">
        <span className="text-xs text-gray-500 font-medium">Total</span>
        <span className="text-xs font-bold text-emerald-600">{total.toFixed(1)} t</span>
      </div>
    </div>
  );
};

export function ShipmentVolumeChart() {
  /* totals for KPI strip */
  const totalAllTime = partnerMonthlyData.reduce(
    (s, row) => s + PARTNER_KEYS.reduce((ps, k) => ps + (row[k as keyof typeof row] as number), 0),
    0
  );
  const latestMonth = partnerMonthlyData[partnerMonthlyData.length - 1];
  const latestTotal = PARTNER_KEYS.reduce(
    (s, k) => s + (latestMonth[k as keyof typeof latestMonth] as number),
    0
  );
  const prevMonth = partnerMonthlyData[partnerMonthlyData.length - 2];
  const prevTotal = PARTNER_KEYS.reduce(
    (s, k) => s + (prevMonth[k as keyof typeof prevMonth] as number),
    0
  );
  const growthPct = (((latestTotal - prevTotal) / prevTotal) * 100).toFixed(1);
  const isPositive = latestTotal >= prevTotal;

  return (
    <div
      className="bg-white rounded-2xl shadow-xl overflow-hidden stagger-in"
      style={{ animationDelay: "20ms" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Partner Intake Trend</h3>
              <p className="text-white/70 text-sm">Monthly volume per B2B partner — last 6 months</p>
            </div>
          </div>

          {/* Growth badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold ${isPositive ? "bg-white/20 text-white" : "bg-red-400/30 text-white"}`}>
            <TrendingUp className={`w-4 h-4 ${!isPositive ? "rotate-180" : ""}`} />
            {isPositive ? "+" : ""}{growthPct}% MoM
          </div>
        </div>

        {/* Mini KPIs */}
        <div className="grid grid-cols-3 gap-4 mt-5">
          {[
            { label: "6-Month Total", value: `${totalAllTime.toFixed(0)} t`, icon: Package },
            { label: "This Month", value: `${latestTotal.toFixed(1)} t`, icon: BarChart2 },
            { label: "Active Partners", value: `${PARTNER_KEYS.length}`, icon: TrendingUp },
          ].map((kpi, i) => (
            <div
              key={i}
              className="bg-white/15 backdrop-blur rounded-xl p-3 stagger-zoom"
              style={{ animationDelay: `${i * 15}ms` }}
            >
              <p className="text-white/70 text-xs mb-1">{kpi.label}</p>
              <p className="text-white font-bold">{kpi.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={partnerMonthlyData}
              margin={{ top: 8, right: 20, left: 0, bottom: 5 }}
              barSize={8}
              barCategoryGap="30%"
            >
              <defs>
                {PARTNER_KEYS.map((key) => (
                  <linearGradient
                    key={`grad-${key}`}
                    id={`barGrad-${key.replace(/\s+/g, "-")}`}
                    x1="0" y1="0" x2="0" y2="1"
                  >
                    <stop offset="0%" stopColor={PARTNER_COLORS[key]} stopOpacity={1} />
                    <stop offset="100%" stopColor={PARTNER_COLORS[key]} stopOpacity={0.55} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}t`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(16,185,129,0.05)", radius: 4 }} />
              <Legend
                iconType="square"
                iconSize={10}
                formatter={(value) => (
                  <span style={{ color: "#374151", fontSize: "11px" }}>{value}</span>
                )}
              />
              {PARTNER_KEYS.map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={`url(#barGrad-${key.replace(/\s+/g, "-")})`}
                  radius={[4, 4, 0, 0]}
                  stackId="stack"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend colour swatch strip */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {PARTNER_KEYS.map((key) => (
            <span
              key={key}
              className="stagger-zoom inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 border border-gray-100"
              style={{ animationDelay: `${PARTNER_KEYS.indexOf(key) * 10}ms` }}
            >
              <span
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: PARTNER_COLORS[key] }}
              />
              {key}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}