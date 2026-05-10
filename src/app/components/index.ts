import { Link, useLocation, Outlet } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Bell,
  Package,
  TrendingUp,
  FileText,
  Users,
  MapPin,
  UsersRound,
  Building2,
  BarChart3,
  Menu,
  Home,
  Settings,
  LogOut,
  Sparkles,
  Zap,
  Shield,
  Moon,
  Sun,
  ClipboardList,
  Ticket,
} from "lucide-react";
import { useState } from "react";
import SettingsModal from "@/app/components/SettingsModal";
import { useRole } from "@/app/contexts/RoleContext";
import { useTheme } from "@/app/contexts/ThemeContext";
import { GlobalSearch } from "@/app/components/GlobalSearch";
import { NotificationBell } from "@/app/components/NotificationBell";
import { ChatPanel } from "@/app/components/ChatPanel";
import { OnboardingTour } from "@/app/components/OnboardingTour";

const sidebarItems = [
  {
    name: "Overview",
    path: "/dashboard/overview",
    icon: LayoutDashboard,
    color: "emerald",
    roles: ["admin", "manager", "citizen"],
  },
  {
    name: "Smart Alerts",
    path: "/dashboard/smart-alerts",
    icon: Bell,
    color: "red",
    roles: ["admin", "manager"],
  },
  {
    name: "Resources",
    path: "/dashboard/resources",
    icon: Package,
    color: "blue",
    roles: ["admin"],
  },
  {
    name: "Performance",
    path: "/dashboard/performance",
    icon: TrendingUp,
    color: "purple",
    roles: ["admin", "manager"],
  },
  {
    name: "Reports",
    path: "/dashboard/reports",
    icon: FileText,
    color: "orange",
    roles: ["admin", "manager"],
  },
  {
    name: "Drivers",
    path: "/dashboard/drivers",
    icon: Users,
    color: "cyan",
    roles: ["admin", "manager"],
  },
  {
    name: "Routes",
    path: "/dashboard/routes",
    icon: MapPin,
    color: "pink",
    roles: ["admin", "manager"],
  },
  {
    name: "Citizens",
    path: "/dashboard/citizens",
    icon: UsersRound,
    color: "indigo",
    roles: ["admin", "manager"],
  },
  {
    name: "Centers",
    path: "/dashboard/centers",
    icon: Building2,
    color: "teal",
    roles: ["admin", "manager", "driver"],
  },
  {
    name: "Analytics",
    path: "/dashboard/analytics",
    icon: BarChart3,
    color: "violet",
    roles: ["admin", "manager"],
  },
  {
    name: "Activity Log",
    path: "/dashboard/activity-log",
    icon: ClipboardList,
    color: "emerald",
    roles: ["admin", "manager"],
  },
  {
    name: "Fleet Map",
    path: "/dashboard/fleet-map",
    icon: MapPin,
    color: "emerald",
    roles: ["admin", "manager", "driver", "citizen"],
  },
  {
    name: "Communities",
    path: "/dashboard/communities",
    icon: Users,
    color: "blue",
    roles: ["admin", "citizen"],
  },
  {
    name: "Pickup Requests",
    path: "/dashboard/pickup-requests",
    icon: Package,
    color: "purple",
    roles: ["admin", "manager", "citizen"],
  },
  {
    name: "Fleet Maintenance",
    path: "/dashboard/fleet-maintenance",
    icon: Settings,
    color: "red",
    roles: ["admin", "manager"],
  },
  {
    name: "Support Tickets",
    path: "/dashboard/support-tickets",
    icon: Ticket,
    color: "orange",
    roles: ["admin", "manager"],
  },
];

import RoleSwitcher from "@/app/components/RoleSwitcher";
import { RouteGuard } from "@/app/components/RouteGuard";

