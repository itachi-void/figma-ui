import { Link, useLocation, Outlet, useNavigate } from "react-router";
import { useState, Suspense, startTransition } from "react";
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
  Handshake,
} from "lucide-react";
import { useRole } from "../contexts/RoleContext";
import { useTheme } from "../contexts/ThemeContext";
import { useSidebar } from "../contexts/SidebarContext";
import { GlobalSearch } from "../components/GlobalSearch";
import { NotificationBell } from "../components/NotificationBell";
import { ChatPanel } from "../components/ChatPanel";
import { OnboardingTour } from "../components/OnboardingTour";
import { RouteGuard } from "../components/RouteGuard";
import { SettingsModal } from "../components/SettingsModal";
import { useAlertsMonitor } from "../hooks/useAlertsMonitor";
import LoadingSpinner from "../components/LoadingSpinner";

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
    name: "Support Tickets",
    path: "/dashboard/support-tickets",
    icon: Ticket,
    color: "orange",
    roles: ["admin", "manager"],
  },
  {
    name: "B2B Partners",
    path: "/dashboard/b2b",
    icon: Handshake,
    color: "emerald",
    roles: ["admin"],
  },
];

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const { role } = useRole();
  const { theme, toggleTheme } = useTheme();

  // ── Global Smart Guard background monitoring ──
  useAlertsMonitor();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      startTransition(() => navigate("/"));
    }
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-950 text-gray-100"
          : "bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/30 text-gray-900"
      }`}
    >
      {/* Fixed Header */}
      <header
        className={`fixed top-0 left-0 right-0 h-16 backdrop-blur-xl border-b z-50 shadow-sm transition-colors ${
          theme === "dark"
            ? "bg-gray-900/80 border-gray-800"
            : "bg-white/80 border-gray-200/50"
        }`}
      >
        <div className="h-full px-4 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-xl transition-all duration-200 relative group ${
                theme === "dark"
                  ? "hover:bg-gray-800 text-gray-300"
                  : "hover:bg-emerald-50 text-gray-700"
              }`}
            >
              <Menu
                className={`w-5 h-5 transition-all duration-300 ${
                  theme === "dark"
                    ? "group-hover:text-emerald-400"
                    : "group-hover:text-emerald-600"
                }`}
                style={{
                  transform: sidebarOpen ? "rotate(0deg)" : "rotate(180deg)",
                }}
              />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                RecycleHub
              </h1>
            </div>

            {/* Global Search */}
            <div className="hidden lg:block">
              <GlobalSearch />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Home Button */}
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                theme === "dark"
                  ? "text-gray-300 hover:text-emerald-400 hover:bg-gray-800"
                  : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Home</span>
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all hover:scale-105 active:scale-95 ${
                theme === "dark"
                  ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Chat with Drivers */}
            <ChatPanel />

            {/* Notifications */}
            <NotificationBell />

            {/* Profile Avatar */}
            <button
              onClick={() =>
                startTransition(() => navigate("/dashboard/settings"))
              }
              title="Profile & Settings"
              className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold cursor-pointer shadow-lg hover:scale-110 transition-transform"
            >
              <span>A</span>
            </button>
          </div>
        </div>
      </header>

      {/* Fixed Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 backdrop-blur-xl border-r z-40 shadow-lg overflow-hidden transition-all duration-300 ${
          theme === "dark"
            ? "bg-gray-900/80 border-gray-800"
            : "bg-white/80 border-gray-200/50"
        }`}
        style={{
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <nav className="p-4 space-y-2 h-full overflow-y-auto">
          {sidebarItems
            .filter((item) => item.roles.includes(role))
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              const gradientClasses: Record<string, string> = {
                emerald: "from-emerald-500 via-emerald-600 to-teal-600",
                red: "from-red-500 via-rose-500 to-pink-600",
                blue: "from-blue-500 via-blue-600 to-indigo-600",
                purple: "from-purple-500 via-purple-600 to-violet-600",
                orange: "from-orange-500 via-amber-500 to-yellow-600",
                cyan: "from-cyan-500 via-sky-500 to-blue-600",
                pink: "from-pink-500 via-rose-500 to-red-500",
                indigo: "from-indigo-500 via-indigo-600 to-purple-600",
                teal: "from-teal-500 via-emerald-500 to-green-600",
                violet: "from-violet-500 via-purple-500 to-fuchsia-600",
              };

              const gradientClass =
                gradientClasses[item.color] || "from-gray-500 to-gray-600";

              return (
                <div key={item.path}>
                  <Link to={item.path} className="block">
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
                        isActive
                          ? theme === "dark"
                            ? "bg-white/10 text-white border-l-2 border-emerald-400 pl-[14px]"
                            : "bg-emerald-50/80 text-emerald-800 border-l-2 border-emerald-500 pl-[14px]"
                          : theme === "dark"
                            ? "text-gray-400 hover:text-gray-100 hover:translate-x-1"
                            : "text-gray-600 hover:text-gray-900 hover:translate-x-1"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0 relative z-10" />
                      <span className="whitespace-nowrap font-medium relative z-10">
                        {item.name}
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}

          {/* Divider */}
          <div
            className={`my-4 border-t ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          />

          {/* Admin Dashboard Link - Only for Admin */}
          {role === "admin" && (
            <Link to="/dashboard/admin" className="block">
              <div
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  theme === "dark"
                    ? "text-gray-300 hover:bg-gradient-to-r hover:from-slate-600 hover:via-gray-600 hover:to-slate-700 hover:text-white"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-slate-500 hover:via-gray-500 hover:to-slate-600 hover:text-white"
                } hover:translate-x-1`}
              >
                <Shield className="w-5 h-5 relative z-10" />
                <span className="font-medium relative z-10">Admin Panel</span>
              </div>
            </Link>
          )}

          {/* Settings */}
          <Link to="/dashboard/settings" className="block">
            <div
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                pathname === "/dashboard/settings"
                  ? "bg-gradient-to-r from-gray-500 via-slate-500 to-gray-600 text-white shadow-lg scale-[1.02]"
                  : theme === "dark"
                    ? "text-gray-300 hover:bg-gradient-to-r hover:from-gray-600 hover:via-slate-600 hover:to-gray-700 hover:text-white"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-500 hover:via-slate-500 hover:to-gray-600 hover:text-white"
              } hover:translate-x-1`}
            >
              <Settings className="w-5 h-5 relative z-10" />
              <span className="font-medium relative z-10">Settings</span>
            </div>
          </Link>

          {/* Quick Settings (modal) */}
          <button
            onClick={() => setSettingsModalOpen(true)}
            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-200 group ${
              theme === "dark"
                ? "text-gray-300 hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 hover:text-white"
                : "text-gray-700 hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-600 hover:text-white"
            } hover:translate-x-1`}
          >
            <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 relative z-10" />
            <span className="font-medium relative z-10">Quick Settings</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-200 ${
              theme === "dark"
                ? "text-red-400 hover:bg-red-900/30 hover:text-red-300"
                : "text-red-600 hover:bg-red-50"
            } hover:translate-x-1`}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        } mt-16 p-6 min-h-screen relative z-10`}
      >
        <Suspense fallback={<LoadingSpinner size="md" />}>
          <RouteGuard path={pathname}>
            <Outlet />
          </RouteGuard>
        </Suspense>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />

      {/* Onboarding Tour - shows once for new users */}
      <OnboardingTour />
    </div>
  );
}

export default DashboardLayout;