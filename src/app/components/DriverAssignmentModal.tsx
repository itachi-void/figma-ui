import React, { useState, useMemo } from "react";
import {
  X,
  Truck,
  MapPin,
  Star,
  Fuel,
  Package,
  Phone,
  Zap,
  CheckCircle,
  Clock,
  User,
  Navigation,
  AlertTriangle,
} from "lucide-react";
import { useDrivers, haversineKm, type LiveDriver } from "@/app/contexts/DriversContext";
import { usePickup } from "@/app/contexts/PickupContext";
import { type PickupRequest } from "@/app/types/recyclehub";
import { notify } from "@/app/utils/notifications";

/* ─── Vehicle icon map ─────────────────────────────── */
const VEHICLE_EMOJI: Record<string, string> = {
  Motorcycle: "🏍️",
  TukTuk: "🛺",
  Van: "🚐",
  "Small Truck": "🚚",
  "Large Truck": "🚛",
};

/* ─── Status badge ─────────────────────────────────── */
function FuelBar({ value }: { value: number }) {
  const color =
    value > 50 ? "bg-emerald-500" : value > 25 ? "bg-amber-400" : "bg-red-500";
  return (
    <div className="flex items-center gap-1.5 min-w-[80px]">
      <Fuel className="w-3 h-3 text-gray-400 flex-shrink-0" />
      <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[9px] font-bold text-gray-400 w-6 text-right">
        {value}%
      </span>
    </div>
  );
}

