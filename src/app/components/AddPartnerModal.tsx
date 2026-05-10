"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  Building2,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  FileText,
  Upload,
  Shield,
  Hash,
  MapPin,
  Users,
  Phone,
  Mail,
  Package,
  DollarSign,
  Factory,
  Recycle,
  Star,
  Zap,
  Sparkles,
} from "lucide-react";
import { useB2B } from "@/app/contexts/B2BContext";
import type { PartnerType, B2BPartnerExtended } from "@/app/contexts/B2BContext";
import type { PlasticType } from "@/app/types/recyclehub";

/* ─── Constants ──────────────────────────────────────────── */
const PLASTIC_TYPES: PlasticType[] = ["PET", "HDPE", "PVC", "LDPE", "PP", "PS", "Other"];

const AVATAR_COLORS = [
  "bg-emerald-500",
  "bg-teal-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-indigo-500",
];

const STEPS = [
  { label: "Company", icon: Building2 },
  { label: "Contact", icon: Users },
  { label: "Contract", icon: FileText },
];

/* ─── Helpers ────────────────────────────────────────────── */
function generatePartnerCode(name: string, count: number): string {
  const words = name.trim().split(/\s+/).filter((w) => w.length > 1);
  const initials = words
    .slice(0, 3)
    .map((w) => w[0].toUpperCase())
    .join("");
  const year = new Date().getFullYear();
  const seq = String(count + 1).padStart(3, "0");
  return initials ? `${initials}-${year}-${seq}` : "";
}

function getInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "??"
  );
}

