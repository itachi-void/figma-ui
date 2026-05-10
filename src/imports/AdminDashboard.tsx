'use client';

import { motion } from 'motion/react';
import { 
  Users, Server, Activity, AlertTriangle, 
  Shield, Database, Clock, CheckCircle, CircleX,
  TrendingUp, Settings, FileText
} from 'lucide-react';
import { statusColors, typography, spacing } from '@/app/utils/colors';
import { useState, useEffect } from 'react';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import EmptyState from '@/app/components/EmptyState';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'warning' | 'error'>('healthy');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  const stats = [
    { 
      label: 'Total Users', 
      value: '1,247', 
      change: '+12%',
      icon: Users,
      status: 'info' as const,
    },
    { 
      label: 'Server Status', 
      value: 'Online', 
      change: '99.9%',
      icon: Server,
      status: systemStatus === 'healthy' ? 'success' as const : 'error' as const,
    },
    { 
      label: 'Active Sessions', 
      value: '342', 
      change: '+8%',
      icon: Activity,
      status: 'success' as const,
    },
    { 
      label: 'System Alerts', 
      value: '3', 
      change: '-50%',
      icon: AlertTriangle,
      status: 'warning' as const,
    },
  ];

  const systemLogs = [
    { type: 'success', message: 'Database backup completed', time: '2 min ago' },
    { type: 'warning', message: 'High memory usage detected', time: '15 min ago' },
    { type: 'error', message: 'Failed login attempt from IP 192.168.1.1', time: '1 hour ago' },
    { type: 'info', message: 'System updated to v2.1.0', time: '3 hours ago' },
  ];

  const permissions = [
    { role: 'Admin', users: 5, color: 'purple' },
    { role: 'Manager', users: 23, color: 'blue' },
    { role: 'Driver', users: 145, color: 'cyan' },
    { role: 'Citizen', users: 1074, color: 'emerald' },
  ];

  return (
    <div className={spacing.section}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className={`${typography.h2} bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent`}>
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">System control and management</p>
        </div>
        
        <motion.button
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-500 via-gray-500 to-slate-600 text-white rounded-xl font-medium shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="w-5 h-5" />
          System Settings
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${spacing.grid}`}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = statusColors[stat.status];
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${spacing.card} bg-white rounded-2xl shadow-lg border ${colors.border} hover:shadow-xl transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                  <p className={`${typography.number} ${colors.text}`}>{stat.value}</p>
                  <p className={`${typography.small} ${colors.text} mt-2`}>{stat.change}</p>
                </div>
                <motion.div
                  className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon className={`w-7 h-7 ${colors.icon}`} />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Logs */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className={typography.h5}>System Logs & Activity</h3>
              </div>
              <button className="text-sm text-blue-600 hover:underline">View All</button>
            </div>

            <div className="space-y-3">
              {systemLogs.map((log, index) => {
                const logStatus = log.type as 'success' | 'warning' | 'error' | 'info';
                const colors = statusColors[logStatus];
                const Icon = logStatus === 'success' ? CheckCircle : 
                             logStatus === 'error' ? CircleX :
                             logStatus === 'warning' ? AlertTriangle : Activity;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start gap-3 p-4 ${colors.bg} border ${colors.border} rounded-xl`}
                  >
                    <Icon className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1">
                      <p className={`${typography.small} ${colors.text} font-medium`}>{log.message}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {log.time}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* User Roles & Permissions */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className={typography.h5}>User Roles</h3>
            </div>

            <div className="space-y-4">
              {permissions.map((perm, index) => (
                <motion.div
                  key={perm.role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{perm.role}</span>
                    <span className="text-sm font-bold text-gray-900">{perm.users} users</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(perm.users / 1247) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                      className={`h-full bg-gradient-to-r ${
                        perm.color === 'purple' ? 'from-purple-500 to-violet-500' :
                        perm.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                        perm.color === 'cyan' ? 'from-cyan-500 to-teal-500' :
                        'from-emerald-500 to-green-500'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              className="w-full mt-6 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Manage Permissions
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Database Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Database className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className={typography.h5}>Database & Storage</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Size', value: '2.4 GB', percent: 45 },
            { label: 'Active Records', value: '45,231', percent: 78 },
            { label: 'Cache Hit Rate', value: '94.2%', percent: 94 },
            { label: 'Query Time Avg', value: '12ms', percent: 88 },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <p className="text-sm text-gray-600 mb-2">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 mb-3">{item.value}</p>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percent}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}