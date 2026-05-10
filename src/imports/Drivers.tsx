'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Star,
  MapPin,
  Truck,
  Clock,
  CheckCircle,
  CircleX,
  Phone,
  Mail,
  Calendar,
  Award,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  MoreVertical,
  Navigation,
  Package,
  DollarSign,
  Activity,
  UserCheck,
  UserX,
} from 'lucide-react';

type DriverStatus = 'active' | 'inactive' | 'on-leave' | 'available';

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: DriverStatus;
  currentRoute: string;
  completedTrips: number;
  rating: number;
  earnings: number;
  onTimePercentage: number;
  fuelEfficiency: number;
  avatar: string;
  vehicleNumber: string;
  joinDate: string;
  lastActive: string;
}

const driversData: Driver[] = [
  {
    id: 'DRV-001',
    name: 'Ahmed Hassan',
    phone: '+966 50 123 4567',
    email: 'ahmed@recyclehub.com',
    status: 'active',
    currentRoute: 'Route #12',
    completedTrips: 248,
    rating: 4.8,
    earnings: 12450,
    onTimePercentage: 96,
    fuelEfficiency: 8.5,
    avatar: 'AH',
    vehicleNumber: 'VEH-101',
    joinDate: '2025-01-15',
    lastActive: '2 mins ago',
  },
  {
    id: 'DRV-002',
    name: 'Mohammed Ali',
    phone: '+966 55 234 5678',
    email: 'mohammed@recyclehub.com',
    status: 'active',
    currentRoute: 'Route #8',
    completedTrips: 312,
    rating: 4.9,
    earnings: 15680,
    onTimePercentage: 98,
    fuelEfficiency: 9.2,
    avatar: 'MA',
    vehicleNumber: 'VEH-102',
    joinDate: '2024-11-20',
    lastActive: '5 mins ago',
  },
  {
    id: 'DRV-003',
    name: 'Khalid Ibrahim',
    phone: '+966 54 345 6789',
    email: 'khalid@recyclehub.com',
    status: 'available',
    currentRoute: '-',
    completedTrips: 189,
    rating: 4.6,
    earnings: 9850,
    onTimePercentage: 92,
    fuelEfficiency: 7.8,
    avatar: 'KI',
    vehicleNumber: 'VEH-103',
    joinDate: '2025-02-10',
    lastActive: '10 mins ago',
  },
  {
    id: 'DRV-004',
    name: 'Fahad Yousef',
    phone: '+966 56 456 7890',
    email: 'fahad@recyclehub.com',
    status: 'inactive',
    currentRoute: '-',
    completedTrips: 156,
    rating: 4.4,
    earnings: 7920,
    onTimePercentage: 88,
    fuelEfficiency: 7.2,
    avatar: 'FY',
    vehicleNumber: 'VEH-104',
    joinDate: '2025-03-01',
    lastActive: '2 hours ago',
  },
  {
    id: 'DRV-005',
    name: 'Omar Abdullah',
    phone: '+966 53 567 8901',
    email: 'omar@recyclehub.com',
    status: 'on-leave',
    currentRoute: '-',
    completedTrips: 203,
    rating: 4.7,
    earnings: 10540,
    onTimePercentage: 94,
    fuelEfficiency: 8.1,
    avatar: 'OA',
    vehicleNumber: 'VEH-105',
    joinDate: '2025-01-05',
    lastActive: '3 days ago',
  },
];

