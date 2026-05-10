import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  X,
  Upload,
  Camera,
  Cpu,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Package,
  Weight,
  Zap,
  RotateCcw,
  Coins,
  ChevronRight,
  Sparkles,
  Eye,
} from "lucide-react";
import { usePickup } from "@/app/contexts/PickupContext";
import { useWallet } from "@/app/contexts/WalletContext";
import { useAlertsConfig } from "@/app/contexts/AlertsConfigContext";
import {
  type PickupRequest,
  type ValidationResult,
  POINTS_PER_KG,
} from "@/app/types/recyclehub";
import { notify } from "@/app/utils/notifications";

/* ─── Types ─────────────────────────────────────────── */
type ModalPhase = "upload" | "scanning" | "results" | "approved";

interface MockDetection {
  detectedQuantity: number;
  detectedWeightKg: number;
  matchPercentage: number;
}

/* ─── Helpers ────────────────────────────────────────── */
function simulateAI(request: PickupRequest): MockDetection {
  // Random match between 72% and 99%
  const matchPercentage = Math.round(Math.random() * 27 + 72);
  const variance = matchPercentage / 100;
  const expectedQty = request.items.reduce(
    (s, i) => s + i.expectedQuantity,
    0
  );
  const expectedKg = request.items.reduce(
    (s, i) => s + i.expectedWeightKg,
    0
  );
  return {
    matchPercentage,
    detectedQuantity: Math.round(expectedQty * variance),
    detectedWeightKg: +(expectedKg * variance).toFixed(2),
  };
}

/* ─── Circular Progress Bar ──────────────────────────── */
function CircularProgress({
  value,
  size = 160,
  strokeWidth = 12,
  threshold = 80,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  threshold?: number;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color =
    value >= threshold
      ? "#10b981"
      : value >= threshold - 10
      ? "#14b8a6"
      : value >= threshold - 20
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="rotate-[-90deg]"
        style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-100 dark:text-gray-800"
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#aiGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        <defs>
          <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="tabular-nums"
          style={{ fontSize: 32, fontWeight: 900, color, lineHeight: 1 }}
        >
          {value}%
        </span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
          Match
        </span>
      </div>
    </div>
  );
}

/* ─── Shimmer Scanning Animation ─────────────────────── */
function ScannerOverlay() {
  return (
    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
      {/* Shimmer sweep */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(16,185,129,0.35) 50%, transparent 60%)",
          backgroundSize: "200% 100%",
          animation: "shimmerSweep 1.4s ease-in-out infinite",
        }}
      />
      {/* Scan line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent, #10b981, transparent)",
          animation: "scanLine 1.8s ease-in-out infinite",
          boxShadow: "0 0 12px 3px rgba(16,185,129,0.6)",
        }}
      />
      {/* Corner brackets */}
      {[
        "top-2 left-2 border-t-2 border-l-2",
        "top-2 right-2 border-t-2 border-r-2",
        "bottom-2 left-2 border-b-2 border-l-2",
        "bottom-2 right-2 border-b-2 border-r-2",
      ].map((cls, i) => (
        <div
          key={i}
          className={`absolute w-6 h-6 border-emerald-400 ${cls}`}
          style={{ animation: `bracketPulse 1.2s ease-in-out ${i * 0.1}s infinite` }}
        />
      ))}
    </div>
  );
}