function getCapacityInsight(quota: number | "") {
  const q = Number(quota);
  if (!q || q <= 0) return null;
  if (q < 5)
    return {
      label: "Low Volume Alert",
      cls: "text-amber-600 bg-amber-50 border-amber-200",
      emoji: "⚠️",
    };
  if (q <= 12)
    return {
      label: "Optimal Quota Match",
      cls: "text-emerald-600 bg-emerald-50 border-emerald-200",
      emoji: "✅",
    };
  return {
    label: "System Capacity: High",
    cls: "text-teal-600 bg-teal-50 border-teal-200",
    emoji: "🔥",
  };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/* ─── Confetti ───────────────────────────────────────────── */
const EMERALD_TEAL_PALETTE = [
  "#10b981", "#14b8a6", "#059669", "#0d9488",
  "#34d399", "#2dd4bf", "#6ee7b7", "#99f6e4",
  "#047857", "#0f766e", "#a7f3d0", "#5eead4",
  "#d1fae5", "#ccfbf1",
];

interface Particle {
  id: number;
  x: number;
  color: string;
  w: number;
  h: number;
  delay: string;
  dur: string;
  isCircle: boolean;
  rot: number;
}

function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;
    setParticles(
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: EMERALD_TEAL_PALETTE[i % EMERALD_TEAL_PALETTE.length],
        w: Math.random() * 10 + 5,
        h: Math.random() * 7 + 4,
        delay: (Math.random() * 2).toFixed(2),
        dur: (Math.random() * 2.5 + 1.8).toFixed(2),
        isCircle: i % 4 === 0,
        rot: Math.random() * 360,
      }))
    );
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-15px) rotate(0deg) scale(1); opacity: 1; }
          70%  { opacity: 0.9; }
          100% { transform: translateY(580px) rotate(680deg) scale(0.6); opacity: 0; }
        }
        .rh-confetti { animation: confetti-fall linear forwards; position: absolute; top: 0; }
      `}</style>
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-20">
        {particles.map((p) => (
          <div
            key={p.id}
            className="rh-confetti"
            style={{
              left: `${p.x}%`,
              width: p.isCircle ? p.w : p.w * 1.4,
              height: p.isCircle ? p.w : p.h,
              backgroundColor: p.color,
              borderRadius: p.isCircle ? "50%" : "2px",
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
              transform: `rotate(${p.rot}deg)`,
            }}
          />
        ))}
      </div>
    </>
  );
}

/* ─── Animated Checkmark ─────────────────────────────────── */
function AnimatedCheck() {
  return (
    <>
      <style>{`
        @keyframes rh-scale-in {
          0%   { transform: scale(0); opacity: 0; }
          65%  { transform: scale(1.18); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes rh-circle-draw {
          from { stroke-dashoffset: 314; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes rh-check-draw {
          from { stroke-dashoffset: 200; }
          to   { stroke-dashoffset: 0; }
        }
        .rh-check-wrap  { animation: rh-scale-in 0.55s cubic-bezier(.34,1.56,.64,1) forwards; transform-origin: center; }
        .rh-check-circle { stroke-dasharray: 314; stroke-dashoffset: 314; animation: rh-circle-draw 0.65s ease 0.1s forwards; }
        .rh-check-path   { stroke-dasharray: 200; stroke-dashoffset: 200; animation: rh-check-draw 0.45s ease 0.6s forwards; }
        @keyframes rh-glow-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
          50%      { box-shadow: 0 0 0 16px rgba(16,185,129,0); }
        }
        .rh-glow { animation: rh-glow-pulse 1.5s ease 0.8s infinite; }
      `}</style>
      <div className="rh-check-wrap rh-glow w-24 h-24 rounded-full flex items-center justify-center bg-emerald-50">
        <svg width="88" height="88" viewBox="0 0 100 100" fill="none">
          <circle
            className="rh-check-circle"
            cx="50" cy="50" r="45"
            stroke="#10b981"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <polyline
            className="rh-check-path"
            points="27,52 43,68 74,34"
            stroke="#10b981"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
}

/* ─── Step Indicator ─────────────────────────────────────── */
function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-1">
      {STEPS.map((s, i) => {
        const num = i + 1;
        const done = currentStep > num;
        const active = currentStep === num;
        return (
          <div key={i} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                active
                  ? "bg-white text-emerald-700 shadow-md"
                  : done
                  ? "bg-white/25 text-white"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {done ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    active ? "bg-emerald-500 text-white" : "bg-white/20 text-white/60"
                  }`}
                >
                  {num}
                </span>
              )}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px w-5 mx-0.5 transition-all duration-500 ${
                  currentStep > num ? "bg-white/60" : "bg-white/15"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Progress Dots ──────────────────────────────────────── */
function ProgressDots({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`h-2 rounded-full transition-all duration-400 ${
            step === s
              ? "w-6 bg-emerald-500"
              : step > s
              ? "w-2 bg-emerald-300"
              : "w-2 bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

/* ─── Field Label ────────────────────────────────────────── */
function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <p className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
      {children}
      {required && <span className="text-rose-500">*</span>}
    </p>
  );
}

/* ─── Input ──────────────────────────────────────────────── */
const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-sm transition-all placeholder:text-gray-400";

/* ═══════════════════════════════════════════════════════════
   MAIN MODAL
═══════════════════════════════════════════════════════════ */
interface AddPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPartnerModal({ isOpen, onClose }: AddPartnerModalProps) {
  const { partners, addPartner } = useB2B();

  /* ── UI State ── */
  const [step, setStep] = useState(1);

  /* ── Step 1: Company ── */
  const [name, setName] = useState("");
  const [type, setType] = useState<PartnerType>("Factory");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<"Active" | "Negotiating">("Active");

  /* ── Step 2: Contact ── */
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [monthlyCapacity, setMonthlyCapacity] = useState<number | "">("");
  const [plasticTypes, setPlasticTypes] = useState<PlasticType[]>([]);
  const [description, setDescription] = useState("");

  /* ── Step 3: Contract ── */
  const [contractValue, setContractValue] = useState<number | "">("");
  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);

  /* ── Step 4: Success snapshot ── */
  const [savedCode, setSavedCode] = useState("");
  const [savedColor, setSavedColor] = useState("");
  const [savedName, setSavedName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Derived ── */
  const partnerCode = name.trim() ? generatePartnerCode(name, partners.length) : "";
  const capacityInsight = getCapacityInsight(monthlyCapacity);

  /* ── Validation ── */
  const step1Valid = name.trim().length >= 2 && location.trim().length >= 2;
  const step2Valid =
    contact.trim().length >= 2 &&
    email.includes("@") &&
    phone.trim().length >= 6 &&
    plasticTypes.length > 0;
  const step3Valid = !!contractValue && Number(contractValue) > 0;

  /* ── Reset ── */
  const resetForm = useCallback(() => {
    setStep(1);
    setName(""); setType("Factory"); setLocation(""); setStatus("Active");
    setContact(""); setEmail(""); setPhone(""); setMonthlyCapacity("");
    setPlasticTypes([]); setDescription("");
    setContractValue(""); setRating(4); setHoverRating(0);
    setContractFile(null); setIsScanning(false); setScanDone(false);
    setSavedCode(""); setSavedColor(""); setSavedName("");
  }, []);

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(resetForm, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, resetForm]);

  /* ── File Handler ── */
  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setContractFile(file);
    setScanDone(false);
    setIsScanning(true);
    setTimeout(() => { setIsScanning(false); setScanDone(true); }, 1500);
  }, []);

  /* ── Submit ── */
  const handleSubmit = () => {
    const avatarColor = AVATAR_COLORS[partners.length % AVATAR_COLORS.length];
    const code = partnerCode;
    const finalName = name.trim();

    setSavedCode(code);
    setSavedColor(avatarColor);
    setSavedName(finalName);

    const newPartner: Omit<B2BPartnerExtended, "id"> = {
      name: finalName,
      type,
      contact: contact.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      tonsContributed: 0,
      activeSince: new Date().toISOString().slice(0, 7),
      status,
      contractValueUSD: Number(contractValue),
      plasticTypes,
      avatarColor,
      initials: getInitials(finalName),
      monthlyCapacity: Number(monthlyCapacity) || 5,
      rating,
      description:
        description.trim() ||
        `${type} partner specializing in ${plasticTypes.join(", ")} plastic streams.`,
    };

    addPartner(newPartner);
    setStep(4);
  };

  if (!isOpen) return null;

  const isSuccess = step === 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!isSuccess ? onClose : undefined}
      />

      {/* Modal Shell */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">

        {/* ── HEADER (steps 1-3) ── */}
        {!isSuccess && (
          <div className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-8 pt-6 pb-7 flex-shrink-0">
            {/* decorative circles */}
            <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute right-10 bottom-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/3 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-5">
                <StepIndicator currentStep={step} />
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h2 className="font-bold text-white text-xl tracking-tight">
                  {step === 1 && "Company Identity"}
                  {step === 2 && "Contact & Capacity"}
                  {step === 3 && "Contract & Documents"}
                </h2>
                <p className="text-white/65 text-sm mt-0.5">
                  {step === 1 && "Set up the partner's core profile and generate their unique ID"}
                  {step === 2 && "Define the contact person, quota, and accepted plastic streams"}
                  {step === 3 && "Finalize contract terms, set rating, and upload documents"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── BODY ── */}
        <div className={`${!isSuccess ? "px-8 py-6 overflow-y-auto" : ""}`} style={{ maxHeight: isSuccess ? undefined : "62vh" }}>

          {/* ════ STEP 1 ════ */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Company Name */}
              <div>
                <Label required>Company Name</Label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. EcoFactory Cairo"
                  className={inputCls}
                  autoFocus
                />
              </div>

              {/* Auto-generated Partner Code */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  partnerCode ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="mb-1">
                  <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-emerald-500" />
                    Auto-generated Partner ID
                  </p>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                  <span className="font-mono font-bold text-emerald-700 text-sm tracking-[0.18em]">
                    {partnerCode}
                  </span>
                  <span className="ml-auto text-[10px] font-semibold text-emerald-500 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Read Only
                  </span>
                </div>
              </div>

              {/* Partner Type */}
              <div>
                <Label required>Partner Type</Label>
                <div className="grid grid-cols-3 gap-3">
                  {(["Factory", "Recycler", "Manufacturer"] as PartnerType[]).map((t) => {
                    const icons = { Factory: Factory, Recycler: Recycle, Manufacturer: Building2 };
                    const Icon = icons[t];
                    const gradients = {
                      Factory: "from-emerald-500 to-teal-600",
                      Recycler: "from-blue-500 to-cyan-600",
                      Manufacturer: "from-violet-500 to-purple-600",
                    };
                    const selected = type === t;
                    return (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all duration-200 ${
                          selected
                            ? `border-transparent bg-gradient-to-br ${gradients[t]} text-white shadow-lg shadow-emerald-100`
                            : "border-gray-200 hover:border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-semibold">{t}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location */}
              <div>
                <Label required>
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  Location
                </Label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Industrial Zone A, Cairo"
                  className={inputCls}
                />
              </div>

              {/* Status Toggle */}
              <div>
                <Label>Initial Status</Label>
                <div className="flex gap-3">
                  {(["Active", "Negotiating"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                        status === s
                          ? s === "Active"
                            ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-100"
                            : "border-amber-400 bg-amber-400 text-white shadow-md shadow-amber-100"
                          : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {s === "Active" ? "🟢 Active" : "🟡 Negotiating"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════ STEP 2 ════ */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Contact + Phone row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label required>
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    Contact Person
                  </Label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Dr. John Smith"
                    className={inputCls}
                    autoFocus
                  />
                </div>
                <div>
                  <Label required>
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    Phone
                  </Label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+20 2 1234 5678"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label required>
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  Email Address
                </Label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className={inputCls}
                />
              </div>

              {/* Monthly Quota + Capacity Badge */}
              <div>
                <Label>
                  <Package className="w-3.5 h-3.5 text-gray-400" />
                  Monthly Quota (tons)
                </Label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={monthlyCapacity}
                    onChange={(e) =>
                      setMonthlyCapacity(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder="e.g. 10"
                    className={`${inputCls} flex-1`}
                  />
                  {capacityInsight && (
                    <div
                      className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border whitespace-nowrap transition-all ${capacityInsight.cls}`}
                    >
                      <span>{capacityInsight.emoji}</span>
                      {capacityInsight.label}
                    </div>
                  )}
                  {!capacityInsight && (
                    <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100 whitespace-nowrap">
                      💡 Enter quota for insights
                    </div>
                  )}
                </div>
              </div>

              {/* Plastic Types */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Accepted Plastic Types <span className="text-rose-500">*</span>
                  </p>
                  {plasticTypes.length > 0 && (
                    <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">
                      {plasticTypes.length} selected
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {PLASTIC_TYPES.map((pt) => {
                    const selected = plasticTypes.includes(pt);
                    return (
                      <button
                        key={pt}
                        onClick={() =>
                          setPlasticTypes((prev) =>
                            prev.includes(pt) ? prev.filter((p) => p !== pt) : [...prev, pt]
                          )
                        }
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all duration-200 ${
                          selected
                            ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
                            : "border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600"
                        }`}
                      >
                        {pt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label>Partner Description</Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the partner's operations and specializations…"
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
          )}

          {/* ════ STEP 3 ════ */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Contract Value */}
              <div>
                <Label required>
                  <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                  Contract Value (USD)
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm pointer-events-none">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={contractValue}
                    onChange={(e) =>
                      setContractValue(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder="150000"
                    className={`${inputCls} pl-8`}
                    autoFocus
                  />
                </div>
                {contractValue && Number(contractValue) > 0 && (
                  <p className="text-xs text-emerald-600 mt-1.5 ml-1 font-medium">
                    ≈ ${(Number(contractValue) / 1000).toFixed(0)}K total contract value
                  </p>
                )}
              </div>

              {/* Star Rating */}
              <div>
                <Label>
                  <Star className="w-3.5 h-3.5 text-gray-400" />
                  Initial Rating
                </Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((r) => {
                    const filled = r <= (hoverRating || rating);
                    return (
                      <button
                        key={r}
                        onMouseEnter={() => setHoverRating(r)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(r)}
                        className="transition-transform hover:scale-125 active:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            filled ? "fill-amber-400 text-amber-400" : "text-gray-200"
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-sm text-gray-500 ml-1">
                    {(hoverRating || rating).toFixed(1)} / 5.0
                  </span>
                </div>
              </div>

              {/* Document Upload */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-sm font-semibold text-gray-700">Contract Document</p>
                  <span className="text-xs text-gray-400 font-normal">(PDF · Optional)</span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFile}
                  className="hidden"
                />

                {!contractFile ? (
                  /* Drop Zone */
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                      <Upload className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-600 group-hover:text-emerald-600 transition-colors">
                        Click to upload PDF
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Contracts, NDAs, or partnership agreements
                      </p>
                    </div>
                  </button>
                ) : (
                  /* File Preview */
                  <div className="rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center gap-4 p-4 bg-gray-50">
                      {/* PDF Icon miniature */}
                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-14 bg-gradient-to-b from-rose-500 to-red-600 rounded-lg shadow-md flex flex-col items-end justify-start pt-1 pr-1 overflow-hidden">
                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/10 flex items-center justify-center">
                            <span className="text-white font-bold text-[10px] tracking-wider">PDF</span>
                          </div>
                          <div className="w-3 h-3 bg-white/30 rounded-sm" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                          <CheckCircle className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {contractFile.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatBytes(contractFile.size)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setContractFile(null);
                          setScanDone(false);
                          setIsScanning(false);
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Scanning state */}
                    {isScanning && (
                      <div className="px-4 py-3 bg-amber-50 border-t border-amber-100 flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-amber-700">
                            Scanning for viruses…
                          </p>
                          <div className="mt-1.5 h-1 bg-amber-200 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full animate-pulse" style={{ width: "60%" }} />
                          </div>
                        </div>
                        <Shield className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
                      </div>
                    )}

                    {/* Scan complete */}
                    {scanDone && (
                      <div className="px-4 py-3 bg-emerald-50 border-t border-emerald-100 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-emerald-700">
                            File verified — No threats detected
                          </p>
                          <p className="text-xs text-emerald-500 mt-0.5">
                            Document is clean and ready for upload
                          </p>
                        </div>
                        <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Security note */}
              <div className="flex items-start gap-2.5 p-3.5 bg-teal-50 rounded-xl border border-teal-100">
                <Shield className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-teal-600 leading-relaxed">
                  All documents are encrypted with AES-256 and stored securely. Only authorized
                  admin users can access contract files.
                </p>
              </div>
            </div>
          )}

          {/* ════ STEP 4 — SUCCESS ════ */}
          {step === 4 && (
            <div className="relative flex flex-col items-center justify-center py-12 px-8 text-center overflow-hidden">
              <Confetti active />

              {/* Close X */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors z-30"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Animated Checkmark */}
              <div className="relative z-10">
                <AnimatedCheck />
              </div>

              <div className="relative z-10 mt-5">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-2xl font-bold text-gray-800">Contract Signed!</h2>
                  <Sparkles className="w-5 h-5 text-teal-500" />
                </div>
                <p className="text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  <span className="font-semibold text-emerald-600">{savedName}</span> has been
                  successfully onboarded as a RecycleHub B2B Partner.
                </p>
              </div>

              {/* Summary Card */}
              <div className="relative z-10 mt-6 w-full bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-11 h-11 ${savedColor} rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-md`}
                  >
                    {getInitials(savedName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate">{savedName}</p>
                    <p className="text-xs text-gray-500">
                      {type} · {status}
                    </p>
                  </div>
                  <div className="font-mono text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1.5 rounded-lg tracking-wide">
                    {savedCode}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Contract", value: `$${(Number(contractValue) / 1000).toFixed(0)}K` },
                    { label: "Capacity", value: `${monthlyCapacity || 5}t/mo` },
                    { label: "Plastics", value: `${plasticTypes.length} types` },
                    { label: "Rating", value: `${rating}.0 ★` },
                  ].map((item) => (
                    <div key={item.label} className="text-center bg-white/70 rounded-xl py-2.5 px-1">
                      <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                      <p className="font-bold text-gray-800 text-sm">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="relative z-10 flex gap-3 mt-5 w-full">
                <button
                  onClick={resetForm}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  + Add Another
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  View Partners
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER (steps 1-3) ── */}
        {!isSuccess && (
          <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between flex-shrink-0 bg-white">
            <button
              onClick={step > 1 ? () => setStep((s) => s - 1) : onClose}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {step > 1 ? "Back" : "Cancel"}
            </button>

            <ProgressDots step={step} />

            {step < 3 ? (
              <button
                disabled={step === 1 ? !step1Valid : !step2Valid}
                onClick={() => setStep((s) => s + 1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                disabled={!step3Valid}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                <Zap className="w-4 h-4" />
                Finalize Contract
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
