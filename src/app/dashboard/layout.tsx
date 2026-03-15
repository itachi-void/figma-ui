import { Link, useLocation, Outlet } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Bell, Package, TrendingUp, FileText, 
  Users, MapPin, UsersRound, Building2, BarChart3, Menu, Home,
  Settings, LogOut, Search, Sparkles, Zap, X, Shield
} from 'lucide-react';
import { useState } from 'react';
import SettingsModal from '@/app/components/SettingsModal';
import { useRole } from '@/app/contexts/RoleContext';

const sidebarItems = [
  { name: 'Overview', path: '/dashboard/overview', icon: LayoutDashboard, color: 'emerald' },
  { name: 'Smart Alerts', path: '/dashboard/smart-alerts', icon: Bell, color: 'red' },
  { name: 'Resources', path: '/dashboard/resources', icon: Package, color: 'blue' },
  { name: 'Performance', path: '/dashboard/performance', icon: TrendingUp, color: 'purple' },
  { name: 'Reports', path: '/dashboard/reports', icon: FileText, color: 'orange' },
  { name: 'Drivers', path: '/dashboard/drivers', icon: Users, color: 'cyan' },
  { name: 'Routes', path: '/dashboard/routes', icon: MapPin, color: 'pink' },
  { name: 'Citizens', path: '/dashboard/citizens', icon: UsersRound, color: 'indigo' },
  { name: 'Centers', path: '/dashboard/centers', icon: Building2, color: 'teal' },
  { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3, color: 'violet' },
];

export default function DashboardLayout() {
  const location = useLocation();
  const pathname = location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const { role, setRole, userName } = useRole();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/30 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl opacity-10"
            style={{
              width: 400,
              height: 400,
              background: `linear-gradient(45deg, ${['#10B981', '#3B82F6', '#8B5CF6'][i]}, transparent)`,
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
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Fixed Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 z-50 shadow-sm"
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
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                RecycleHub
              </h1>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 hover:bg-gray-200 transition-colors"
            >
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder-gray-500"
              />
              <kbd className="px-2 py-0.5 text-xs bg-white rounded border border-gray-300 text-gray-600">
                ⌘K
              </kbd>
            </motion.div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Home Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/" 
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Home</span>
              </Link>
            </motion.div>

            {/* Notifications */}
            <motion.button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 hover:bg-emerald-50 rounded-xl transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5 text-gray-700 group-hover:text-emerald-600" />
              <motion.span
                className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(239, 68, 68, 0.4)',
                    '0 0 0 4px rgba(239, 68, 68, 0)',
                    '0 0 0 0 rgba(239, 68, 68, 0)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </motion.button>

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
                  ease: 'linear',
                }}
              />
              <span className="relative z-10">A</span>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Notification Panel */}
      <AnimatePresence>
        {notificationOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNotificationOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-16 bottom-0 w-96 bg-white shadow-2xl z-50 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
                <button
                  onClick={() => setNotificationOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <p className="text-sm font-semibold text-gray-900">New bottle collected</p>
                    <p className="text-xs text-gray-600 mt-1">500 bottles added to inventory</p>
                    <p className="text-xs text-gray-500 mt-2">2 minutes ago</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Fixed Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3, type: 'spring', damping: 25 }}
        className="fixed left-0 top-16 bottom-0 w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 z-40 shadow-lg overflow-hidden"
      >
        <nav className="p-4 space-y-2 h-full overflow-y-auto">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            const gradientClasses: Record<string, string> = {
              emerald: 'from-slate-500 via-slate-600 to-gray-600',
              red: 'from-slate-500 via-slate-600 to-gray-600',
              blue: 'from-slate-500 via-slate-600 to-gray-600',
              purple: 'from-slate-500 via-slate-600 to-gray-600',
              orange: 'from-slate-500 via-slate-600 to-gray-600',
              cyan: 'from-slate-500 via-slate-600 to-gray-600',
              pink: 'from-slate-500 via-slate-600 to-gray-600',
              indigo: 'from-slate-500 via-slate-600 to-gray-600',
              teal: 'from-slate-500 via-slate-600 to-gray-600',
              violet: 'from-slate-500 via-slate-600 to-gray-600',
            };

            const gradientClass = gradientClasses[item.color] || 'from-gray-500 to-gray-600';
            
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
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    whileHover={{ x: 5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{
                          x: ['-100%', '200%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    )}

                    <motion.div
                      animate={isActive ? { rotate: 360 } : {}}
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

          {/* Role Switcher */}
          <div className="relative">
            <motion.button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 text-white w-full transition-all group overflow-hidden"
              whileHover={{ x: 5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              
              <Shield className="w-5 h-5 relative z-10" />
              <span className="font-medium relative z-10 capitalize">{role}</span>
            </motion.button>

            {/* Role Dropdown */}
            <AnimatePresence>
              {roleMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
                >
                  {['admin', 'manager', 'user'].map((r) => (
                    <motion.button
                      key={r}
                      onClick={() => {
                        setRole(r as 'admin' | 'manager' | 'user');
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors capitalize ${
                        role === r ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'
                      }`}
                      whileHover={{ x: 5 }}
                    >
                      {r}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Admin Dashboard Link - Only for Admin */}
          {role === 'admin' && (
            <Link to="/dashboard/admin" className="block relative group">
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
                <span className="font-medium relative z-10">Admin Panel</span>
                
                <motion.div
                  className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100"
                  initial={{ x: '-100%' }}
                  whileHover={{
                    x: '200%',
                    transition: { duration: 0.6, ease: 'linear' }
                  }}
                />
              </motion.div>
            </Link>
          )}

          {/* Settings 1 - Page Link */}
          <Link to="/dashboard/settings" className="block relative group">
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
              <span className="font-medium relative z-10">Settings 1</span>
              
              <motion.div
                className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100"
                initial={{ x: '-100%' }}
                whileHover={{
                  x: '200%',
                  transition: { duration: 0.6, ease: 'linear' }
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
            <span className="font-medium relative z-10">Settings 2</span>
            
            <motion.div
              className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100"
              initial={{ x: '-100%' }}
              whileHover={{
                x: '200%',
                transition: { duration: 0.6, ease: 'linear' }
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
          sidebarOpen ? 'ml-64' : 'ml-0'
        } mt-16 p-6 min-h-screen relative z-10`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {/* Settings Modal */}
      <SettingsModal isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
    </div>
  );
}