export default function Drivers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | DriverStatus>('all');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  const getStatusColor = (status: DriverStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'available':
        return 'bg-blue-100 text-blue-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      case 'on-leave':
        return 'bg-orange-100 text-orange-700';
    }
  };

  const getStatusDot = (status: DriverStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-600';
      case 'available':
        return 'bg-blue-600';
      case 'inactive':
        return 'bg-gray-600';
      case 'on-leave':
        return 'bg-orange-600';
    }
  };

  const filteredDrivers = driversData.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          driver.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || driver.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeDrivers = driversData.filter(d => d.status === 'active').length;
  const avgRating = (driversData.reduce((sum, d) => sum + d.rating, 0) / driversData.length).toFixed(1);
  const totalEarnings = driversData.reduce((sum, d) => sum + d.earnings, 0);
  const totalTrips = driversData.reduce((sum, d) => sum + d.completedTrips, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Drivers Management</h1>
          <p className="text-gray-600 mt-1">Manage collection drivers and assignments</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add Driver
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          {
            label: 'Total Drivers',
            value: driversData.length,
            icon: Users,
            color: 'green',
            subtitle: `${activeDrivers} active now`,
          },
          {
            label: 'Average Rating',
            value: avgRating,
            icon: Star,
            color: 'blue',
            subtitle: 'Out of 5.0',
          },
          {
            label: 'Total Trips',
            value: totalTrips,
            icon: Package,
            color: 'purple',
            subtitle: 'All time',
          },
          {
            label: 'Total Earnings',
            value: `$${(totalEarnings / 1000).toFixed(1)}k`,
            icon: DollarSign,
            color: 'orange',
            subtitle: 'This month',
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          const colorMap: Record<string, string> = {
            green: 'bg-green-100 text-green-600',
            blue: 'bg-blue-100 text-blue-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600',
          };

          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorMap[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-2">{stat.subtitle}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="available">Available</option>
          <option value="inactive">Inactive</option>
          <option value="on-leave">On Leave</option>
        </select>
      </motion.div>

      {/* Drivers Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredDrivers.map((driver, index) => (
          <motion.div
            key={driver.id}
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            {/* Driver Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg relative">
                  {driver.avatar}
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusDot(driver.status)}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                  <p className="text-sm text-gray-500">{driver.id}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              <span className={`px-3 py-1 text-xs rounded-full font-medium inline-flex items-center gap-1 ${getStatusColor(driver.status)}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${getStatusDot(driver.status)}`} />
                <span className="capitalize">{driver.status.replace('-', ' ')}</span>
              </span>
            </div>

            {/* Driver Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="w-4 h-4 text-gray-400" />
                {driver.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Mail className="w-4 h-4 text-gray-400" />
                {driver.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Truck className="w-4 h-4 text-gray-400" />
                {driver.vehicleNumber}
              </div>
              {driver.currentRoute !== '-' && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {driver.currentRoute}
                </div>
              )}
            </div>

            {/* Driver Stats (Trips & Earnings) */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-medium mb-1">Total Trips</p>
                <p className="text-lg font-black text-gray-900">{driver.completedTrips}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-medium mb-1">Total Earnings</p>
                <p className="text-lg font-black text-gray-900">${(driver.earnings / 1000).toFixed(1)}k</p>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-3 mb-4 pt-4 border-t border-gray-100">
              <div className="text-center group-hover:scale-105 transition-transform">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">On-Time</p>
                <p className="text-sm font-black text-emerald-600">{driver.onTimePercentage}%</p>
              </div>
              <div className="text-center border-x border-gray-100 group-hover:scale-105 transition-transform">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Rating</p>
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <p className="text-sm font-black text-gray-900">{driver.rating}</p>
                </div>
              </div>
              <div className="text-center group-hover:scale-105 transition-transform">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Fuel Eff.</p>
                <p className="text-sm font-black text-blue-600">{driver.fuelEfficiency} <span className="text-[10px] font-medium opacity-70">km/L</span></p>
              </div>
            </div>

            {/* Last Active */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {driver.lastActive}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Joined {driver.joinDate}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                View Details
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Performance Leaderboard */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
            <p className="text-sm text-gray-600 mt-1">This month's best drivers</p>
          </div>
          <Award className="w-6 h-6 text-yellow-500" />
        </div>

        <div className="space-y-4">
          {driversData
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5)
            .map((driver, index) => (
              <motion.div
                key={driver.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {driver.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{driver.name}</p>
                    <p className="text-sm text-gray-500">{driver.completedTrips} trips completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{driver.rating}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${driver.earnings.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">earnings</p>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </motion.div>
    </div>
  );
}