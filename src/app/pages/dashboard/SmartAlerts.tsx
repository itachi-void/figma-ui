"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Trash2,
  Eye,
  MoreVertical,
  TrendingUp,
  Activity,
  Zap,
  X,
  Settings,
  Shield,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { ConfigureAlertsModal } from "../../components/ConfigureAlertsModal";
import { useAlertsMonitor } from "../../hooks/useAlertsMonitor";
import { useAlertsConfig } from "../../contexts/AlertsConfigContext";

// Alert Type
type AlertType = "critical" | "warning" | "info" | "success";

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  time: string;
  location: string;
  status: "active" | "resolved" | "pending";
  priority: "high" | "medium" | "low";
  fromGuard?: boolean;
}

// Mock Data
const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "Center Capacity Critical",
    description:
      "Downtown Center has reached 95% capacity. Immediate action required.",
    time: "5 minutes ago",
    location: "Downtown Center",
    status: "active",
    priority: "high",
  },
  {
    id: "2",
    type: "warning",
    title: "Route Delay Detected",
    description:
      "Route A-5 is experiencing 30 minute delay due to traffic.",
    time: "15 minutes ago",
    location: "Route A-5",
    status: "active",
    priority: "medium",
  },
  {
    id: "3",
    type: "info",
    title: "New Driver Assigned",
    description: "John Smith has been assigned to Route B-3.",
    time: "1 hour ago",
    location: "Route B-3",
    status: "resolved",
    priority: "low",
  },
  {
    id: "4",
    type: "success",
    title: "Collection Completed",
    description:
      "North Center collection completed successfully - 850 bottles.",
    time: "2 hours ago",
    location: "North Center",
    status: "resolved",
    priority: "low",
  },
  {
    id: "5",
    type: "warning",
    title: "Maintenance Required",
    description:
      "Vehicle #12 requires scheduled maintenance check.",
    time: "3 hours ago",
    location: "Vehicle Fleet",
    status: "pending",
    priority: "medium",
  },
  {
    id: "6",
    type: "info",
    title: "System Update Available",
    description:
      "New software update available for all collection devices.",
    time: "5 hours ago",
    location: "System",
    status: "pending",
    priority: "low",
  },
];

