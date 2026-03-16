'use client';

import { motion, AnimatePresence, Reorder } from 'motion/react';
import { 
  Package, 
  Users, 
  MapPin, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Zap,
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Target,
  DollarSign,
  Leaf,
  Truck,
  Settings
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useActivityLog } from '@/app/contexts/ActivityLogContext';
import { useRole } from '@/app/contexts/RoleContext';
import WidgetCustomizerModal from '../../components/WidgetCustomizerModal';

// Animated Counter
function AnimatedCounter({ end, duration = 2, prefix = '', suffix = '' }: { end: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const easeOutExpo = (x: number): number => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const easedProgress = easeOutExpo(progress);
      
      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{prefix}{count.toLocaleString()}{suffix}</>;
}

// Floating Orb Background
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            width: Math.random() * 300 + 200,
            height: Math.random() * 300 + 200,
            background: `linear-gradient(45deg, ${['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899'][i]}, transparent)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

// Stat Card Component
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  trendValue, 
  color,
  delay = 0,
  gradient,
}: { 
  icon: any; 
  label: string; 
  value: number; 
  trend: 'up' | 'down'; 
  trendValue: string; 
  color: string;
  delay?: number;
  gradient: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      {/* Animated Border */}
      <motion.div
        className={`absolute inset-0 rounded-2xl`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        style={{
          background: `linear-gradient(45deg, ${color}, transparent)`,
          padding: '2px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      <div className="relative p-6">
        {/* Icon with animated background */}
        <motion.div
          className="flex items-center justify-between mb-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          <motion.div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />
            <Icon className="w-7 h-7 text-white relative z-10" />
          </motion.div>

          {/* Sparkle Icon */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Sparkles className={`w-5 h-5 text-${color.split('-')[0]}-400`} />
          </motion.div>
        </motion.div>

        {/* Label */}
        <motion.p
          className="text-sm font-medium text-gray-600 mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3 }}
        >
          {label}
        </motion.p>

        {/* Value with counter animation */}
        <motion.div
          className="text-4xl font-bold text-gray-900 mb-3"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + 0.4, type: 'spring' }}
        >
          <AnimatedCounter end={value} />
        </motion.div>

        {/* Trend Indicator */}
        <motion.div
          className={`flex items-center gap-1 text-sm font-medium ${
            trend === 'up' ? 'text-emerald-600' : 'text-red-600'
          }`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
        >
          {trend === 'up' ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          <span>{trendValue}</span>
          <span className="text-gray-500 font-normal">from last month</span>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: delay + 0.6, duration: 0.8 }}
        >
          <motion.div
            className={`h-full bg-gradient-to-r ${gradient} relative`}
            initial={{ width: 0 }}
            animate={{ width: '75%' }}
            transition={{ delay: delay + 0.7, duration: 1, ease: 'easeOut' }}
          >
            <motion.div
              className="absolute inset-0 bg-white/30"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Corner decoration */}
      <motion.div
        className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl`}
        animate={{
          scale: isHovered ? 1.5 : 1,
          opacity: isHovered ? 0.2 : 0.1,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

// Activity Item Component
function ActivityItem({ 
  icon: Icon, 
  title, 
  description, 
  time, 
  status,
  index,
}: { 
  icon: any; 
  title: string; 
  description: string; 
  time: string; 
  status: 'success' | 'warning' | 'info';
  index: number;
}) {
  const statusColors = {
    success: 'from-emerald-500 to-teal-500',
    warning: 'from-orange-500 to-amber-500',
    info: 'from-blue-500 to-cyan-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, type: 'spring' }}
      whileHover={{ 
        x: 10, 
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
      }}
      className="flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer group"
    >
      {/* Icon */}
      <motion.div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statusColors[status]} flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden`}
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
            ease: 'linear',
          }}
        />
        <Icon className="w-6 h-6 text-white relative z-10" />
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <motion.p
          className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.1 }}
        >
          {title}
        </motion.p>
        <motion.p
          className="text-sm text-gray-600 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
        >
          {description}
        </motion.p>
        <motion.div
          className="flex items-center gap-2 text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          <Clock className="w-3 h-3" />
          <span>{time}</span>
        </motion.div>
      </div>

      {/* Indicator dot */}
      <motion.div
        className={`w-3 h-3 rounded-full bg-gradient-to-br ${statusColors[status]} shadow-lg`}
        animate={{
          scale: [1, 1.3, 1],
          boxShadow: [
            '0 0 0 0 rgba(16, 185, 129, 0.4)',
            '0 0 0 8px rgba(16, 185, 129, 0)',
            '0 0 0 0 rgba(16, 185, 129, 0)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
}

// Quick Action Card
function QuickActionCard({ 
  icon: Icon, 
  title, 
  description, 
  color,
  index,
}: { 
  icon: any; 
  title: string; 
  description: string; 
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ delay: index * 0.1, type: 'spring' }}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      }}
      whileTap={{ scale: 0.95 }}
      className={`bg-gradient-to-br ${color} rounded-2xl p-6 cursor-pointer relative overflow-hidden group`}
    >
      {/* Animated background pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '20px 20px'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.div
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <Icon className="w-10 h-10 text-white mb-4" />
      </motion.div>
      
      <h3 className="text-lg font-bold text-white mb-2 relative z-10">{title}</h3>
      <p className="text-sm text-white/80 relative z-10">{description}</p>

      {/* Corner glow */}
      <motion.div
        className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
}

export default function Overview() {
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('month');
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [hiddenWidgets, setHiddenWidgets] = useState<string[]>([]);
  const { role: currentRole } = useRole();
  const { activities } = useActivityLog();

  // Role-specific greetings
  const greetings: Record<string, { title: string; subtitle: string }> = {
    admin: { title: 'System Overview', subtitle: 'Complete system metrics and management controls' },
    manager: { title: 'Team Performance', subtitle: 'Your team\'s progress and resource allocation' },
    driver: { title: 'My Dashboard', subtitle: 'Your daily tasks and route information' },
    citizen: { title: 'My Recycling Hub', subtitle: 'Track your contributions and earn rewards' },
  };

  // Role-specific stats
  const roleStats: Record<string, any[]> = {
    admin: [
      { icon: Package, label: 'Total Bottles', value: 150234, trend: 'up' as const, trendValue: '+12%', color: 'emerald-500', gradient: 'from-emerald-500 to-teal-500' },
      { icon: Users, label: 'Active Citizens', value: 5024, trend: 'up' as const, trendValue: '+8%', color: 'blue-500', gradient: 'from-blue-500 to-cyan-500' },
      { icon: MapPin, label: 'Active Routes', value: 24, trend: 'up' as const, trendValue: '+3', color: 'purple-500', gradient: 'from-purple-500 to-pink-500' },
      { icon: Target, label: 'Collection Rate', value: 94, trend: 'up' as const, trendValue: '+2%', color: 'orange-500', gradient: 'from-orange-500 to-amber-500' },
    ],
    manager: [
      { icon: Users, label: 'My Team Drivers', value: 12, trend: 'up' as const, trendValue: '+2', color: 'blue-500', gradient: 'from-blue-500 to-cyan-500' },
      { icon: Package, label: 'Team Collections', value: 34500, trend: 'up' as const, trendValue: '+15%', color: 'emerald-500', gradient: 'from-emerald-500 to-teal-500' },
      { icon: MapPin, label: 'Active Routes', value: 8, trend: 'up' as const, trendValue: '+1', color: 'purple-500', gradient: 'from-purple-500 to-pink-500' },
      { icon: Target, label: 'Team Target', value: 88, trend: 'up' as const, trendValue: '+5%', color: 'orange-500', gradient: 'from-orange-500 to-amber-500' },
    ],
    driver: [
      { icon: MapPin, label: 'Today\'s Stops', value: 12, trend: 'up' as const, trendValue: '3 done', color: 'blue-500', gradient: 'from-blue-500 to-cyan-500' },
      { icon: Package, label: 'Collected Today', value: 450, trend: 'up' as const, trendValue: '+25%', color: 'emerald-500', gradient: 'from-emerald-500 to-teal-500' },
      { icon: Activity, label: 'Distance (km)', value: 35, trend: 'up' as const, trendValue: '15 left', color: 'purple-500', gradient: 'from-purple-500 to-pink-500' },
      { icon: Award, label: 'Rating', value: 4, trend: 'up' as const, trendValue: '⭐⭐⭐⭐', color: 'orange-500', gradient: 'from-orange-500 to-amber-500' },
    ],
    citizen: [
      { icon: Package, label: 'My Bottles', value: 342, trend: 'up' as const, trendValue: '+28 this week', color: 'emerald-500', gradient: 'from-emerald-500 to-teal-500' },
      { icon: Award, label: 'My Points', value: 1730, trend: 'up' as const, trendValue: '+140', color: 'orange-500', gradient: 'from-orange-500 to-amber-500' },
      { icon: Target, label: 'Weekly Goal', value: 78, trend: 'up' as const, trendValue: '78%', color: 'blue-500', gradient: 'from-blue-500 to-cyan-500' },
      { icon: Leaf, label: 'CO₂ Saved (kg)', value: 15, trend: 'up' as const, trendValue: '+2.3', color: 'purple-500', gradient: 'from-purple-500 to-pink-500' },
    ],
  };

  const greeting = greetings[currentRole] || greetings.admin;

  const getFilteredStats = (stats: any[], filter: string, hidden: string[]) => {
    const multiplier = filter === 'today' ? 0.05 : filter === 'week' ? 0.25 : 1;
    return stats
      .filter(stat => !hidden.includes(stat.label))
      .map(stat => {
        // Don't multiply ratings or percentages
        if (typeof stat.value === 'number' && stat.label !== 'Rating' && !stat.label.includes('Rate') && !stat.label.includes('%')) {
          return { ...stat, value: Math.ceil(stat.value * multiplier) };
        }
        return stat;
      });
  };

  const currentRoleStats = roleStats[currentRole] || roleStats.admin;
  const [orderedStats, setOrderedStats] = useState(getFilteredStats(currentRoleStats, timeFilter, hiddenWidgets));

  // Sync when role, time filter, or hidden widgets changes
  useEffect(() => {
    setOrderedStats(getFilteredStats(currentRoleStats, timeFilter, hiddenWidgets));
  }, [currentRole, timeFilter, hiddenWidgets]);

  const quickActions = currentRole === 'citizen' ? [
    { icon: Zap, title: 'Request Pickup', description: 'Schedule bottle collection', color: 'from-emerald-500 to-teal-600' },
    { icon: Award, title: 'My Rewards', description: 'View points & badges', color: 'from-orange-500 to-amber-600' },
    { icon: Users, title: 'Communities', description: 'Join & compete', color: 'from-purple-500 to-pink-600' },
    { icon: MapPin, title: 'Find Center', description: 'Nearest drop-off', color: 'from-blue-500 to-cyan-600' },
  ] : currentRole === 'driver' ? [
    { icon: MapPin, title: 'My Route', description: 'View today\'s route', color: 'from-blue-500 to-cyan-600' },
    { icon: Package, title: 'Scan Bottles', description: 'Quick QR scan', color: 'from-emerald-500 to-teal-600' },
    { icon: Activity, title: 'My Stats', description: 'Performance metrics', color: 'from-purple-500 to-pink-600' },
    { icon: Zap, title: 'Report Issue', description: 'Submit a report', color: 'from-orange-500 to-amber-600' },
  ] : [
    { icon: Zap, title: 'Quick Scan', description: 'Scan new QR code', color: 'from-emerald-500 to-teal-600' },
    { icon: MapPin, title: 'New Route', description: 'Create collection route', color: 'from-blue-500 to-cyan-600' },
    { icon: Users, title: 'Add Citizen', description: 'Register new user', color: 'from-purple-500 to-pink-600' },
    { icon: Activity, title: 'View Analytics', description: 'Deep insights & reports', color: 'from-orange-500 to-amber-600' },
  ];

  return (
    <div className="space-y-8 relative">
      {/* Floating Orbs Background */}
      <FloatingOrbs />

      {/* Header with animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              Dashboard Overview
            </motion.h1>
            <motion.p
              className="text-gray-600 mt-2 flex items-center gap-2"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Welcome back! Here's what's happening today.
            </motion.p>
          </div>

          <div className="flex items-center gap-4">
            {/* Time Filter Dropdown */}
            <motion.select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="bg-white border flex items-center border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 shadow-sm font-medium outline-none cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </motion.select>

            {/* Additional Header Settings Button (Manager/Admin Only) */}
            {(currentRole === 'admin' || currentRole === 'manager') && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 }}
                onClick={() => setIsCustomizerOpen(true)}
                className="p-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all"
                title="Customize Dashboard"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </motion.button>
            )}

            {/* Live indicator */}
            <motion.div
              className="hidden sm:flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-200"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              <motion.div
                className="w-2.5 h-2.5 bg-emerald-500 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(16, 185, 129, 0.4)',
                    '0 0 0 6px rgba(16, 185, 129, 0)',
                    '0 0 0 0 rgba(16, 185, 129, 0)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <span className="text-sm font-bold text-gray-700">LIVE</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid with Drag & Drop */}
      <Reorder.Group 
        axis="x" 
        values={orderedStats} 
        onReorder={setOrderedStats} 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
        style={{ display: 'grid' }}
      >
        {orderedStats.map((stat: any, index: number) => (
          <Reorder.Item 
            key={stat.label} 
            value={stat}
            style={{ position: 'relative' }}
          >
            <div className="cursor-grab active:cursor-grabbing">
              <StatCard {...stat} delay={index * 0.1} />
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative z-10"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-emerald-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Recent Activity & Performance */}
      <div className="grid lg:grid-cols-2 gap-6 relative z-10">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-xl p-6 relative overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100 to-transparent rounded-full blur-3xl opacity-30" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-6 h-6 text-emerald-500" />
                Recent Activity
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View All
              </motion.button>
            </div>
            
            <div className="space-y-2">
              {activities.slice(0, 5).map((activity, index) => {
                const statusMap: Record<string, "success" | "warning" | "info"> = {
                  low: "success",
                  medium: "warning",
                  high: "info"
                };
                return (
                  <ActivityItem 
                    key={index} 
                    icon={Activity}
                    title={activity.action}
                    description={activity.details}
                    time={activity.timestamp.toLocaleDateString()}
                    status={statusMap[activity.severity] || "info"}
                    index={index} 
                  />
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Dynamic Secondary Section Based on Role */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className={`bg-gradient-to-br ${
            currentRole === 'driver' ? 'from-blue-500 via-indigo-500 to-purple-500' 
            : currentRole === 'citizen' ? 'from-orange-500 via-amber-500 to-yellow-500'
            : 'from-emerald-500 via-teal-500 to-cyan-500'
          } rounded-2xl shadow-xl p-6 text-white relative overflow-hidden`}
        >
          {/* Animated background circles */}
          <motion.div
            className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          <div className="relative z-10 h-full flex flex-col justify-center">
            {currentRole === 'admin' && (
              <>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Financial & System Overview
                </h2>
                <div className="space-y-6">
                  {[
                    { icon: DollarSign, label: 'Revenue This Month', value: '$45,230', change: '+15%' },
                    { icon: Leaf, label: 'Total CO₂ Saved', value: '2,340 kg', change: '+8%' },
                    { icon: Target, label: 'System Efficiency', value: '94%', change: '+5%' },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className="bg-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/20 transition-all cursor-pointer flex justify-between items-center"
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm opacity-80">{item.label}</p>
                            <p className="text-xl font-bold">{item.value}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-medium bg-white/20 px-2 py-1 rounded-lg">
                          <ArrowUpRight className="w-4 h-4" />
                          {item.change}
                        </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {currentRole === 'manager' && (
              <>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6" />
                  Operational Focus
                </h2>
                <div className="space-y-6">
                  {[
                    { icon: Clock, label: 'Pending Requests Today', value: '142', change: '-12%' },
                    { icon: MapPin, label: 'Active Routes', value: '8', change: 'On Track' },
                    { icon: Users, label: 'Driver Availability', value: '92%', change: 'Optimum' },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className="bg-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/20 transition-all cursor-pointer flex justify-between items-center"
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm opacity-80">{item.label}</p>
                            <p className="text-xl font-bold">{item.value}</p>
                          </div>
                        </div>
                        <div className="text-sm font-medium opacity-90">
                          {item.change}
                        </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {currentRole === 'driver' && (
              <div className="flex flex-col items-center text-center justify-center h-full py-8">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
                  <Truck className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No assigned routes for today.</h2>
                <p className="text-white/80 mb-8 max-w-[250px]">
                  You currently have no active deliveries or pickups. Take a rest or check with your manager!
                </p>
                <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  View Schedule
                </button>
              </div>
            )}

            {currentRole === 'citizen' && (
              <div className="flex flex-col items-center text-center justify-center h-full py-8">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Ready to make an impact?</h2>
                <p className="text-white/80 mb-8 max-w-[280px]">
                  You haven't requested any pickups recently. Start recycling to earn points and climb the community leaderboard!
                </p>
                <button className="px-6 py-3 bg-white text-orange-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 hover:-translate-y-1">
                  <Zap className="w-5 h-5" />
                  Request your first pickup!
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isCustomizerOpen && (
          <WidgetCustomizerModal
            isOpen={isCustomizerOpen}
            onClose={() => setIsCustomizerOpen(false)}
            availableWidgets={currentRoleStats}
            hiddenWidgets={hiddenWidgets}
            setHiddenWidgets={setHiddenWidgets}
          />
        )}
      </AnimatePresence>
    </div>
  );
}