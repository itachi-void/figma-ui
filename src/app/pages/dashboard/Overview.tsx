'use client';

import { motion, AnimatePresence } from 'motion/react';
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
} from 'lucide-react';
import { useState, useEffect } from 'react';

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
            whileHover={{ rotate: 360, scale: 1.1 }}
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
        whileHover={{ rotate: 360, scale: 1.1 }}
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
        whileHover={{ rotate: 360, scale: 1.2 }}
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
  const stats = [
    {
      icon: Package,
      label: 'Total Bottles',
      value: 150234,
      trend: 'up' as const,
      trendValue: '+12%',
      color: 'emerald-500',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Users,
      label: 'Active Citizens',
      value: 5024,
      trend: 'up' as const,
      trendValue: '+8%',
      color: 'blue-500',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: MapPin,
      label: 'Active Routes',
      value: 24,
      trend: 'up' as const,
      trendValue: '+3',
      color: 'purple-500',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Target,
      label: 'Collection Rate',
      value: 94,
      trend: 'up' as const,
      trendValue: '+2%',
      color: 'orange-500',
      gradient: 'from-orange-500 to-amber-500',
    },
  ];

  const activities = [
    {
      icon: CheckCircle,
      title: 'New collection completed',
      description: 'Downtown Center - 450 bottles collected',
      time: '10 minutes ago',
      status: 'success' as const,
    },
    {
      icon: Users,
      title: 'Driver assigned to route',
      description: 'John Smith assigned to Route A-5',
      time: '25 minutes ago',
      status: 'info' as const,
    },
    {
      icon: AlertCircle,
      title: 'Center capacity alert',
      description: 'North Center reaching 90% capacity',
      time: '1 hour ago',
      status: 'warning' as const,
    },
    {
      icon: Award,
      title: 'Milestone reached',
      description: '1 million bottles recycled this year!',
      time: '2 hours ago',
      status: 'success' as const,
    },
  ];

  const quickActions = [
    {
      icon: Zap,
      title: 'Quick Scan',
      description: 'Scan new QR code',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: MapPin,
      title: 'New Route',
      description: 'Create collection route',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: Users,
      title: 'Add Citizen',
      description: 'Register new user',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: Activity,
      title: 'View Analytics',
      description: 'Deep insights & reports',
      color: 'from-orange-500 to-amber-600',
    },
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

          {/* Live indicator */}
          <motion.div
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <motion.div
              className="w-3 h-3 bg-emerald-500 rounded-full"
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
            <span className="text-sm font-medium text-gray-700">Live Data</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} delay={index * 0.1} />
        ))}
      </div>

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
              {activities.map((activity, index) => (
                <ActivityItem key={index} {...activity} index={index} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Performance Overview */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden"
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

          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Performance Overview
            </h2>

            <div className="space-y-6">
              {[
                { icon: DollarSign, label: 'Revenue This Month', value: '$45,230', change: '+15%' },
                { icon: Leaf, label: 'CO₂ Saved', value: '2,340 kg', change: '+8%' },
                { icon: Target, label: 'Target Achievement', value: '87%', change: '+5%' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/20 transition-all cursor-pointer"
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <item.icon className="w-6 h-6" />
                      </motion.div>
                      <div>
                        <p className="text-sm opacity-80">{item.label}</p>
                        <p className="text-2xl font-bold">{item.value}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <ArrowUpRight className="w-4 h-4" />
                        {item.change}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}