// Alert Stats
function AlertStats({ alerts }: { alerts: Alert[] }) {
  const active = alerts.filter((a) => a.status === "active").length;
  const critical = alerts.filter((a) => a.type === "critical").length;
  const warnings = alerts.filter((a) => a.type === "warning").length;
  const resolved = alerts.filter((a) => a.status === "resolved").length;

  const stats = [
    {
      label: "Active Alerts",
      value: active,
      change: `${active}`,
      icon: Activity,
      color: "from-red-500 to-orange-500",
      textColor: "text-red-600",
    },
    {
      label: "Critical",
      value: critical,
      change: `${critical}`,
      icon: AlertTriangle,
      color: "from-orange-500 to-amber-500",
      textColor: "text-orange-600",
    },
    {
      label: "Warnings",
      value: warnings,
      change: `${warnings}`,
      icon: AlertCircle,
      color: "from-amber-500 to-yellow-500",
      textColor: "text-amber-600",
    },
    {
      label: "Resolved",
      value: resolved,
      change: `${resolved}`,
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-500",
      textColor: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: index * 0.1, type: "spring" }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="bg-white rounded-2xl p-6 shadow-lg relative overflow-hidden group cursor-pointer"
        >
          {/* Gradient Background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}
          />

          <div className="flex items-center justify-between mb-4">
            <motion.div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg relative overflow-hidden`}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <stat.icon className="w-6 h-6 text-white relative z-10" />
            </motion.div>

            <motion.div
              className={`px-3 py-1 rounded-full bg-gradient-to-r ${stat.color} text-white text-xs font-semibold`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {stat.change}
            </motion.div>
          </div>

          <p className="text-sm text-gray-600 mb-1">
            {stat.label}
          </p>
          <p className={`text-3xl font-bold ${stat.textColor}`}>
            {stat.value}
          </p>

          {/* Progress Bar */}
          <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${stat.color}`}
              initial={{ width: 0 }}
              animate={{ width: "70%" }}
              transition={{
                delay: index * 0.1 + 0.3,
                duration: 1,
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Alert Card Component
function AlertCard({
  alert,
  index,
  onResolve,
  onDelete,
}: {
  alert: Alert;
  index: number;
  onResolve: () => void;
  onDelete: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  const menuItems = [
    {
      icon: Eye,
      label: "View Details",
      onClick: () => {
        window.alert(
          `${alert.title}\n\n${alert.description}\n\nLocation: ${alert.location}\nStatus: ${alert.status}\nPriority: ${alert.priority}\nTime: ${alert.time}`
        );
        setShowMenu(false);
      },
    },
    {
      icon: CheckCircle,
      label: "Mark as Resolved",
      onClick: () => {
        onResolve();
        setShowMenu(false);
      },
    },
    {
      icon: Trash2,
      label: "Delete",
      danger: true,
      onClick: () => {
        onDelete();
        setShowMenu(false);
      },
    },
  ];

  const typeConfig = {
    critical: {
      icon: AlertTriangle,
      gradient: "from-red-500 to-orange-500",
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-600",
    },
    warning: {
      icon: AlertCircle,
      gradient: "from-orange-500 to-amber-500",
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-600",
    },
    info: {
      icon: Info,
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
    },
    success: {
      icon: CheckCircle,
      gradient: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-600",
    },
  };

  const config = typeConfig[alert.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: index * 0.05, type: "spring" }}
      whileHover={{ scale: 1.01, x: 5 }}
      className={`bg-white rounded-2xl p-6 shadow-lg border-2 ${config.border} relative overflow-hidden group cursor-pointer`}
    >
      {/* Smart Guard source indicator */}
      {alert.fromGuard && (
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 z-20">
          <Shield className="w-2.5 h-2.5 text-emerald-600" />
          <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">Smart Guard</span>
        </div>
      )}

      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
      />

      <div className="flex items-start gap-4 relative z-10">
        {/* Icon */}
        <motion.div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden`}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <Icon className="w-7 h-7 text-white relative z-10" />
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {alert.title}
                </h3>
                <motion.span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {alert.priority.toUpperCase()}
                </motion.span>
              </div>
              <p className="text-sm text-gray-600">
                {alert.description}
              </p>
            </div>

            {/* Menu */}
            <div className="relative">
              <motion.button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </motion.button>

              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20"
                >
                  {menuItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={item.onClick}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 ${
                        item.danger
                          ? "text-red-600"
                          : "text-gray-700"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{alert.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              <span>{alert.location}</span>
            </div>
            <motion.div
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                alert.status === "active"
                  ? "bg-red-100 text-red-600"
                  : alert.status === "resolved"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-amber-100 text-amber-600"
              }`}
              animate={
                alert.status === "active"
                  ? { scale: [1, 1.05, 1] }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            >
              {alert.status.toUpperCase()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Pulsing Indicator for Active Alerts */}
      {alert.status === "active" && (
        <motion.div
          className={`absolute top-4 right-4 w-3 h-3 rounded-full bg-gradient-to-br ${config.gradient}`}
          animate={{
            scale: [1, 1.5, 1],
            boxShadow: [
              "0 0 0 0 rgba(239, 68, 68, 0.4)",
              "0 0 0 10px rgba(239, 68, 68, 0)",
              "0 0 0 0 rgba(239, 68, 68, 0)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
    </motion.div>
  );
}

export default function SmartAlerts() {
  const [filter, setFilter] = useState<
    "all" | AlertType | "active" | "resolved"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [configModalOpen, setConfigModalOpen] = useState(false);

  // ── Smart Guard: live monitoring ──
  const { guardAlerts } = useAlertsMonitor();
  const { config: alertsConfig } = useAlertsConfig();

  // Merge guard alerts into the local list when they arrive
  useEffect(() => {
    if (guardAlerts.length === 0) return;
    setAlerts((prev) => {
      const existingIds = new Set(prev.map((a) => a.id));
      const fresh = guardAlerts
        .filter((ga) => !existingIds.has(ga.id))
        .map((ga) => ({ ...ga, fromGuard: true } as Alert));
      return fresh.length ? [...fresh, ...prev] : prev;
    });
  }, [guardAlerts]);

  const handleResolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "resolved" } : a))
    );
  };
  const handleDeleteAlert = (id: string) => {
    if (window.confirm("Delete this alert?")) {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const filteredAlerts = useMemo(
    () =>
      alerts.filter((alert) => {
        const matchesFilter =
          filter === "all" ||
          alert.type === filter ||
          alert.status === filter;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          alert.title.toLowerCase().includes(q) ||
          alert.description.toLowerCase().includes(q);
        return matchesFilter && matchesSearch;
      }),
    [alerts, filter, searchQuery]
  );

  const activeGuardCount = guardAlerts.filter(
    (ga) => !alerts.find((a) => a.id === ga.id && a.status === "resolved")
  ).length;

  return (
    <div className="space-y-8 relative">
      {/* CSS for guard badge glow */}
      <style>{`
        @keyframes guardGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
          50%       { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
        }
        .guard-badge-glow { animation: guardGlow 2s ease-in-out infinite; }
      `}</style>

      {/* Floating Orbs Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl opacity-10"
            style={{
              width: 300,
              height: 300,
              background: `linear-gradient(45deg, ${["#EF4444", "#F59E0B", "#10B981"][i]}, transparent)`,
              left: `${20 + i * 30}%`,
              top: `${10 + i * 25}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Smart Alerts
          </motion.h1>
          <motion.p
            className="text-gray-600 mt-2"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Monitor and manage system alerts in real-time
          </motion.p>
        </div>

        {/* Right side: Guard badge + Configure button */}
        <motion.div
          className="flex items-center gap-3 flex-wrap"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          {/* ── Smart Guard Active Badge ── */}
          <div className="relative group">
            <div
              className="guard-badge-glow flex items-center gap-2 pl-3 pr-4 py-2 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 cursor-default select-none"
            >
              {/* Ping dot */}
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <Shield className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="text-xs font-bold text-emerald-700 whitespace-nowrap">
                Smart Guard: Active
              </span>
              {activeGuardCount > 0 && (
                <span className="ml-1 bg-emerald-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">
                  {activeGuardCount}
                </span>
              )}
            </div>

            {/* Tooltip */}
            <div
              className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-30
                         opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            >
              <div className="bg-gray-900 text-white text-xs rounded-xl px-3 py-2.5 whitespace-nowrap shadow-xl">
                <div className="flex items-center gap-1.5 mb-1">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span className="font-bold text-emerald-400">
                    Shielding at {alertsConfig.matchThreshold}% AI Precision
                  </span>
                </div>
                <div className="text-gray-400 text-[11px] space-y-0.5">
                  <div>⏰ Delayed Pickup: {alertsConfig.delayedPickupAlert ? "ON" : "OFF"}</div>
                  <div>🏭 Capacity Warning: {alertsConfig.capacityWarningAlert ? "ON" : "OFF"}</div>
                  <div>
                    📡{" "}
                    {[
                      alertsConfig.channels.dashboardToast && "Toast",
                      alertsConfig.channels.email && "Email",
                      alertsConfig.channels.browserPush && "Push",
                    ]
                      .filter(Boolean)
                      .join(", ") || "No channels"}
                  </div>
                </div>
              </div>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>

          {/* Configure Alerts button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setConfigModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            Configure Alerts
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Stats */}
      <AlertStats alerts={alerts} />

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {[
              { value: "all", label: "All", color: "gray" },
              { value: "active", label: "Active", color: "red" },
              { value: "critical", label: "Critical", color: "orange" },
              { value: "warning", label: "Warning", color: "amber" },
              { value: "resolved", label: "Resolved", color: "emerald" },
            ].map((item) => (
              <motion.button
                key={item.value}
                onClick={() => setFilter(item.value as any)}
                className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                  filter === item.value
                    ? `${
                        item.color === "red"
                          ? "bg-red-500"
                          : item.color === "orange"
                          ? "bg-orange-500"
                          : item.color === "amber"
                          ? "bg-amber-500"
                          : item.color === "emerald"
                          ? "bg-emerald-500"
                          : "bg-gray-500"
                      } text-white shadow-lg`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Guard alert banner — shows when live alerts are detected */}
      <AnimatePresence>
        {activeGuardCount > 0 && (
          <motion.div
            key="guard-banner"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-200">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-emerald-800">
                  Smart Guard detected {activeGuardCount} live{" "}
                  {activeGuardCount === 1 ? "issue" : "issues"} in the ecosystem
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Review the alerts below — they've been automatically injected at the top of the list
                </p>
              </div>
              <Zap className="w-4 h-4 text-emerald-500 flex-shrink-0 animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert, index) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              index={index}
              onResolve={() => handleResolveAlert(alert.id)}
              onDelete={() => handleDeleteAlert(alert.id)}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-12 text-center shadow-lg"
          >
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No alerts found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}
      </div>

      <ConfigureAlertsModal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
      />
    </div>
  );
}