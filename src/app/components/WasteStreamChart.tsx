"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";
import { TrendingUp, Package, Leaf } from "lucide-react";
import { useState } from "react";

const last7Days = (() => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return days[d.getDay()];
  });
})();

const rawData = [
  { PET: 245, HDPE: 180, Other: 95 },
  { PET: 312, HDPE: 210, Other: 102 },
  { PET: 280, HDPE: 195, Other: 88 },
  { PET: 398, HDPE: 245, Other: 115 },
  { PET: 425, HDPE: 268, Other: 128 },
  { PET: 356, HDPE: 222, Other: 109 },
  { PET: 290, HDPE: 198, Other: 95 },
];

const wasteStreamData = last7Days.map((day, i) => ({
  day,
  ...rawData[i],
  Total: rawData[i].PET + rawData[i].HDPE + rawData[i].Other,
}));

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl p-4 min-w-[180px]">
        <p className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" />
          {label}
        </p>
        {payload.map((entry: any) => (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-4 mb-1.5"
          >
            <span className="flex items-center gap-1.5 text-sm text-gray-600">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.dataKey}
            </span>
            <span className="font-bold text-gray-800 text-sm">
              {entry.value} kg
            </span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between">
          <span className="text-xs text-gray-500 font-medium">Total</span>
          <span className="text-xs font-bold text-emerald-600">
            {payload.reduce((s: number, p: any) => s + (p.dataKey !== "Total" ? p.value : 0), 0)} kg
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function WasteStreamChart() {
  const [chartType, setChartType] = useState<"area" | "line">("area");

  const totalThisWeek = wasteStreamData.reduce((s, d) => s + d.Total, 0);
  const avgDaily = Math.round(totalThisWeek / 7);
  const peakDay = wasteStreamData.reduce((max, d) => (d.Total > max.Total ? d : max));

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden stagger-in" style={{ animationDelay: "0ms" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Waste Stream Analytics</h3>
              <p className="text-white/70 text-sm">Volume collected — last 7 days</p>
            </div>
          </div>

          {/* Chart type toggle */}
          <div className="flex items-center gap-1 bg-white/20 rounded-xl p-1">
            {(["area", "line"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  chartType === type
                    ? "bg-white text-emerald-600 shadow"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {type === "area" ? "Area" : "Line"}
              </button>
            ))}
          </div>
        </div>

        {/* Mini KPIs */}
        <div className="grid grid-cols-3 gap-4 mt-5">
          {[
            { label: "Total This Week", value: `${totalThisWeek.toLocaleString()} kg`, icon: Package },
            { label: "Daily Average", value: `${avgDaily.toLocaleString()} kg`, icon: TrendingUp },
            { label: "Peak Day", value: `${peakDay.day} · ${peakDay.Total} kg`, icon: Leaf },
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
        {/* Stable-height wrapper eliminates layout shift on Area↔Line toggle */}
        <div style={{ height: 260, position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart data={wasteStreamData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="petGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="hdpeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="otherGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}kg`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ color: "#374151", fontSize: "12px" }}>{value}</span>
                  )}
                />
                <Area type="monotone" dataKey="PET" stroke="#10b981" strokeWidth={2.5} fill="url(#petGrad)" dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
                <Area type="monotone" dataKey="HDPE" stroke="#3b82f6" strokeWidth={2.5} fill="url(#hdpeGrad)" dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
                <Area type="monotone" dataKey="Other" stroke="#f59e0b" strokeWidth={2.5} fill="url(#otherGrad)" dot={{ r: 4, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
              </AreaChart>
            ) : (
              <LineChart data={wasteStreamData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}kg`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ color: "#374151", fontSize: "12px" }}>{value}</span>} />
                <ReferenceLine y={avgDaily / 3} stroke="#e2e8f0" strokeDasharray="4 2" />
                <Line type="monotone" dataKey="PET" stroke="#10b981" strokeWidth={2.5} dot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="HDPE" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="Other" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 5, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 7 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}