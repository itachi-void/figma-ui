'use client';

import { motion } from 'motion/react';
import { 
  UsersRound, 
  Search, 
  Filter, 
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Award,
  TrendingUp,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Star,
  Package,
  Coins,
  Activity,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

// Citizen Type
interface Citizen {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  bottlesRecycled: number;
  pointsEarned: number;
  rank: 'bronze' | 'silver' | 'gold' | 'platinum';
  status: 'active' | 'inactive';
  avatar: string;
  lastActivity: string;
}

// Mock Data
const mockCitizens: Citizen[] = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    phone: '+20 123 456 7890',
    location: 'Cairo, Egypt',
    joinDate: 'Jan 2024',
    bottlesRecycled: 1250,
    pointsEarned: 12500,
    rank: 'platinum',
    status: 'active',
    avatar: 'AH',
    lastActivity: '2 hours ago',
  },
  {
    id: '2',
    name: 'Sara Mohamed',
    email: 'sara.mohamed@email.com',
    phone: '+20 123 456 7891',
    location: 'Giza, Egypt',
    joinDate: 'Feb 2024',
    bottlesRecycled: 850,
    pointsEarned: 8500,
    rank: 'gold',
    status: 'active',
    avatar: 'SM',
    lastActivity: '5 hours ago',
  },
  {
    id: '3',
    name: 'Omar Ali',
    email: 'omar.ali@email.com',
    phone: '+20 123 456 7892',
    location: 'Alexandria, Egypt',
    joinDate: 'Mar 2024',
    bottlesRecycled: 450,
    pointsEarned: 4500,
    rank: 'silver',
    status: 'active',
    avatar: 'OA',
    lastActivity: '1 day ago',
  },
  {
    id: '4',
    name: 'Fatma Ibrahim',
    email: 'fatma.ibrahim@email.com',
    phone: '+20 123 456 7893',
    location: 'Cairo, Egypt',
    joinDate: 'Apr 2024',
    bottlesRecycled: 180,
    pointsEarned: 1800,
    rank: 'bronze',
    status: 'active',
    avatar: 'FI',
    lastActivity: '3 days ago',
  },
  {
    id: '5',
    name: 'Khaled Mahmoud',
    email: 'khaled.mahmoud@email.com',
    phone: '+20 123 456 7894',
    location: 'Mansoura, Egypt',
    joinDate: 'May 2024',
    bottlesRecycled: 320,
    pointsEarned: 3200,
    rank: 'silver',
    status: 'inactive',
    avatar: 'KM',
    lastActivity: '2 weeks ago',
  },
];

