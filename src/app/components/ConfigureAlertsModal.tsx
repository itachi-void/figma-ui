import { useState, useEffect, useRef, useCallback } from "react";
import {
  Shield,
  X,
  Cpu,
  Truck,
  Bell,
  RotateCcw,
  Zap,
  Mail,
  MonitorSmartphone,
  Clock,
  Weight,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Smartphone,
} from "lucide-react";
import {
  useAlertsConfig,
  type NotificationChannels,
} from "../contexts/AlertsConfigContext";
import { notify } from "../utils/notifications";

/* ─── Glassmorphism Card ──────────────────────────────── */
function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/60 bg-white/55 backdrop-blur-md shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Section Header ──────────────────────────────────── */
function SectionHeader({
  icon,
  title,
  subtitle,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradient: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 ${gradient}`}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-gray-900 leading-tight">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

/* ─── Emerald Toggle ──────────────────────────────────── */
function EmeraldToggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
        checked
          ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md shadow-emerald-200"
          : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

/* ─── Emerald Checkbox ────────────────────────────────── */
function EmeraldCheckbox({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      id={id}
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 flex-shrink-0 ${
        checked
          ? "bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-500 shadow-sm shadow-emerald-200"
          : "border-gray-300 bg-white hover:border-emerald-400"
      }`}
    >
      {checked && (
        <svg
          className="w-3 h-3 text-white"
          viewBox="0 0 12 10"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="1,5 4,9 11,1" />
        </svg>
      )}
    </button>
  );
}

/* ─── Threshold Slider ────────────────────────────────── */
function ThresholdSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - 60) / 40) * 100;

  const color =
    value >= 90
      ? "#10b981"
      : value >= 80
      ? "#14b8a6"
      : value >= 70
      ? "#f59e0b"
      : "#ef4444";

  const label =
    value >= 90
      ? "Very Strict"
      : value >= 80
      ? "Strict"
      : value >= 70
      ? "Moderate"
      : "Lenient";

  const badgeBg =
    value >= 90
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : value >= 80
      ? "bg-teal-100 text-teal-700 border-teal-200"
      : value >= 70
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-red-100 text-red-700 border-red-200";

  return (
    <div className="space-y-4">
      {/* Value display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="tabular-nums font-black text-3xl"
            style={{ color }}
          >
            {value}%
          </span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full border ${badgeBg}`}
          >
            {label}
          </span>
        </div>
        <div className="text-right text-xs text-gray-400">
          AI match must exceed this
          <br />
          threshold to pass ✓
        </div>
      </div>

      {/* Track */}
      <div className="relative">
        <style>{`
          .threshold-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: white;
            border: 3px solid ${color};
            cursor: pointer;
            box-shadow: 0 2px 8px ${color}60;
            transition: box-shadow 0.15s;
          }
          .threshold-slider::-webkit-slider-thumb:hover {
            box-shadow: 0 2px 16px ${color}90;
          }
          .threshold-slider::-moz-range-thumb {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: white;
            border: 3px solid ${color};
            cursor: pointer;
            box-shadow: 0 2px 8px ${color}60;
          }
          .threshold-slider {
            -webkit-appearance: none;
            appearance: none;
            height: 6px;
            border-radius: 999px;
            outline: none;
            cursor: pointer;
            background: linear-gradient(
              to right,
              ${color} 0%,
              ${color} ${pct}%,
              #e5e7eb ${pct}%,
              #e5e7eb 100%
            );
            transition: background 0.1s;
          }
        `}</style>
        <input
          type="range"
          min={60}
          max={100}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="threshold-slider w-full"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-medium">
          <span>60% — Lenient</span>
          <span>80% — Recommended</span>
          <span>100% — Strict</span>
        </div>
      </div>

      {/* Live preview hint */}
      <div
        className="flex items-start gap-2 p-3 rounded-xl text-xs"
        style={{ backgroundColor: `${color}12`, border: `1px solid ${color}30` }}
      >
        {value >= 80 ? (
          <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color }} />
        ) : value >= 70 ? (
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color }} />
        ) : (
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color }} />
        )}
        <span style={{ color }}>
          {value >= 90
            ? `Only AI scans scoring ≥${value}% will auto-approve. Anything below triggers a red discrepancy alert requiring manual review.`
            : value >= 80
            ? `Matches scoring ≥${value}% are approved normally. Scores ${value - 15}–${value - 1}% flag as amber warnings.`
            : value >= 70
            ? `Lower threshold — scores ≥${value}% pass. This may allow more borderline approvals through.`
            : `Very lenient — most scans will pass. Consider raising the threshold for better quality control.`}
        </span>
      </div>
    </div>
  );
}

