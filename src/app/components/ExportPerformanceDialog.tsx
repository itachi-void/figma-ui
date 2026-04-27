import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  FileText,
  FileSpreadsheet,
  Download,
  Calendar,
  CheckSquare,
  Loader2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useSidebar } from "../contexts/SidebarContext";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportPerformanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
}

const columns = [
  { id: "name", label: "Name" },
  { id: "id", label: "ID" },
  { id: "status", label: "Status" },
  { id: "completedTrips", label: "Completed Trips" },
  { id: "earnings", label: "Earnings" },
  { id: "rating", label: "Rating" },
  { id: "onTimePercentage", label: "On-Time %" },
  { id: "fuelEfficiency", label: "Fuel Efficiency" },
  { id: "currentRoute", label: "Current Route" },
  { id: "vehicleNumber", label: "Vehicle" },
];

export function ExportPerformanceDialog({
  isOpen,
  onClose,
  data,
}: ExportPerformanceDialogProps) {
  const { sidebarOpen } = useSidebar();
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "excel" | "csv">("excel");
  const [fileName, setFileName] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns.map((col) => col.id)
  );
  const [dateRange, setDateRange] = useState<"all" | "week" | "month" | "custom">("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [exportFiltered, setExportFiltered] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Set default filename
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split("T")[0];
      setFileName(`Performance_Report_${today}`);
    }
  }, [isOpen]);

  // Toggle column selection
  const toggleColumn = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  // Select/Deselect all columns
  const toggleAllColumns = () => {
    if (selectedColumns.length === columns.length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(columns.map((col) => col.id));
    }
  };

  // Filter data by date range
  const getFilteredData = () => {
    let filtered = [...data];

    if (dateRange === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter((item) => new Date(item.joinDate) >= weekAgo);
    } else if (dateRange === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter((item) => new Date(item.joinDate) >= monthAgo);
    } else if (dateRange === "custom" && customStartDate && customEndDate) {
      filtered = filtered.filter(
        (item) =>
          new Date(item.joinDate) >= new Date(customStartDate) &&
          new Date(item.joinDate) <= new Date(customEndDate)
      );
    }

    return filtered;
  };

  // Prepare export data
  const prepareExportData = () => {
    const filtered = getFilteredData();
    return filtered.map((item) => {
      const row: any = {};
      selectedColumns.forEach((colId) => {
        const column = columns.find((col) => col.id === colId);
        if (column) {
          row[column.label] = item[colId];
        }
      });
      return row;
    });
  };

  // Export as Excel
  const exportAsExcel = () => {
    const exportData = prepareExportData();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Performance");

    // Style header
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
    for (let col = range.s.c; col <= range.e.c; col++) {
      const address = XLSX.utils.encode_col(col) + "1";
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "4CAF50" } },
      };
    }

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  // Export as CSV
  const exportAsCSV = () => {
    const exportData = prepareExportData();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();
  };

  // Export as PDF
  const exportAsPDF = () => {
    const doc = new jsPDF();
    const exportData = prepareExportData();

    // Title
    doc.setFontSize(18);
    doc.text("Performance Report", 14, 20);

    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

    // Table
    const headers = selectedColumns.map((colId) => {
      const col = columns.find((c) => c.id === colId);
      return col?.label || colId;
    });

    const rows = exportData.map((item) => Object.values(item));

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 35,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [76, 175, 80], textColor: 255 },
    });

    doc.save(`${fileName}.pdf`);
  };

  // Handle export
  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      toast.error("Please select at least one column");
      return;
    }

    setIsExporting(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      if (selectedFormat === "excel") {
        exportAsExcel();
      } else if (selectedFormat === "csv") {
        exportAsCSV();
      } else if (selectedFormat === "pdf") {
        exportAsPDF();
      }

      setIsExporting(false);
      setExportSuccess(true);

      toast.success("Export completed successfully!", {
        action: {
          label: "View",
          onClick: () => {},
        },
      });

      setTimeout(() => {
        onClose();
        setExportSuccess(false);
      }, 1500);
    } catch (error) {
      setIsExporting(false);
      toast.error("Export failed. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed bg-black/60 backdrop-blur-sm transition-all duration-300"
            style={{
              top: 0,
              bottom: 0,
              left: sidebarOpen ? "256px" : "0",
              right: 0,
              zIndex: 99,
            }}
          />

          {/* Dialog */}
          <div
            className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none transition-all duration-300"
            style={{
              zIndex: 100,
              left: sidebarOpen ? "256px" : "0",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden pointer-events-auto max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Download className="w-6 h-6 text-emerald-600" />
                      Export Performance Data
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Customize and download your report
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/80 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* File Format Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Export Format
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "pdf", label: "PDF", icon: FileText, desc: "For printing" },
                      { id: "excel", label: "Excel", icon: FileSpreadsheet, desc: "For analysis" },
                      { id: "csv", label: "CSV", icon: FileSpreadsheet, desc: "For import" },
                    ].map((format) => (
                      <motion.button
                        key={format.id}
                        onClick={() => setSelectedFormat(format.id as any)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedFormat === format.id
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <format.icon
                          className={`w-6 h-6 mx-auto mb-2 ${
                            selectedFormat === format.id
                              ? "text-emerald-600"
                              : "text-gray-400"
                          }`}
                        />
                        <div className="text-sm font-semibold text-gray-900">
                          {format.label}
                        </div>
                        <div className="text-xs text-gray-500">{format.desc}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* File Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    File Name
                  </label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    placeholder="Enter filename"
                  />
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date Range
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                      { id: "all", label: "All Time" },
                      { id: "week", label: "Last 7 Days" },
                      { id: "month", label: "Last 30 Days" },
                      { id: "custom", label: "Custom" },
                    ].map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setDateRange(range.id as any)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          dateRange === range.id
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>

                  {dateRange === "custom" && (
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                      />
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}
                </div>

                {/* Column Selection */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-bold text-gray-900">
                      <CheckSquare className="w-4 h-4 inline mr-2" />
                      Select Columns
                    </label>
                    <button
                      onClick={toggleAllColumns}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      {selectedColumns.length === columns.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-gray-50 rounded-xl">
                    {columns.map((column) => (
                      <label
                        key={column.id}
                        className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedColumns.includes(column.id)}
                          onChange={() => toggleColumn(column.id)}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">{column.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Export Options */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportFiltered}
                      onChange={(e) => setExportFiltered(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">
                      Export filtered data only (based on current filters)
                    </span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isExporting}
                  className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting || exportSuccess || selectedColumns.length === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Exporting...
                    </>
                  ) : exportSuccess ? (
                    <>
                      <Check className="w-5 h-5" />
                      Exported!
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Export {selectedFormat.toUpperCase()}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
