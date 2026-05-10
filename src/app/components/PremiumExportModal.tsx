"use client";

import {
  X,
  Download,
  FileText,
  Leaf,
  Award,
  Package,
  CheckCircle,
  TrendingUp,
  Loader2,
  Eye,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePickup } from "@/app/contexts/PickupContext";

interface PremiumExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SummaryData {
  totalCompletedPickups: number;
  totalKgCollected: number;
  co2SavedKg: number;
  totalPointsIssued: number;
  topZone: string;
}

function computeSummary(requests: ReturnType<typeof usePickup>["requests"]): SummaryData {
  const completed = requests.filter((r) => r.status === "Completed");
  const totalKg = completed.reduce(
    (s, r) => s + r.items.reduce((a, i) => a + i.expectedWeightKg, 0),
    0
  );
  const co2 = totalKg * 0.82;
  const points = completed.reduce((s, r) => s + (r.pointsAwarded ?? 0), 0);

  const zoneCount: Record<string, number> = {};
  completed.forEach((r) => {
    zoneCount[r.zone.name] = (zoneCount[r.zone.name] ?? 0) + 1;
  });
  const topZone =
    Object.entries(zoneCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

  return {
    totalCompletedPickups: completed.length,
    totalKgCollected: totalKg,
    co2SavedKg: parseFloat(co2.toFixed(2)),
    totalPointsIssued: points,
    topZone,
  };
}

/* ── Canvas PDF Thumbnail ── */
function PdfThumbnail({ summary }: { summary: SummaryData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const scale = W / 210; // A4 mm → px

    /* Background */
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, W, H);

    /* Page shadow */
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0,0,0,0.12)";
    ctx.shadowBlur = 8;
    ctx.fillRect(4, 4, W - 8, H - 8);
    ctx.shadowBlur = 0;

    /* Header banner – emerald */
    const hh = 38 * scale;
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, "#10b981");
    grad.addColorStop(0.6, "#14b8a6");
    grad.addColorStop(1, "#06b6d4");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, hh);

    /* Right accent strip */
    ctx.fillStyle = "#0891b2";
    ctx.fillRect(W - 6 * scale, 0, 6 * scale, hh);

    /* Logo text */
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${11 * scale}px sans-serif`;
    ctx.fillText("RecycleHub", 8 * scale, 13 * scale);
    ctx.font = `${6 * scale}px sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText("Executive Analytics Report", 8 * scale, 22 * scale);
    ctx.fillText(`Generated: ${new Date().toLocaleDateString("en-GB")}`, 8 * scale, 30 * scale);

    /* Section title */
    ctx.fillStyle = "#0f172a";
    ctx.font = `bold ${7 * scale}px sans-serif`;
    ctx.fillText("Executive Summary", 8 * scale, 50 * scale);

    /* KPI boxes */
    const kpis = [
      { label: "Pickups", value: String(summary.totalCompletedPickups), color: "#10b981" },
      { label: "kg Collected", value: `${summary.totalKgCollected.toFixed(0)}kg`, color: "#3b82f6" },
      { label: "CO₂ Saved", value: `${summary.co2SavedKg}kg`, color: "#14b8a6" },
      { label: "Points", value: summary.totalPointsIssued.toLocaleString(), color: "#f59e0b" },
    ];
    const boxW = ((W - 16 * scale - 9 * scale) / 2);
    const boxH = 14 * scale;
    kpis.forEach((kpi, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 8 * scale + col * (boxW + 4.5 * scale);
      const y = 55 * scale + row * (boxH + 3 * scale);

      ctx.fillStyle = kpi.color;
      ctx.beginPath();
      ctx.roundRect(x, y, boxW, boxH, 3 * scale);
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.font = `${4.5 * scale}px sans-serif`;
      ctx.fillText(kpi.label, x + 3 * scale, y + 5.5 * scale);
      ctx.font = `bold ${6.5 * scale}px sans-serif`;
      ctx.fillText(kpi.value, x + 3 * scale, y + 11 * scale);
    });

    /* Environmental section */
    const envY = 94 * scale;
    ctx.fillStyle = "#0f172a";
    ctx.font = `bold ${6 * scale}px sans-serif`;
    ctx.fillText("Environmental Impact", 8 * scale, envY);

    const impactLines = [
      `• Plastic diverted: ${summary.totalKgCollected.toFixed(0)} kg`,
      `• CO₂ prevented: ${summary.co2SavedKg} kg CO₂-eq`,
      `• ~${Math.round(summary.co2SavedKg / 21.7)} trees equivalent`,
      `• Top zone: ${summary.topZone}`,
    ];
    ctx.fillStyle = "#475569";
    ctx.font = `${4.5 * scale}px sans-serif`;
    impactLines.forEach((line, i) => {
      ctx.fillText(line, 8 * scale, (envY + 7 * scale) + i * 6 * scale);
    });

    /* Table placeholder */
    const tableY = 126 * scale;
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.roundRect(8 * scale, tableY, W - 16 * scale, 7 * scale, 2 * scale);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${4 * scale}px sans-serif`;
    ctx.fillText("ID   Citizen   Zone   Plastic   Weight   Points   Driver", 12 * scale, tableY + 4.5 * scale);

    /* Table rows */
    for (let row = 0; row < 6; row++) {
      ctx.fillStyle = row % 2 === 0 ? "#f0fdf4" : "#ffffff";
      ctx.fillRect(8 * scale, (tableY + 7 * scale) + row * 7 * scale, W - 16 * scale, 7 * scale);

      ctx.fillStyle = "#64748b";
      ctx.font = `${3.5 * scale}px sans-serif`;
      ctx.fillText("—  —  —  —  —  —  —", 12 * scale, (tableY + 7 * scale) + row * 7 * scale + 4.5 * scale);
    }

    /* Footer */
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(0, H - 10 * scale, W, 10 * scale);
    ctx.fillStyle = "#94a3b8";
    ctx.font = `${3.5 * scale}px sans-serif`;
    ctx.fillText("RecycleHub · Confidential · Not for external distribution", 8 * scale, H - 3.5 * scale);
  }, [summary]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={210}
      height={297}
      className="w-full rounded-xl border border-gray-200 shadow-inner"
      style={{ imageRendering: "crisp-edges" }}
    />
  );
}

/* ── Processing State Messages ── */
const PROCESSING_STEPS = [
  "Initialising PDF engine...",
  "Compiling environmental metrics...",
  "Optimizing Environmental Impact Report...",
  "Rendering data tables...",
  "Finalising document layout...",
  "Almost there...",
];

export function PremiumExportModal({ isOpen, onClose }: PremiumExportModalProps) {
  const { requests } = usePickup();
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState(0);
  const [includePickupList, setIncludePickupList] = useState(true);
  const [includeEnvSection, setIncludeEnvSection] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const summary = computeSummary(requests);
  const completedPickups = requests.filter((r) => r.status === "Completed");

  useEffect(() => {
    if (isOpen) setTimeout(() => setIsVisible(true), 10);
    else {
      setIsVisible(false);
      setShowPreview(false);
    }
  }, [isOpen]);

  /* Animate processing step text while exporting */
  useEffect(() => {
    if (!isExporting) return;
    const id = setInterval(() => {
      setProcessingStep((p) =>
        p < PROCESSING_STEPS.length - 1 ? p + 1 : p
      );
    }, 600);
    return () => clearInterval(id);
  }, [isExporting]);

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(0);
    setProcessingStep(0);

    try {
      const { jsPDF } = await import("jspdf");
      setProgress(15);
      const autoTable = (await import("jspdf-autotable")).default;
      setProgress(30);

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();

      /* ── Header Banner ── */
      doc.setFillColor(16, 185, 129);
      doc.rect(0, 0, pageW, 38, "F");
      doc.setFillColor(20, 184, 166);
      doc.rect(pageW - 6, 0, 6, 38, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("RecycleHub", 14, 14);
      doc.setFontSize(11);
      doc.text("Executive Analytics Report", 14, 22);
      doc.setFontSize(9);
      doc.text(`Generated: ${new Date().toLocaleString("en-GB")}`, 14, 30);
      doc.text(`Total Pickups in System: ${requests.length}`, pageW - 55, 30);

      setProgress(45);

      /* ── Summary Section ── */
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(13);
      doc.text("Executive Summary", 14, 52);

      const kpis = [
        { label: "Completed Pickups", value: String(summary.totalCompletedPickups), color: [16, 185, 129] as [number, number, number] },
        { label: "Total kg Collected", value: `${summary.totalKgCollected.toFixed(1)} kg`, color: [59, 130, 246] as [number, number, number] },
        ...(includeEnvSection
          ? [
              { label: "CO₂ Saved (est.)", value: `${summary.co2SavedKg} kg`, color: [20, 184, 166] as [number, number, number] },
              { label: "Points Issued", value: summary.totalPointsIssued.toLocaleString(), color: [245, 158, 11] as [number, number, number] },
            ]
          : [
              { label: "Top Zone", value: summary.topZone, color: [139, 92, 246] as [number, number, number] },
              { label: "Avg kg / Pickup", value: summary.totalCompletedPickups > 0 ? `${(summary.totalKgCollected / summary.totalCompletedPickups).toFixed(1)} kg` : "—", color: [236, 72, 153] as [number, number, number] },
            ]),
      ];

      const boxW = (pageW - 28 - 9) / 2;
      kpis.forEach((kpi, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 14 + col * (boxW + 9);
        const y = 58 + row * 22;

        doc.setFillColor(...kpi.color);
        doc.roundedRect(x, y, boxW, 18, 3, 3, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text(kpi.label, x + 4, y + 6);
        doc.setFontSize(13);
        doc.text(kpi.value, x + 4, y + 14);
      });

      setProgress(65);

      /* ── Environmental Impact Section ── */
      if (includeEnvSection) {
        const envY = 108;
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(12);
        doc.text("Environmental Impact", 14, envY);

        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        const impactLines = [
          `• Plastic diverted from landfill: ${summary.totalKgCollected.toFixed(1)} kg`,
          `• Estimated CO₂ emissions prevented: ${summary.co2SavedKg} kg CO₂-eq`,
          `• Equivalent trees saved: ~${Math.round(summary.co2SavedKg / 21.7)} trees`,
          `• Points issued to citizens: ${summary.totalPointsIssued.toLocaleString()} pts`,
          `• Top performing zone: ${summary.topZone}`,
        ];
        impactLines.forEach((line, i) => {
          doc.text(line, 14, envY + 8 + i * 7);
        });
      }

      setProgress(75);

      /* ── Completed Pickups Table ── */
      if (includePickupList && completedPickups.length > 0) {
        autoTable(doc, {
          startY: includeEnvSection ? 154 : 112,
          head: [["ID", "Citizen", "Zone", "Plastic", "Weight (kg)", "Points", "Driver"]],
          body: completedPickups.map((r) => [
            r.id,
            r.citizen.name,
            r.zone.name,
            r.items.map((i) => i.plasticType).join(", "),
            r.items.reduce((s, i) => s + i.expectedWeightKg, 0).toFixed(1),
            r.pointsAwarded ?? 0,
            r.driver?.name ?? "—",
          ]),
          styles: {
            fontSize: 8,
            cellPadding: 3,
            lineColor: [226, 232, 240],
            lineWidth: 0.3,
          },
          headStyles: {
            fillColor: [16, 185, 129],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 8.5,
          },
          alternateRowStyles: { fillColor: [240, 253, 244] },
          columnStyles: {
            0: { fontStyle: "bold", textColor: [16, 185, 129] },
            5: { halign: "right" },
          },
          didDrawPage: (data: any) => {
            const pageCount = (doc as any).internal.getNumberOfPages();
            doc.setFontSize(7);
            doc.setTextColor(148, 163, 184);
            doc.text(
              `RecycleHub Executive Report · Page ${data.pageNumber} of ${pageCount}`,
              14,
              doc.internal.pageSize.getHeight() - 8
            );
          },
        });
      } else if (completedPickups.length === 0) {
        const tableY = includeEnvSection ? 154 : 112;
        doc.setFontSize(10);
        doc.setTextColor(148, 163, 184);
        doc.text("No completed pickups to display.", 14, tableY);
      }

      setProgress(90);

      /* ── Footer on last page ── */
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setPage(pageCount);
      const pgH = doc.internal.pageSize.getHeight();
      doc.setFillColor(241, 245, 249);
      doc.rect(0, pgH - 14, pageW, 14, "F");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text("RecycleHub · Confidential · Not for external distribution", 14, pgH - 5);
      doc.text(`© ${new Date().getFullYear()} RecycleHub Platform`, pageW - 14, pgH - 5, { align: "right" });

      setProgress(100);

      doc.save(`recyclehub-executive-report-${new Date().toISOString().slice(0, 10)}.pdf`);

      setTimeout(() => {
        setIsExporting(false);
        setProgress(0);
        setProcessingStep(0);
        onClose();
      }, 400);
    } catch (err) {
      console.error("PDF generation error:", err);
      setIsExporting(false);
      setProgress(0);
      setProcessingStep(0);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={!isExporting ? onClose : undefined}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden transition-all duration-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Executive Report</h2>
                <p className="text-white/70 text-sm">Premium PDF export with analytics</p>
              </div>
            </div>
            {!isExporting && (
              <button
                onClick={onClose}
                className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>

        <div className="flex">
          {/* Left column – controls */}
          <div className="flex-1 flex flex-col">
            {/* KPI Preview Strip */}
            <div className="p-5 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Report Preview</p>
                <button
                  onClick={() => setShowPreview((v) => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${showPreview ? "bg-emerald-100 text-emerald-700" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {showPreview ? "Hide" : "PDF"} Preview
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { icon: CheckCircle, label: "Completed Pickups", value: summary.totalCompletedPickups, color: "text-emerald-600", bg: "bg-emerald-50" },
                  { icon: Leaf, label: "CO₂ Saved (est.)", value: `${summary.co2SavedKg} kg`, color: "text-teal-600", bg: "bg-teal-50" },
                  { icon: Award, label: "Points Issued", value: summary.totalPointsIssued.toLocaleString(), color: "text-amber-600", bg: "bg-amber-50" },
                  { icon: Package, label: "kg Collected", value: `${summary.totalKgCollected.toFixed(1)} kg`, color: "text-blue-600", bg: "bg-blue-50" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`stagger-zoom flex items-center gap-2.5 p-2.5 rounded-xl ${item.bg}`}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <item.icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className={`font-bold text-sm ${item.color}`}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="p-5 space-y-3 flex-1">
              <p className="text-sm font-semibold text-gray-700 mb-2">Include in Report</p>

              {[
                {
                  id: "pickupList",
                  label: "Completed Pickups Table",
                  desc: `${completedPickups.length} entries with driver & zone data`,
                  icon: Package,
                  checked: includePickupList,
                  toggle: () => setIncludePickupList((v) => !v),
                },
                {
                  id: "envSection",
                  label: "Environmental Impact Section",
                  desc: "CO₂ savings, trees equivalent, points data",
                  icon: Leaf,
                  checked: includeEnvSection,
                  toggle: () => setIncludeEnvSection((v) => !v),
                },
              ].map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center">
                    <option.icon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{option.label}</p>
                    <p className="text-xs text-gray-500">{option.desc}</p>
                  </div>
                  <div
                    onClick={option.toggle}
                    className={`w-11 h-6 rounded-full transition-all duration-200 flex items-center px-0.5 cursor-pointer ${option.checked ? "bg-emerald-500" : "bg-gray-300"}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${option.checked ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                </label>
              ))}
            </div>

            {/* Processing state */}
            {isExporting && (
              <div className="px-5 pb-3">
                <div className="flex items-center gap-2.5 text-sm text-gray-700 mb-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500 flex-shrink-0" />
                  <span className="transition-all duration-300">{PROCESSING_STEPS[processingStep]}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5 text-right">{progress}% complete</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 p-5 pt-2 border-t border-gray-100">
              <button
                onClick={onClose}
                disabled={isExporting}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Building PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right column – PDF canvas thumbnail (toggleable) */}
          {showPreview && (
            <div className="w-48 flex-shrink-0 border-l border-gray-200 bg-gray-50 p-4 flex flex-col gap-2 stagger-in" style={{ animationDelay: "0ms" }}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">PDF Layout</p>
              <PdfThumbnail summary={summary} />
              <p className="text-xs text-gray-400 text-center">Live thumbnail</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