/* ─── Driver Card ──────────────────────────────────── */
function DriverCard({
  driver,
  distanceKm,
  isSelected,
  isSameZone,
  onSelect,
}: {
  driver: LiveDriver;
  distanceKm: number;
  isSelected: boolean;
  isSameZone: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 group
        ${isSelected
          ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/15 shadow-lg shadow-emerald-500/15"
          : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md"
        }`}
    >
      {/* Zone badge */}
      {isSameZone && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest">
          Same Zone
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={`w-11 h-11 rounded-2xl ${driver.avatarColor} flex items-center justify-center flex-shrink-0 shadow-md`}>
          <span className="text-white text-sm font-black">{driver.initials}</span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + vehicle */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-black text-gray-900 dark:text-white truncate">
              {driver.name}
            </span>
            <span className="text-base" title={driver.vehicleType}>
              {VEHICLE_EMOJI[driver.vehicleType] ?? "🚗"}
            </span>
          </div>

          {/* Vehicle + phone */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
              <Truck className="w-2.5 h-2.5" />
              {driver.vehicleType}
            </span>
            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
              <Phone className="w-2.5 h-2.5" />
              {driver.phone}
            </span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-black text-gray-700 dark:text-gray-300">
                {driver.rating.toFixed(1)}
              </span>
            </div>
            {/* Distance */}
            <div className="flex items-center gap-1">
              <Navigation className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] font-bold text-gray-500">
                {distanceKm.toFixed(1)}km
              </span>
            </div>
            {/* Completed today */}
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-bold text-gray-500">
                {driver.completedToday} today
              </span>
            </div>
          </div>

          {/* Fuel bar */}
          <div className="mt-2">
            <FuelBar value={driver.fuel} />
          </div>
        </div>
      </div>

      {/* Selection ring */}
      {isSelected && (
        <div className="absolute top-3 left-3">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
            <CheckCircle className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Modal ───────────────────────────────────── */
interface DriverAssignmentModalProps {
  request: PickupRequest;
  onClose: () => void;
}

export function DriverAssignmentModal({
  request,
  onClose,
}: DriverAssignmentModalProps) {
  const { availableDrivers, assignDriver, drivers } = useDrivers();
  const { assignDriverToRequest } = usePickup();

  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const reqLat = request.citizen.lat ?? 30.04;
  const reqLng = request.citizen.lng ?? 31.24;
  const reqZone = request.zone.name;

  /* Sort: same zone first, then by distance */
  const sortedDrivers = useMemo(() => {
    return [...availableDrivers]
      .map((d) => ({
        driver: d,
        distanceKm: haversineKm(reqLat, reqLng, d.lat, d.lng),
        isSameZone: d.zone === reqZone,
      }))
      .sort((a, b) => {
        if (a.isSameZone !== b.isSameZone)
          return a.isSameZone ? -1 : 1;
        return a.distanceKm - b.distanceKm;
      });
  }, [availableDrivers, reqLat, reqLng, reqZone]);

  /* Auto-select: closest same-zone available driver */
  const autoRecommended = useMemo(
    () => sortedDrivers[0] ?? null,
    [sortedDrivers]
  );

  const handleAutoAssign = () => {
    if (!autoRecommended) return;
    setSelectedDriverId(autoRecommended.driver.id);
  };

  const handleConfirm = () => {
    if (!selectedDriverId) return;
    const driverEntry = sortedDrivers.find((e) => e.driver.id === selectedDriverId);
    if (!driverEntry) return;

    setIsConfirming(true);

    setTimeout(() => {
      const d = driverEntry.driver;
      const ok = assignDriverToRequest(request.id, {
        id: d.id,
        name: d.name,
        vehicle: d.vehicleType,
        phone: d.phone,
      });

      if (ok) {
        assignDriver(d.id, request.id);
        notify.success(
          "Driver Assigned ✓",
          `${d.name} dispatched to ${request.citizen.name} · ${driverEntry.distanceKm.toFixed(1)}km away`
        );
        onClose();
      } else {
        notify.error("Assignment Failed", "This request could not be updated.");
        setIsConfirming(false);
      }
    }, 175);
  };

  const totalKg = request.items.reduce((s, i) => s + i.expectedWeightKg, 0);
  const totalQty = request.items.reduce((s, i) => s + i.expectedQuantity, 0);
  const selectedEntry = sortedDrivers.find((e) => e.driver.id === selectedDriverId);

  const busyCount = drivers.filter((d) => d.status === "busy").length;

  return (
    <>
      <style>{`
        @keyframes fadeScaleIn {
          0%   { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUpIn {
          0%   { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes spinnerRing {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ animation: "fadeScaleIn 0.2s ease-out" }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={!isConfirming ? onClose : undefined}
        />

        {/* Sheet */}
        <div
          className="relative z-10 w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl
            bg-white/92 dark:bg-gray-900/92 backdrop-blur-xl border border-white/40 dark:border-gray-700/50"
          style={{ animation: "fadeScaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                  Assign Driver
                </h2>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  {request.id} · {request.zone.name}
                </p>
              </div>
            </div>
            {!isConfirming && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-7 py-5 space-y-5">
              {/* ── Request summary ── */}
              <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/60 dark:to-gray-900/60 border border-gray-100 dark:border-gray-800 p-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  Request Details
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: <User className="w-3.5 h-3.5" />, label: "Citizen", val: request.citizen.name },
                    { icon: <MapPin className="w-3.5 h-3.5" />, label: "Zone", val: reqZone },
                    { icon: <Package className="w-3.5 h-3.5" />, label: "Items", val: `${totalQty} units` },
                    { icon: <Clock className="w-3.5 h-3.5" />, label: "Weight", val: `${totalKg} kg` },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 shadow-sm"
                    >
                      <div className="flex items-center gap-1.5 text-emerald-600 mb-1.5">
                        {s.icon}
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                          {s.label}
                        </span>
                      </div>
                      <p className="text-xs font-black text-gray-900 dark:text-white truncate">
                        {s.val}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Fleet summary + auto-assign ── */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-xs text-gray-500">
                    <span className="font-black text-emerald-600">{availableDrivers.length}</span> available ·{" "}
                    <span className="font-black text-amber-500">{busyCount}</span> busy
                  </div>
                  {autoRecommended && (
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Zap className="w-3 h-3 text-amber-400" />
                      AI Recommends:{" "}
                      <span className="font-black text-gray-700 dark:text-gray-200">
                        {autoRecommended.driver.name}
                      </span>
                    </span>
                  )}
                </div>
                <button
                  onClick={handleAutoAssign}
                  disabled={!autoRecommended}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-black uppercase tracking-widest shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Auto-Select
                </button>
              </div>

              {/* ── Driver list ── */}
              {sortedDrivers.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-10 text-center">
                  <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                  <p className="text-sm font-black text-gray-700 dark:text-gray-200">
                    No Available Drivers
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    All drivers are currently busy or off-duty.
                  </p>
                </div>
              ) : (
                <div
                  className="space-y-2.5"
                  style={{ animation: "slideUpIn 0.3s ease-out" }}
                >
                  {sortedDrivers.map(({ driver, distanceKm, isSameZone }) => (
                    <DriverCard
                      key={driver.id}
                      driver={driver}
                      distanceKm={distanceKm}
                      isSelected={selectedDriverId === driver.id}
                      isSameZone={isSameZone}
                      onSelect={() => setSelectedDriverId(driver.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="flex-shrink-0 px-7 pb-7 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
            {/* Preview of selection */}
            {selectedEntry && (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/50"
                style={{ animation: "slideUpIn 0.25s ease-out" }}
              >
                <div className={`w-9 h-9 rounded-xl ${selectedEntry.driver.avatarColor} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xs font-black">{selectedEntry.driver.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-gray-900 dark:text-white">
                    {selectedEntry.driver.name}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {selectedEntry.driver.vehicleType} · {selectedEntry.distanceKm.toFixed(1)}km away · ⭐{selectedEntry.driver.rating.toFixed(1)}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Selected
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isConfirming}
                className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-black uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedDriverId || isConfirming}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:scale-100"
              >
                {isConfirming ? (
                  <>
                    <div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      style={{ animation: "spinnerRing 0.7s linear infinite" }}
                    />
                    Dispatching…
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4" />
                    Confirm Assignment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}