export default function DashboardLayout() {
  const location = useLocation();
  const pathname = location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsModalOpen, setSettingsModalOpen] =
    useState(false);
  const { role } = useRole();
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-950 text-gray-100"
          : "bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/30 text-gray-900"
      }`}
    >
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl opacity-10"
            style={{
              width: 400,
              height: 400,
              background: `linear-gradient(45deg, ${["#10B981", "#3B82F6", "#8B5CF6"][i]}, transparent)`,
              left: `${i * 40}%`,
              top: `${i * 30}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Fixed Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className={`fixed top-0 left-0 right-0 h-16 backdrop-blur-xl border-b z-50 shadow-sm transition-colors ${
          theme === "dark"
            ? "bg-gray-900/80 border-gray-800"
            : "bg-white/80 border-gray-200/50"
        }`}
      >
        <div className="h-full px-4 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-emerald-50 rounded-xl transition-colors relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: sidebarOpen ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <Menu className="w-5 h-5 text-gray-700 group-hover:text-emerald-600" />
              </motion.div>
            </motion.button>

            {/* Logo */}
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                RecycleHub
              </h1>
            </motion.div>

            {/* Global Search */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:block"
            >
              <GlobalSearch />
            </motion.div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Home Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">
                  Home
                </span>
              </Link>
            </motion.div>

            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-colors ${
                theme === "dark"
                  ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>

            {/* Chat with Drivers */}
            <ChatPanel />

            {/* Notifications */}
            <NotificationBell />

            {/* Profile Avatar */}
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold cursor-pointer shadow-lg relative overflow-hidden group"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
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
              <span className="relative z-10">A</span>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Fixed Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{
          duration: 0.3,
          type: "spring",
          damping: 25,
        }}
        className={`fixed left-0 top-16 bottom-0 w-64 backdrop-blur-xl border-r z-40 shadow-lg overflow-hidden transition-colors ${
          theme === "dark"
            ? "bg-gray-900/80 border-gray-800"
            : "bg-white/80 border-gray-200/50"
        }`}
      >
        <nav className="p-4 space-y-2 h-full overflow-y-auto">
          {sidebarItems
            .filter((item) => item.roles.includes(role))
            .map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              const gradientClasses: Record<string, string> = {
                emerald:
                  "from-slate-500 via-slate-600 to-gray-600",
                red: "from-slate-500 via-slate-600 to-gray-600",
                blue: "from-slate-500 via-slate-600 to-gray-600",
                purple:
                  "from-slate-500 via-slate-600 to-gray-600",
                orange:
                  "from-slate-500 via-slate-600 to-gray-600",
                cyan: "from-slate-500 via-slate-600 to-gray-600",
                pink: "from-slate-500 via-slate-600 to-gray-600",
                indigo:
                  "from-slate-500 via-slate-600 to-gray-600",
                teal: "from-slate-500 via-slate-600 to-gray-600",
                violet:
                  "from-slate-500 via-slate-600 to-gray-600",
              };

              const gradientClass =
                gradientClasses[item.color] ||
                "from-gray-500 to-gray-600";

              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    className="block relative group"
                  >
                    <motion.div
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden ${
                        isActive
                          ? `bg-gradient-to-r ${gradientClass} text-white shadow-lg`
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      whileHover={{ x: 5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          animate={{
                            x: ["-100%", "200%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      )}

                      <motion.div
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0 relative z-10" />
                      </motion.div>
                      <span className="whitespace-nowrap font-medium relative z-10">
                        {item.name}
                      </span>

                      {isActive && (
                        <motion.div
                          className="absolute right-2 w-2 h-2 bg-white rounded-full"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [1, 0.5, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      )}
                    </motion.div>

                    {!isActive && (
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${gradientClass} opacity-5 rounded-xl pointer-events-none`}
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 0.08 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}

          {/* Divider */}
          <div className="my-4 border-t border-gray-200" />

          {/* Admin Dashboard Link - Only for Admin */}
          {role === "admin" && (
            <Link
              to="/dashboard/admin"
              className="block relative group"
            >
              <motion.div
                className="relative flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-slate-500 hover:via-gray-500 hover:to-slate-600 hover:text-white transition-all overflow-hidden"
                whileHover={{ x: 5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-slate-500 via-gray-500 to-slate-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                  initial={{ opacity: 0 }}
                />

                <Shield className="w-5 h-5 relative z-10" />
                <span className="font-medium relative z-10">
                  Admin Panel
                </span>

                <motion.div
                  className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100"
                  initial={{ x: "-100%" }}
                  whileHover={{
                    x: "200%",
                    transition: {
                      duration: 0.6,
                      ease: "linear",
                    },
                  }}
                />
              </motion.div>
            </Link>
          )}

          {/* Settings 1 - Page Link */}
          <Link
            to="/dashboard/settings"
            className="block relative group"
          >
            <motion.div
              className="relative flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-gray-500 hover:via-slate-500 hover:to-gray-600 hover:text-white transition-all overflow-hidden"
              whileHover={{ x: 5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-500 via-slate-500 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                initial={{ opacity: 0 }}
              />

              <Settings className="w-5 h-5 transition-transform duration-500 relative z-10" />
              <span className="font-medium relative z-10">
                Settings 1
              </span>

              <motion.div
                className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100"
                initial={{ x: "-100%" }}
                whileHover={{
                  x: "200%",
                  transition: { duration: 0.6, ease: "linear" },
                }}
              />
            </motion.div>
          </Link>

          {/* Settings 2 - Modal */}
          <motion.button
            onClick={() => setSettingsModalOpen(true)}
            className="relative flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-600 hover:text-white w-full transition-all group overflow-hidden"
            whileHover={{ x: 5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
              initial={{ opacity: 0 }}
            />

            <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-500 relative z-10" />
            <span className="font-medium relative z-10">
              Settings 2
            </span>

            <motion.div
              className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100"
              initial={{ x: "-100%" }}
              whileHover={{
                x: "200%",
                transition: { duration: 0.6, ease: "linear" },
              }}
            />
          </motion.button>

          {/* Logout */}
          <motion.button
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full transition-all group"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </nav>
      </motion.aside>

      {/* Main Content Area */}
      <motion.main
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        } mt-16 p-6 min-h-screen relative z-10`}
      >
        <AnimatePresence mode="wait">
          <motion.div key={pathname}>
            <RouteGuard path={pathname}>
              <Outlet />
            </RouteGuard>
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />

      {/* Floating Role Switcher — temporarily disabled (admin-only mode) */}
      {/* <RoleSwitcher /> */}

      {/* Onboarding Tour - shows once for new users */}
      <OnboardingTour />
    </div>
  );
}