/* ─── Test Notification Pulse ─────────────────────────── */
function PulseRing({ color }: { color: string }) {
  return (
    <span
      className="absolute inset-0 rounded-xl animate-ping opacity-30"
      style={{ backgroundColor: color }}
    />
  );
}

/* ─── Main Modal ──────────────────────────────────────── */
interface ConfigureAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigureAlertsModal({
  isOpen,
  onClose,
}: ConfigureAlertsModalProps) {
  const { config, updateConfig, updateChannels, resetDefaults } =
    useAlertsConfig();

  // Local draft — only commit on "Save & Apply"
  const [draft, setDraft] = useState(config);
  const [isVisible, setIsVisible] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testPulsed, setTestPulsed] = useState(false);
  const [emailSentMsg, setEmailSentMsg] = useState(false);
  const [saved, setSaved] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Sync draft when modal opens
  useEffect(() => {
    if (isOpen) {
      setDraft(config);
      setSaved(false);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, config]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) handleClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  const handleSave = useCallback(() => {
    updateConfig({
      matchThreshold: draft.matchThreshold,
      delayedPickupAlert: draft.delayedPickupAlert,
      capacityWarningAlert: draft.capacityWarningAlert,
    });
    updateChannels(draft.channels);
    setSaved(true);
    notify.success(
      "Smart Guard Updated ✓",
      "Alert configuration saved and applied across the ecosystem."
    );
    setTimeout(handleClose, 600);
  }, [draft, updateConfig, updateChannels, handleClose]);

  const handleReset = useCallback(() => {
    const defaults = {
      matchThreshold: 80,
      delayedPickupAlert: true,
      capacityWarningAlert: true,
      channels: { dashboardToast: true, email: false, browserPush: false },
    };
    setDraft(defaults);
    notify.info("Defaults Restored", "Settings reset to factory defaults.");
  }, []);

  const handleTestNotification = useCallback(async () => {
    setIsTesting(true);
    setTestPulsed(true);
    setTimeout(() => setTestPulsed(false), 1500);

    // Dashboard Toast
    if (draft.channels.dashboardToast) {
      setTimeout(() => {
        notify.info(
          "🛡️ Smart Guard Test",
          "Alert system is active and monitoring the recycling ecosystem."
        );
      }, 200);
    }

    // Browser Push
    if (draft.channels.browserPush) {
      if ("Notification" in window) {
        let perm = Notification.permission;
        if (perm === "default") {
          perm = await Notification.requestPermission();
        }
        if (perm === "granted") {
          setTimeout(() => {
            new Notification("RecycleHub — Smart Guard", {
              body: "Alert system test: monitoring active across all zones.",
              icon: "/favicon.ico",
            });
          }, 400);
        } else {
          notify.warning(
            "Browser Push Blocked",
            "Please allow notifications in your browser settings."
          );
        }
      }
    }

    // Email mock
    if (draft.channels.email) {
      setTimeout(() => {
        setEmailSentMsg(true);
        setTimeout(() => setEmailSentMsg(false), 3500);
      }, 300);
    }

    // No channels?
    if (
      !draft.channels.dashboardToast &&
      !draft.channels.email &&
      !draft.channels.browserPush
    ) {
      notify.warning(
        "No Channels Selected",
        "Enable at least one notification channel to receive alerts."
      );
    }

    setTimeout(() => setIsTesting(false), 1500);
  }, [draft.channels]);

  const setDraftChannel = (partial: Partial<NotificationChannels>) =>
    setDraft((prev) => ({ ...prev, channels: { ...prev.channels, ...partial } }));

  if (!isOpen) return null;

  return (
    <>
      {/* CSS keyframes for modal */}
      <style>{`
        @keyframes alertsModalIn {
          0%   { opacity: 0; transform: scale(0.92) translateY(16px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes alertsModalOut {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.94); }
        }
        @keyframes slideRowIn {
          0%   { opacity: 0; transform: translateX(-8px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={(e) => e.target === backdropRef.current && handleClose()}
        className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-200 ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.6) 100%)",
          backdropFilter: "blur(6px)",
        }}
      >
        {/* Modal shell */}
        <div
          className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden"
          style={{
            animation: isVisible
              ? "alertsModalIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both"
              : "alertsModalOut 0.18s ease-in both",
            background:
              "linear-gradient(160deg, #f0fdf8 0%, #f0fdfa 40%, #f5f3ff 100%)",
            border: "1px solid rgba(255,255,255,0.7)",
          }}
        >
          {/* ── Gradient Header ── */}
          <div
            className="flex-shrink-0 relative overflow-hidden px-7 py-6"
            style={{
              background:
                "linear-gradient(135deg, #059669 0%, #0d9488 50%, #0891b2 100%)",
            }}
          >
            {/* decorative circles */}
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 right-16 w-24 h-24 rounded-full bg-white/5" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-black text-white tracking-tight">
                    Smart Guard
                  </h2>
                  <p className="text-emerald-100 text-xs mt-0.5">
                    Alert Configuration Panel
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Status bar */}
            <div className="relative flex items-center gap-2 mt-4 bg-white/15 rounded-xl px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse flex-shrink-0" />
              <span className="text-xs text-white/90">
                Monitoring{" "}
                <span className="font-bold">all zones & pickups</span> in
                real-time
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-white/50 ml-auto" />
            </div>
          </div>

          {/* ── Scrollable Body ── */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">

            {/* ══ 1. AI Precision Control ══ */}
            <GlassCard className="p-5">
              <SectionHeader
                icon={<Cpu className="w-5 h-5 text-white" />}
                title="AI Precision Control"
                subtitle="Set the global match threshold for bottle scan validation"
                gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
              />
              <ThresholdSlider
                value={draft.matchThreshold}
                onChange={(v) =>
                  setDraft((prev) => ({ ...prev, matchThreshold: v }))
                }
              />
            </GlassCard>

            {/* ══ 2. Logistics Monitoring ══ */}
            <GlassCard className="p-5">
              <SectionHeader
                icon={<Truck className="w-5 h-5 text-white" />}
                title="Logistics Monitoring"
                subtitle="Automated triggers to catch operational bottlenecks"
                gradient="bg-gradient-to-br from-violet-500 to-purple-600"
              />

              <div className="space-y-3">
                {/* Row: Delayed Pickup */}
                <div
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                    draft.delayedPickupAlert
                      ? "bg-emerald-50/80 border-emerald-200"
                      : "bg-gray-50/80 border-gray-200"
                  }`}
                  style={{ animation: "slideRowIn 0.2s ease-out" }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                        draft.delayedPickupAlert
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm leading-tight">
                        Delayed Pickup Alert
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Triggers if a request stays{" "}
                        <span className="font-bold text-violet-600">
                          In-Progress &gt; 2 hours
                        </span>
                      </p>
                    </div>
                  </div>
                  <EmeraldToggle
                    id="delayed-pickup"
                    checked={draft.delayedPickupAlert}
                    onChange={(v) =>
                      setDraft((prev) => ({ ...prev, delayedPickupAlert: v }))
                    }
                  />
                </div>

                {/* Row: Capacity Warning */}
                <div
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                    draft.capacityWarningAlert
                      ? "bg-emerald-50/80 border-emerald-200"
                      : "bg-gray-50/80 border-gray-200"
                  }`}
                  style={{ animation: "slideRowIn 0.25s ease-out" }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                        draft.capacityWarningAlert
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Weight className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm leading-tight">
                        Capacity Warning
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Alert when a zone exceeds{" "}
                        <span className="font-bold text-violet-600">
                          1,000 kg
                        </span>{" "}
                        collected
                      </p>
                    </div>
                  </div>
                  <EmeraldToggle
                    id="capacity-warning"
                    checked={draft.capacityWarningAlert}
                    onChange={(v) =>
                      setDraft((prev) => ({
                        ...prev,
                        capacityWarningAlert: v,
                      }))
                    }
                  />
                </div>
              </div>
            </GlassCard>

            {/* ══ 3. Notification Channels ══ */}
            <GlassCard className="p-5">
              <SectionHeader
                icon={<Bell className="w-5 h-5 text-white" />}
                title="Notification Channels"
                subtitle="Where should the admin receive these alerts?"
                gradient="bg-gradient-to-br from-amber-500 to-orange-500"
              />

              <div className="space-y-2.5">
                {/* Dashboard Toast */}
                <label
                  htmlFor="ch-toast"
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer select-none transition-all duration-150 ${
                    draft.channels.dashboardToast
                      ? "bg-emerald-50/80 border-emerald-200"
                      : "bg-white/60 border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/40"
                  }`}
                >
                  <EmeraldCheckbox
                    id="ch-toast"
                    checked={draft.channels.dashboardToast}
                    onChange={(v) => setDraftChannel({ dashboardToast: v })}
                  />
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        draft.channels.dashboardToast
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <MonitorSmartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        Dashboard Toast
                      </p>
                      <p className="text-xs text-gray-500">
                        In-app notifications in the bottom corner
                      </p>
                    </div>
                  </div>
                  {draft.channels.dashboardToast && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full flex-shrink-0">
                      ACTIVE
                    </span>
                  )}
                </label>

                {/* Email */}
                <label
                  htmlFor="ch-email"
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer select-none transition-all duration-150 ${
                    draft.channels.email
                      ? "bg-emerald-50/80 border-emerald-200"
                      : "bg-white/60 border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/40"
                  }`}
                >
                  <EmeraldCheckbox
                    id="ch-email"
                    checked={draft.channels.email}
                    onChange={(v) => setDraftChannel({ email: v })}
                  />
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        draft.channels.email
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        Email Notification
                      </p>
                      <p className="text-xs text-gray-500">
                        Send alert digest to admin@recyclehub.io
                      </p>
                    </div>
                  </div>
                  {emailSentMsg && (
                    <span className="text-[10px] font-bold text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full flex-shrink-0 animate-pulse">
                      SENT ✓
                    </span>
                  )}
                </label>

                {/* Browser Push */}
                <label
                  htmlFor="ch-push"
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer select-none transition-all duration-150 ${
                    draft.channels.browserPush
                      ? "bg-emerald-50/80 border-emerald-200"
                      : "bg-white/60 border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/40"
                  }`}
                >
                  <EmeraldCheckbox
                    id="ch-push"
                    checked={draft.channels.browserPush}
                    onChange={(v) => setDraftChannel({ browserPush: v })}
                  />
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        draft.channels.browserPush
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        Browser Push
                      </p>
                      <p className="text-xs text-gray-500">
                        Native browser push notifications
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </GlassCard>

            {/* ══ Active Channels Summary ══ */}
            {(draft.channels.dashboardToast ||
              draft.channels.email ||
              draft.channels.browserPush) && (
              <div className="flex items-center gap-2 px-1">
                <Zap className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <p className="text-xs text-gray-500">
                  Alerts will be sent via:{" "}
                  <span className="font-semibold text-emerald-700">
                    {[
                      draft.channels.dashboardToast && "Dashboard Toast",
                      draft.channels.email && "Email",
                      draft.channels.browserPush && "Browser Push",
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* ── Sticky Footer ── */}
          <div className="flex-shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-6 py-4 border-t border-white/60 bg-white/40 backdrop-blur">
            {/* Reset */}
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white/80 hover:bg-gray-50 text-gray-600 text-sm font-semibold transition-all hover:border-gray-300 order-3 sm:order-1 sm:mr-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>

            {/* Test Notification */}
            <div className="relative order-2">
              {testPulsed && <PulseRing color="#10b981" />}
              <button
                onClick={handleTestNotification}
                disabled={isTesting}
                className={`relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-emerald-200 text-sm font-semibold transition-all w-full sm:w-auto ${
                  isTesting
                    ? "bg-emerald-50 text-emerald-400 cursor-not-allowed"
                    : "bg-white/80 hover:bg-emerald-50 text-emerald-700 hover:border-emerald-300"
                }`}
              >
                <Bell
                  className={`w-4 h-4 ${isTesting ? "animate-bounce" : ""}`}
                />
                {isTesting ? "Sending..." : "Test Notification"}
              </button>
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saved}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-all shadow-md order-1 sm:order-3 ${
                saved
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-200 hover:shadow-emerald-300 hover:shadow-lg"
              }`}
            >
              {saved ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Save & Apply
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
