"use client";

import { MapPin, TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";
import { useState } from "react";

interface ZoneData {
  id: string;
  name: string;
  city: string;
  collections: number;
  target: number;
  kgCollected: number;
  activeDrivers: number;
  pendingRequests: number;
}

const zones: ZoneData[] = [
  { id: "Z-DT", name: "Downtown", city: "Cairo", collections: 48, target: 40, kgCollected: 192, activeDrivers: 3, pendingRequests: 2 },
  { id: "Z-GC", name: "Garden City", city: "Cairo", collections: 32, target: 35, kgCollected: 128, activeDrivers: 2, pendingRequests: 4 },
  { id: "Z-IB", name: "Industrial B", city: "Cairo", collections: 76, target: 50, kgCollected: 456, activeDrivers: 4, pendingRequests: 1 },
  { id: "Z-MD", name: "Maadi", city: "Cairo", collections: 23, target: 30, kgCollected: 84, activeDrivers: 1, pendingRequests: 7 },
  { id: "Z-HK", name: "Heliopolis", city: "Cairo", collections: 41, target: 40, kgCollected: 164, activeDrivers: 2, pendingRequests: 3 },
  { id: "Z-ZM", name: "Zamalek", city: "Cairo", collections: 18, target: 25, kgCollected: 72, activeDrivers: 1, pendingRequests: 8 },
  { id: "Z-SH", name: "Shubra", city: "Cairo", collections: 55, target: 45, kgCollected: 220, activeDrivers: 3, pendingRequests: 2 },
  { id: "Z-OB", name: "October Bridge", city: "Giza", collections: 29, target: 35, kgCollected: 116, activeDrivers: 2, pendingRequests: 5 },
];

function getPerformance(collections: number, target: number) {
  const pct = ((collections - target) / target) * 100;
  return Math.round(pct);
}

function getHeatColor(perf: number): string {
  if (perf >= 20) return "from-emerald-500 to-teal-500";
  if (perf >= 5) return "from-green-400 to-emerald-400";
  if (perf >= -5) return "from-blue-400 to-cyan-400";
  if (perf >= -20) return "from-amber-400 to-orange-400";
  return "from-red-400 to-rose-500";
}

function getHeatBg(perf: number): string {
  if (perf >= 20) return "bg-emerald-50 border-emerald-200";
  if (perf >= 5) return "bg-green-50 border-green-200";
  if (perf >= -5) return "bg-blue-50 border-blue-200";
  if (perf >= -20) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

function getLabel(perf: number) {
  if (perf >= 20) return { text: "Exceeding", icon: TrendingUp, color: "text-emerald-600" };
  if (perf >= 5) return { text: "On Track", icon: TrendingUp, color: "text-green-600" };
  if (perf >= -5) return { text: "Stable", icon: Minus, color: "text-blue-600" };
  if (perf >= -20) return { text: "Behind", icon: TrendingDown, color: "text-amber-600" };
  return { text: "Critical", icon: AlertCircle, color: "text-red-600" };
}

export function ZoneHeatmap() {
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
  const [sortBy, setSortBy] = useState<"performance" | "collections" | "pending">("performance");

  const sorted = [...zones].sort((a, b) => {
    if (sortBy === "performance") return getPerformance(b.collections, b.target) - getPerformance(a.collections, a.target);
    if (sortBy === "collections") return b.collections - a.collections;
    return b.pendingRequests - a.pendingRequests;
  });

  const overPerforming = zones.filter(z => getPerformance(z.collections, z.target) > 0).length;
  const underPerforming = zones.filter(z => getPerformance(z.collections, z.target) < -5).length;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden stagger-in" style={{ animationDelay: "20ms" }}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Zone Performance Heatmap</h3>
              <p className="text-sm text-gray-500">
                <span className="text-emerald-600 font-medium">{overPerforming} over-performing</span>
                {" · "}
                <span className="text-red-500 font-medium">{underPerforming} critical</span>
                {" · "}
                {zones.length} total zones
              </p>
            </div>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {(["performance", "collections", "pending"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  sortBy === s
                    ? "bg-white text-gray-800 shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sorted.map((zone, i) => {
            const perf = getPerformance(zone.collections, zone.target);
            const heatColor = getHeatColor(perf);
            const heatBg = getHeatBg(perf);
            const labelInfo = getLabel(perf);
            const LabelIcon = labelInfo.icon;
            const fillPct = Math.min(100, Math.max(5, (zone.collections / zone.target) * 100));
            const isSelected = selectedZone?.id === zone.id;

            return (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(isSelected ? null : zone)}
                className={`stagger-zoom text-left border rounded-xl p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${heatBg} ${isSelected ? "ring-2 ring-violet-400 ring-offset-2" : ""}`}
                style={{ animationDelay: `${i * 14}ms` }}
              >
                {/* Zone name + badge */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{zone.name}</p>
                    <p className="text-xs text-gray-500">{zone.city}</p>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-white/70 ${labelInfo.color}`}>
                    <LabelIcon className="w-3 h-3" />
                    {perf > 0 ? "+" : ""}{perf}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{zone.collections} collected</span>
                    <span>Target: {zone.target}</span>
                  </div>
                  <div className="h-2 bg-white/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${heatColor} rounded-full transition-all duration-700`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                </div>

                {/* Mini stats */}
                <div className="flex justify-between text-xs text-gray-600">
                  <span className="bg-white/70 px-2 py-0.5 rounded-lg">
                    🚚 {zone.activeDrivers} drivers
                  </span>
                  {zone.pendingRequests > 5 ? (
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-lg font-medium">
                      ⚠ {zone.pendingRequests} pending
                    </span>
                  ) : (
                    <span className="bg-white/70 px-2 py-0.5 rounded-lg">
                      📋 {zone.pendingRequests} pending
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Expanded Zone Detail */}
        {selectedZone && (() => {
          const perf = getPerformance(selectedZone.collections, selectedZone.target);
          return (
            <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl stagger-in" style={{ animationDelay: "0ms" }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-violet-800">{selectedZone.name} — Detailed View</p>
                  <p className="text-sm text-violet-600">{selectedZone.city}</p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
                    <p className="text-gray-500 text-xs">Collections</p>
                    <p className="font-bold text-gray-800">{selectedZone.collections}</p>
                  </div>
                  <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
                    <p className="text-gray-500 text-xs">kg Collected</p>
                    <p className="font-bold text-gray-800">{selectedZone.kgCollected}</p>
                  </div>
                  <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
                    <p className="text-gray-500 text-xs">CO₂ Saved</p>
                    <p className="font-bold text-emerald-600">{(selectedZone.kgCollected * 0.82).toFixed(1)} kg</p>
                  </div>
                  <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
                    <p className="text-gray-500 text-xs">vs. Target</p>
                    <p className={`font-bold ${perf >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {perf > 0 ? "+" : ""}{perf}%
                    </p>
                  </div>
                  <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
                    <p className="text-gray-500 text-xs">Pending</p>
                    <p className={`font-bold ${selectedZone.pendingRequests > 5 ? "text-red-500" : "text-gray-800"}`}>
                      {selectedZone.pendingRequests} requests
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500 font-medium">Performance Scale:</span>
          {[
            { color: "from-emerald-500 to-teal-500", label: "Exceeding ≥+20%" },
            { color: "from-green-400 to-emerald-400", label: "On Track +5~20%" },
            { color: "from-blue-400 to-cyan-400", label: "Stable ±5%" },
            { color: "from-amber-400 to-orange-400", label: "Behind -5~-20%" },
            { color: "from-red-400 to-rose-500", label: "Critical < -20%" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`} />
              <span className="text-xs text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}