// Stats Component
function CitizenStats() {
  const stats = [
    { 
      label: 'Total Citizens', 
      value: 5024, 
      change: '+12%', 
      icon: UsersRound, 
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-600',
    },
    { 
      label: 'Active Today', 
      value: 342, 
      change: '+8%', 
      icon: Activity, 
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-600',
    },
    { 
      label: 'Total Bottles', 
      value: 150234, 
      change: '+15%', 
      icon: Package, 
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-600',
    },
    { 
      label: 'Points Distributed', 
      value: 1502340, 
      change: '+20%', 
      icon: Coins, 
      color: 'from-orange-500 to-amber-500',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: index * 0.1, type: 'spring' }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="bg-white rounded-2xl p-6 shadow-lg relative overflow-hidden group cursor-pointer"
        >
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
          
          <div className="flex items-center justify-between mb-4">
            <motion.div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg relative overflow-hidden`}
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <stat.icon className="w-6 h-6 text-white relative z-10" />
            </motion.div>
            
            <motion.div
              className="flex items-center gap-1 text-emerald-600 text-sm font-semibold"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <TrendingUp className="w-4 h-4" />
              {stat.change}
            </motion.div>
          </div>

          <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
          <p className={`text-3xl font-bold ${stat.textColor}`}>
            {stat.value.toLocaleString()}
          </p>

          {/* Progress Bar */}
          <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${stat.color}`}
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ delay: index * 0.1 + 0.3, duration: 1 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Citizen Card Component
function CitizenCard({ citizen, index }: { citizen: Citizen; index: number }) {
  const [showMenu, setShowMenu] = useState(false);

  const rankConfig = {
    platinum: { 
      gradient: 'from-purple-500 to-pink-500', 
      bg: 'bg-purple-50', 
      text: 'text-purple-600',
      icon: '💎',
    },
    gold: { 
      gradient: 'from-yellow-500 to-orange-500', 
      bg: 'bg-yellow-50', 
      text: 'text-yellow-600',
      icon: '🏆',
    },
    silver: { 
      gradient: 'from-gray-400 to-gray-500', 
      bg: 'bg-gray-50', 
      text: 'text-gray-600',
      icon: '🥈',
    },
    bronze: { 
      gradient: 'from-orange-600 to-amber-700', 
      bg: 'bg-orange-50', 
      text: 'text-orange-700',
      icon: '🥉',
    },
  };

  const config = rankConfig[citizen.rank];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring' }}
      whileHover={{ scale: 1.01, y: -5 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative overflow-hidden group cursor-pointer"
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
      
      <div className="relative z-10">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <motion.div
            className={`w-16 h-16 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white font-bold text-xl shadow-lg relative overflow-hidden flex-shrink-0`}
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <span className="relative z-10">{citizen.avatar}</span>
          </motion.div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  {citizen.name}
                  {citizen.status === 'active' && (
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    </motion.div>
                  )}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} flex items-center gap-1`}>
                    <span>{config.icon}</span>
                    {citizen.rank.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    citizen.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {citizen.status.toUpperCase()}
                  </span>
                </div>
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
                    {[
                      { icon: Eye, label: 'View Profile' },
                      { icon: Edit, label: 'Edit Details' },
                      { icon: Award, label: 'Give Reward' },
                      { icon: Trash2, label: 'Remove', danger: true },
                    ].map((item, i) => (
                      <button
                        key={i}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 ${
                          item.danger ? 'text-red-600' : 'text-gray-700'
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

            {/* Contact Info */}
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="truncate">{citizen.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{citizen.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{citizen.location}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Package className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-xl font-bold text-purple-600">
                  {citizen.bottlesRecycled.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">Bottles</p>
              </div>
              <div className="text-center border-x border-gray-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Coins className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-xl font-bold text-amber-600">
                  {citizen.pointsEarned.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">Points</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Calendar className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-sm font-bold text-blue-600">{citizen.joinDate}</p>
                <p className="text-xs text-gray-600">Joined</p>
              </div>
            </div>

            {/* Last Activity */}
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Last active {citizen.lastActivity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Corner Decoration */}
      <motion.div
        className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${config.gradient} opacity-5 blur-2xl`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
}

export default function Citizens() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRank, setFilterRank] = useState<'all' | Citizen['rank']>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredCitizens = mockCitizens.filter((citizen) => {
    const matchesSearch = 
      citizen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      citizen.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      citizen.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRank = filterRank === 'all' || citizen.rank === filterRank;
    const matchesStatus = filterStatus === 'all' || citizen.status === filterStatus;
    
    return matchesSearch && matchesRank && matchesStatus;
  });

  return (
    <div className="space-y-8 relative">
      {/* Floating Orbs Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl opacity-10"
            style={{
              width: 300,
              height: 300,
              background: `linear-gradient(45deg, ${['#3B82F6', '#8B5CF6', '#10B981'][i]}, transparent)`,
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
              ease: 'linear',
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
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-8 h-8 text-blue-500" />
            Citizens Management
          </motion.h1>
          <motion.p
            className="text-gray-600 mt-2"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Manage citizen accounts and track their recycling activities
          </motion.p>
        </div>

        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Add Citizen
        </motion.button>
      </motion.div>

      {/* Stats */}
      <CitizenStats />

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search citizens by name, email, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            
            {/* Rank Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Rank:</span>
              {[
                { value: 'all', label: 'All', color: 'gray' },
                { value: 'platinum', label: '💎 Platinum', color: 'purple' },
                { value: 'gold', label: '🏆 Gold', color: 'yellow' },
                { value: 'silver', label: '🥈 Silver', color: 'gray' },
                { value: 'bronze', label: '🥉 Bronze', color: 'orange' },
              ].map((item) => (
                <motion.button
                  key={item.value}
                  onClick={() => setFilterRank(item.value as any)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                    filterRank === item.value
                      ? `bg-${item.color}-500 text-white shadow-lg`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            <div className="h-8 w-px bg-gray-300" />

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Status:</span>
              {[
                { value: 'all', label: 'All' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ].map((item) => (
                <motion.button
                  key={item.value}
                  onClick={() => setFilterStatus(item.value as any)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                    filterStatus === item.value
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Citizens Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCitizens.length > 0 ? (
          filteredCitizens.map((citizen, index) => (
            <CitizenCard key={citizen.id} citizen={citizen} index={index} />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full bg-white rounded-2xl p-12 text-center shadow-lg"
          >
            <UsersRound className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No citizens found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}