/* ─── Confetti Celebration ───────────────────────────── */
function Confetti() {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: ["#10b981", "#14b8a6", "#6ee7b7", "#f59e0b", "#34d399"][i % 5],
    delay: `${Math.random() * 0.6}s`,
    duration: `${0.8 + Math.random() * 0.6}s`,
    size: 6 + Math.round(Math.random() * 6),
    rotate: Math.round(Math.random() * 360),
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.id % 3 === 0 ? "50%" : "2px",
            transform: `rotate(${p.rotate}deg)`,
            animation: `confettiRise ${p.duration} ${p.delay} ease-out forwards`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main Modal ─────────────────────────────────────── */
interface AIValidationModalProps {
  request: PickupRequest;
  onClose: () => void;
}

export function AIValidationModal({ request, onClose }: AIValidationModalProps) {
  const { updateRequestStatus, attachValidation } = usePickup();
  const { addPoints } = useWallet();
  const { config: alertsConfig } = useAlertsConfig();

  const [phase, setPhase] = useState<ModalPhase>("upload");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [detection, setDetection] = useState<MockDetection | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [driverNotes, setDriverNotes] = useState("");
  const [animateResult, setAnimateResult] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const expectedQty = request.items.reduce((s, i) => s + i.expectedQuantity, 0);
  const expectedKg = request.items.reduce((s, i) => s + i.expectedWeightKg, 0);

  /* ── cleanup on unmount ── */
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, []);

  /* ── scanning simulation ── */
  const startScanning = useCallback(() => {
    setPhase("scanning");
    setScanProgress(0);
    let progress = 0;
    scanIntervalRef.current = setInterval(() => {
      progress += Math.random() * 8 + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(scanIntervalRef.current!);
        const result = simulateAI(request);
        setDetection(result);
        setTimeout(() => {
          setPhase("results");
          setTimeout(() => setAnimateResult(true), 20);
        }, 100);
      }
      setScanProgress(Math.min(100, progress));
    }, 160);
  }, [request]);

  /* ── file drop handlers ── */
  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setTimeout(() => startScanning(), 150);
      };
      reader.readAsDataURL(file);
    },
    [startScanning]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  /* ── mock scan (no real image) ── */
  const handleMockScan = useCallback(() => {
    setImagePreview(null);
    startScanning();
  }, [startScanning]);

  /* ── approve ── */
  const handleApprove = useCallback(() => {
    if (!detection) return;
    const actualKg = detection.detectedWeightKg;
    const points = Math.round(actualKg * POINTS_PER_KG);

    const result: ValidationResult = {
      validatedAt: new Date(),
      matchPercentage: detection.matchPercentage,
      expectedQuantity: expectedQty,
      detectedQuantity: detection.detectedQuantity,
      expectedWeightKg: expectedKg,
      detectedWeightKg: detection.detectedWeightKg,
      imageUrls: imagePreview ? [imagePreview] : [],
      discrepancyNotes: driverNotes || undefined,
      approved: true,
      validatedBy: "Admin",
    };

    attachValidation(request.id, result);
    updateRequestStatus(request.id, "Completed");
    addPoints(points, `Pickup ${request.id}: ${actualKg}kg recycled`);

    setPhase("approved");
    notify.success(
      "Validation Approved ✓",
      `${points} points awarded to ${request.citizen.name}`
    );
  }, [
    detection,
    expectedQty,
    expectedKg,
    imagePreview,
    driverNotes,
    request,
    attachValidation,
    updateRequestStatus,
    addPoints,
  ]);

  /* ── reject / recount ── */
  const handleRecount = useCallback(() => {
    const result: ValidationResult = {
      validatedAt: new Date(),
      matchPercentage: detection?.matchPercentage ?? 0,
      expectedQuantity: expectedQty,
      detectedQuantity: detection?.detectedQuantity ?? 0,
      expectedWeightKg: expectedKg,
      detectedWeightKg: detection?.detectedWeightKg ?? 0,
      imageUrls: [],
      discrepancyNotes: driverNotes || "Returned for recount",
      approved: false,
      validatedBy: "Admin",
    };
    attachValidation(request.id, result);
    updateRequestStatus(request.id, "In-Progress");
    notify.warning("Returned for Recount", `${request.id} moved back to In-Progress`);
    onClose();
  }, [
    detection,
    expectedQty,
    expectedKg,
    driverNotes,
    request,
    attachValidation,
    updateRequestStatus,
    onClose,
  ]);

  const isDiscrepancy = detection && detection.matchPercentage < alertsConfig.matchThreshold;
  const earnablePoints = detection
    ? Math.round(detection.detectedWeightKg * POINTS_PER_KG)
    : 0;

  return (
    <>
      {/* ── CSS keyframes injected once ── */}
      <style>{`
        @keyframes shimmerSweep {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes scanLine {
          0%   { top: 8%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 92%; opacity: 0; }
        }
        @keyframes bracketPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        @keyframes confettiRise {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(-420px) rotate(720deg) scale(0.4); opacity: 0; }
        }
        @keyframes fadeScaleIn {
          0%   { opacity: 0; transform: scale(0.88); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUpIn {
          0%   { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRing {
          0%, 100% { transform: scale(1);   opacity: 0.7; }
          50%       { transform: scale(1.12); opacity: 0.3; }
        }
        @keyframes checkDraw {
          0%   { stroke-dashoffset: 60; opacity: 0; }
          100% { stroke-dashoffset: 0;  opacity: 1; }
        }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ animation: "fadeScaleIn 0.22s ease-out" }}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={phase !== "scanning" ? onClose : undefined}
        />

        {/* ── Modal Shell ── */}
        <div
          className="relative z-10 w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl
            bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/40 dark:border-gray-700/50"
          style={{ animation: "fadeScaleIn 0.28s cubic-bezier(0.34,1.56,0.64,1)" }}
        >
          {/* ── Confetti on approved ── */}
          {phase === "approved" && <Confetti />}

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                  AI Validation
                </h2>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  {request.id} · {request.citizen.name}
                </p>
              </div>
            </div>
            {phase !== "scanning" && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          <div className="px-8 py-6 space-y-6">
            {/* ════════════════════════════════════════ PHASE: UPLOAD */}
            {phase === "upload" && (
              <div style={{ animation: "slideUpIn 0.3s ease-out" }}>
                {/* Expected items summary */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    {
                      label: "Plastic Type",
                      value: request.items[0]?.plasticType ?? "—",
                      icon: <Package className="w-4 h-4" />,
                    },
                    {
                      label: "Expected Qty",
                      value: `${expectedQty} units`,
                      icon: <Eye className="w-4 h-4" />,
                    },
                    {
                      label: "Expected Weight",
                      value: `${expectedKg} kg`,
                      icon: <Weight className="w-4 h-4" />,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/40 p-4 flex flex-col gap-2"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm text-emerald-600">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {item.label}
                        </p>
                        <p className="text-sm font-black text-gray-900 dark:text-white mt-0.5">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dropzone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer group
                    ${isDragging
                      ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 scale-[1.01]"
                      : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10"
                    }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                    }}
                  />
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-200"
                    >
                      <Upload className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-gray-900 dark:text-white">
                        Drop pickup photo here
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        JPG, PNG or HEIF · up to 20 MB
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-px w-12 bg-gray-200" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase">or</span>
                      <div className="h-px w-12 bg-gray-200" />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-emerald-400 transition-colors shadow-sm"
                      >
                        <Camera className="w-3.5 h-3.5 text-emerald-500" />
                        Camera
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMockScan(); }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Skip & Simulate AI
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════ PHASE: SCANNING */}
            {phase === "scanning" && (
              <div
                className="flex flex-col items-center gap-8 py-4"
                style={{ animation: "slideUpIn 0.3s ease-out" }}
              >
                {/* Image with scanner overlay */}
                <div className="relative w-full max-w-sm h-52 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Pickup"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900">
                      <div
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
                        style={{ animation: "pulseRing 1.2s ease-in-out infinite" }}
                      >
                        <Cpu className="w-7 h-7 text-white" />
                      </div>
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        Simulating AI Vision...
                      </p>
                    </div>
                  )}
                  <ScannerOverlay />
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-sm space-y-3">
                  <div className="flex justify-between text-[11px] font-bold text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                      Analyzing recyclables…
                    </span>
                    <span className="text-emerald-600">{Math.round(scanProgress)}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm"
                      style={{
                        width: `${scanProgress}%`,
                        transition: "width 0.2s ease-out",
                        boxShadow: "0 0 8px rgba(16,185,129,0.6)",
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {["Object Detection", "Weight Estimate", "Type Classify"].map((step, i) => (
                      <div
                        key={step}
                        className={`rounded-xl py-2 text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
                          scanProgress > (i + 1) * 28
                            ? "bg-emerald-500 text-white"
                            : scanProgress > i * 28
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 animate-pulse"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                        }`}
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════ PHASE: RESULTS */}
            {phase === "results" && detection && (
              <div
                className="space-y-6"
                style={{
                  opacity: animateResult ? 1 : 0,
                  transform: animateResult ? "translateY(0)" : "translateY(16px)",
                  transition: "opacity 0.45s ease-out, transform 0.45s ease-out",
                }}
              >
                {/* Match Percentage + Stats */}
                <div className="flex flex-col sm:flex-row items-center gap-8 p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/60 dark:to-gray-900/60 border border-gray-100 dark:border-gray-800">
                  <CircularProgress
                    value={detection.matchPercentage}
                    threshold={alertsConfig.matchThreshold}
                  />
                  <div className="flex-1 space-y-3 w-full">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white">
                      AI Analysis Complete
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Expected Qty", val: `${expectedQty}`, sub: "units" },
                        { label: "Detected Qty", val: `${detection.detectedQuantity}`, sub: "units" },
                        { label: "Expected Kg", val: `${expectedKg}`, sub: "kg" },
                        { label: "Detected Kg", val: `${detection.detectedWeightKg}`, sub: "kg" },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 shadow-sm"
                        >
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            {s.label}
                          </p>
                          <p className="text-lg font-black text-gray-900 dark:text-white leading-none mt-1">
                            {s.val}
                            <span className="text-xs font-bold text-gray-400 ml-1">{s.sub}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                    {/* Points preview */}
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200 dark:border-emerald-800/50">
                      <Coins className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                        {earnablePoints} pts will be awarded
                      </span>
                      <span className="ml-auto text-[10px] font-bold text-gray-400">
                        @ {POINTS_PER_KG} pts/kg
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comparison table */}
                <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-white/80" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">
                      Item Comparison
                    </span>
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/60">
                        {["Plastic Type", "Expected Qty", "Expected Kg", "Detected Qty", "Detected Kg", "Δ Variance"].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-gray-400"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {request.items.map((item, i) => {
                        const qtyVar = Math.abs(detection.detectedQuantity - item.expectedQuantity);
                        const kgVar = +(Math.abs(detection.detectedWeightKg - item.expectedWeightKg)).toFixed(2);
                        const bad = kgVar / item.expectedWeightKg > 0.2;
                        return (
                          <tr
                            key={i}
                            className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <td className="px-4 py-3 font-black text-gray-900 dark:text-white">
                              {item.plasticType}
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                              {item.expectedQuantity}
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                              {item.expectedWeightKg} kg
                            </td>
                            <td className={`px-4 py-3 font-bold ${bad ? "text-red-500" : "text-emerald-600"}`}>
                              {detection.detectedQuantity}
                            </td>
                            <td className={`px-4 py-3 font-bold ${bad ? "text-red-500" : "text-emerald-600"}`}>
                              {detection.detectedWeightKg} kg
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                  bad
                                    ? "bg-red-50 text-red-600 dark:bg-red-900/20"
                                    : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
                                }`}
                              >
                                Qty: -{qtyVar} · {kgVar}kg
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Discrepancy alert */}
                {isDiscrepancy && (
                  <div
                    className="rounded-2xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/10 p-5 space-y-3"
                    style={{ animation: "slideUpIn 0.3s ease-out" }}
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-sm font-black text-red-700 dark:text-red-400">
                        Discrepancy Detected — Match below {alertsConfig.matchThreshold}%
                      </p>
                    </div>
                    <p className="text-xs text-red-600/80 dark:text-red-400/80">
                      The detected quantities differ significantly from the expected values.
                      Please add driver notes or return for recount.
                    </p>
                    <textarea
                      value={driverNotes}
                      onChange={(e) => setDriverNotes(e.target.value)}
                      placeholder="Driver notes (e.g. bags were wet, incorrect sorting…)"
                      rows={3}
                      className="w-full rounded-xl px-4 py-3 text-xs bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 text-gray-700 dark:text-gray-200 outline-none focus:border-red-400 transition-colors resize-none placeholder-gray-400"
                    />
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleRecount}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-black uppercase tracking-wider hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reject / Recount
                  </button>
                  <button
                    onClick={handleApprove}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve & Award {earnablePoints} pts
                  </button>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════ PHASE: APPROVED */}
            {phase === "approved" && (
              <div
                className="flex flex-col items-center gap-6 py-8 text-center"
                style={{ animation: "slideUpIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
              >
                {/* Animated checkmark */}
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-full bg-emerald-400 opacity-20"
                    style={{ animation: "pulseRing 1.4s ease-in-out infinite" }}
                  />
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <path
                        d="M12 25L20 33L36 17"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="60"
                        style={{ animation: "checkDraw 0.6s 0.1s ease-out forwards", strokeDashoffset: 60 }}
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                    Validation Approved!
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {request.id} has been marked as{" "}
                    <span className="font-bold text-emerald-600">Completed</span>
                  </p>
                </div>

                {/* Points awarded badge */}
                <div className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/30">
                  <Coins className="w-7 h-7 text-white" />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">
                      Points Awarded
                    </p>
                    <p className="text-2xl font-black text-white leading-none">
                      +{earnablePoints} pts
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full max-w-xs text-sm">
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Match</p>
                    <p className="font-black text-emerald-600 mt-0.5">
                      {detection?.matchPercentage}%
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Weight</p>
                    <p className="font-black text-gray-900 dark:text-white mt-0.5">
                      {detection?.detectedWeightKg} kg
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                >
                  <XCircle className="w-4 h-4" />
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}