'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Navigation,
  Truck,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Download,
  MoreVertical,
  Route,
  Users,
  TrendingUp,
  Play,
  StopCircle,
  Zap,
  Target,
  Activity,
  X,
} from 'lucide-react';
import { LiveMapView } from '../../components/LiveMapView';

type RouteStatus = 'active' | 'completed' | 'pending' | 'cancelled';
type RoutePriority = 'high' | 'medium' | 'low';

interface RouteData {
  id: string;
  name: string;
  driver: string;
  vehicle: string;
  status: RouteStatus;
  priority: RoutePriority;
  stops: number;
  completedStops: number;
  distance: string;
  estimatedTime: string;
  collectionPoints: number;
  startTime: string;
  endTime: string;
  efficiency: number;
  route?: [number, number][];
  currentPosition?: [number, number];
}

// Cairo Detailed Locations (Real Cairo streets and landmarks)
const cairoLocations = {
  // Downtown Cairo - Midan El-Tahrir Area
  "Tahrir Square": [30.0444, 31.2357] as [number, number],
  "Egyptian Museum": [30.0478, 31.2336] as [number, number],
  "Mogamma Building": [30.0450, 31.2345] as [number, number],
  "Cairo Opera House": [30.0420, 31.2235] as [number, number],
  
  // Ramsis Area
  "Ramsis Square": [30.0622, 31.2469] as [number, number],
  "Cairo Railway Station": [30.0630, 31.2480] as [number, number],
  
  // Zamalek - Gezira Island
  "Cairo Tower": [30.0458, 31.2243] as [number, number],
  "Zamalek Club": [30.0561, 31.2194] as [number, number],
  "26th July Street": [30.0570, 31.2175] as [number, number],
  
  // Heliopolis
  "Heliopolis Square": [30.0961, 31.3306] as [number, number],
  "Merghany Street": [30.0920, 31.3280] as [number, number],
  
  // Nasr City
  "Abbas El-Akkad Street": [30.0620, 31.3350] as [number, number],
  "Makram Ebeid Street": [30.0720, 31.3280] as [number, number],
  
  // Maadi
  "Road 9": [29.9650, 31.2620] as [number, number],
  "Road 233": [29.9680, 31.2600] as [number, number],
  "Corniche El-Maadi": [29.9600, 31.2600] as [number, number],
  
  // Giza
  "Giza Square": [30.0131, 31.2089] as [number, number],
  "Pyramids Road": [30.0250, 31.1950] as [number, number],
  "Faisal Street": [30.0220, 31.2000] as [number, number],
  
  // Dokki
  "Dokki Square": [30.0400, 31.2150] as [number, number],
  "Mohandeseen": [30.0530, 31.2000] as [number, number],
};

// Define route paths (simulated GPS coordinates for Cairo routes)
const routePaths = {
  'RT-001': [
    cairoLocations["Tahrir Square"],
    [30.0450, 31.2370],
    [30.0470, 31.2390],
    [30.0490, 31.2410],
    cairoLocations["Egyptian Museum"],
    [30.0500, 31.2450],
    cairoLocations["Ramsis Square"],
  ] as [number, number][],
  'RT-002': [
    cairoLocations["Zamalek Club"],
    cairoLocations["26th July Street"],
    cairoLocations["Cairo Tower"],
    [30.0480, 31.2260],
    cairoLocations["Cairo Opera House"],
  ] as [number, number][],
  'RT-003': [
    cairoLocations["Abbas El-Akkad Street"],
    [30.0650, 31.3360],
    [30.0680, 31.3320],
    cairoLocations["Makram Ebeid Street"],
    [30.0750, 31.3300],
  ] as [number, number][],
  'RT-004': [
    cairoLocations["Road 9"],
    cairoLocations["Road 233"],
    [29.9670, 31.2610],
    cairoLocations["Corniche El-Maadi"],
  ] as [number, number][],
  'RT-005': [
    cairoLocations["Giza Square"],
    cairoLocations["Faisal Street"],
    [30.0235, 31.1975],
    cairoLocations["Pyramids Road"],
  ] as [number, number][],
  'RT-006': [
    cairoLocations["Dokki Square"],
    [30.0465, 31.2125],
    cairoLocations["Mohandeseen"],
    [30.0545, 31.1975],
  ] as [number, number][],
};

const routesData: RouteData[] = [
  {
    id: 'RT-001',
    name: 'Downtown Cairo Route',
    driver: 'Ahmed Hassan',
    vehicle: 'Mercedes Sprinter 2022',
    status: 'active',
    priority: 'high',
    stops: 15,
    completedStops: 8,
    distance: '12.3 km',
    estimatedTime: '1h 45m',
    collectionPoints: 45,
    startTime: '08:00',
    endTime: '11:45',
    efficiency: 92,
    route: routePaths['RT-001'],
    currentPosition: [30.0470, 31.2390],
  },
  {
    id: 'RT-002',
    name: 'Zamalek & Cairo Tower',
    driver: 'Mohamed Ali',
    vehicle: 'Ford Transit 2021',
    status: 'active',
    priority: 'medium',
    stops: 12,
    completedStops: 10,
    distance: '8.5 km',
    estimatedTime: '1h 20m',
    collectionPoints: 36,
    startTime: '09:00',
    endTime: '12:20',
    efficiency: 88,
    route: routePaths['RT-002'],
    currentPosition: cairoLocations["Cairo Tower"],
  },
  {
    id: 'RT-003',
    name: 'Nasr City - Abbas El-Akkad',
    driver: 'Omar Khaled',
    vehicle: 'Volkswagen Crafter 2023',
    status: 'pending',
    priority: 'low',
    stops: 10,
    completedStops: 0,
    distance: '14.2 km',
    estimatedTime: '2h 00m',
    collectionPoints: 30,
    startTime: '14:00',
    endTime: '17:00',
    efficiency: 0,
    route: routePaths['RT-003'],
    currentPosition: cairoLocations["Abbas El-Akkad Street"],
  },
  {
    id: 'RT-004',
    name: 'Maadi - Road 9 & 233',
    driver: 'Youssef Mahmoud',
    vehicle: 'Renault Master 2020',
    status: 'completed',
    priority: 'medium',
    stops: 18,
    completedStops: 18,
    distance: '10.8 km',
    estimatedTime: '1h 30m',
    collectionPoints: 54,
    startTime: '07:30',
    endTime: '10:00',
    efficiency: 95,
    route: routePaths['RT-004'],
  },
  {
    id: 'RT-005',
    name: 'Giza - Pyramids Road',
    driver: 'Karim Said',
    vehicle: 'Toyota Hiace 2021',
    status: 'cancelled',
    priority: 'high',
    stops: 8,
    completedStops: 0,
    distance: '16.5 km',
    estimatedTime: '2h 15m',
    collectionPoints: 24,
    startTime: '10:00',
    endTime: '13:15',
    efficiency: 0,
    route: routePaths['RT-005'],
  },
  {
    id: 'RT-006',
    name: 'Dokki & Mohandeseen',
    driver: 'Hassan Ibrahim',
    vehicle: 'Peugeot Boxer 2022',
    status: 'pending',
    priority: 'medium',
    stops: 14,
    completedStops: 0,
    distance: '11.2 km',
    estimatedTime: '1h 40m',
    collectionPoints: 42,
    startTime: '15:00',
    endTime: '17:40',
    efficiency: 0,
    route: routePaths['RT-006'],
  },
];

// Collection points based on real Cairo locations
const collectionPoints = [
  { id: 1, name: 'Tahrir Square Center', lat: 30.0444, lng: 31.2357, status: 'completed' },
  { id: 2, name: 'Egyptian Museum Gate', lat: 30.0478, lng: 31.2336, status: 'completed' },
  { id: 3, name: 'Ramsis Station Hub', lat: 30.0622, lng: 31.2469, status: 'active' },
  { id: 4, name: 'Zamalek Club Area', lat: 30.0561, lng: 31.2194, status: 'active' },
  { id: 5, name: 'Cairo Tower Plaza', lat: 30.0458, lng: 31.2243, status: 'pending' },
  { id: 6, name: 'Abbas El-Akkad Commercial', lat: 30.0620, lng: 31.3350, status: 'pending' },
  { id: 7, name: 'Maadi Road 9 Center', lat: 29.9650, lng: 31.2620, status: 'completed' },
  { id: 8, name: 'Giza Square Station', lat: 30.0131, lng: 31.2089, status: 'pending' },
  { id: 9, name: 'Dokki Square Plaza', lat: 30.0400, lng: 31.2150, status: 'active' },
  { id: 10, name: 'Heliopolis Market', lat: 30.0961, lng: 31.3306, status: 'pending' },
];

export default function RoutesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | RouteStatus>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | RoutePriority>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

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

  const getStatusColor = (status: RouteStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
    }
  };

  const getStatusIcon = (status: RouteStatus) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <StopCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: RoutePriority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
    }
  };

  const filteredRoutes = routesData.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          route.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || route.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || route.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const activeRoutes = routesData.filter(r => r.status === 'active').length;
  const totalStops = routesData.reduce((sum, r) => sum + r.stops, 0);
  const completedStops = routesData.reduce((sum, r) => sum + r.completedStops, 0);
  const avgEfficiency = Math.round(routesData.filter(r => r.efficiency > 0).reduce((sum, r) => sum + r.efficiency, 0) / routesData.filter(r => r.efficiency > 0).length);

  const handleViewDetails = (route: RouteData) => {
    setSelectedRoute(route);
    setShowDetailsDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Route Management</h1>
          <p className="text-gray-600 mt-1">Plan and monitor collection routes with live tracking</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              List
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'map' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              Live Map
            </motion.button>
          </div>
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
            New Route
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
            label: 'Active Routes',
            value: activeRoutes,
            icon: Navigation,
            color: 'green',
            subtitle: `${routesData.length} total routes`,
          },
          {
            label: 'Collection Points',
            value: totalStops,
            icon: MapPin,
            color: 'blue',
            subtitle: `${completedStops} completed`,
          },
          {
            label: 'Avg Efficiency',
            value: `${avgEfficiency}%`,
            icon: Target,
            color: 'purple',
            subtitle: 'Performance metric',
          },
          {
            label: 'Total Distance',
            value: '103.5 km',
            icon: Route,
            color: 'orange',
            subtitle: 'Today',
          },
        ].map((stat) => {
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
            placeholder="Search routes..."
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
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </motion.div>

      {/* View Toggle */}
      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filteredRoutes.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <Navigation className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium capitalize ${getPriorityColor(route.priority)}`}>
                          {route.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{route.id}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Users className="w-4 h-4 text-gray-400" />
                          {route.driver}
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Truck className="w-4 h-4 text-gray-400" />
                          {route.vehicle}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium inline-flex items-center gap-1 ${getStatusColor(route.status)}`}>
                      {getStatusIcon(route.status)}
                      <span className="capitalize">{route.status}</span>
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Stops</p>
                    <p className="text-lg font-bold text-gray-900">{route.completedStops}/{route.stops}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Distance</p>
                    <p className="text-lg font-bold text-gray-900">{route.distance}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Est. Time</p>
                    <p className="text-lg font-bold text-gray-900">{route.estimatedTime}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Points</p>
                    <p className="text-lg font-bold text-gray-900">{route.collectionPoints}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {route.startTime} - {route.endTime}
                    </div>
                    {route.efficiency > 0 && (
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        {route.efficiency}% efficiency
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {route.status === 'active' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setViewMode('map')}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        Track Live
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewDetails(route)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>

                {/* Progress Bar */}
                {route.status === 'active' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Route Progress</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {Math.round((route.completedStops / route.stops) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(route.completedStops / route.stops) * 100}%` }}
                        transition={{ duration: 1 }}
                        className="h-2 rounded-full bg-green-600"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            {/* Real Map with Live Simulation */}
            <LiveMapView
              routesData={routesData}
              collectionPoints={collectionPoints}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Route Details Dialog */}
      <AnimatePresence>
        {showDetailsDialog && selectedRoute && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailsDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedRoute.name}</h2>
                    <p className="text-green-100 text-sm">{selectedRoute.id}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowDetailsDialog(false)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Status & Priority */}
                <div className="flex gap-4">
                  <div className={`flex-1 p-4 rounded-lg ${getStatusColor(selectedRoute.status)}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(selectedRoute.status)}
                      <p className="text-sm font-medium">Status</p>
                    </div>
                    <p className="text-2xl font-bold capitalize">{selectedRoute.status}</p>
                  </div>
                  <div className={`flex-1 p-4 rounded-lg ${getPriorityColor(selectedRoute.priority)}`}>
                    <p className="text-sm font-medium mb-1">Priority</p>
                    <p className="text-2xl font-bold capitalize">{selectedRoute.priority}</p>
                  </div>
                </div>

                {/* Driver & Vehicle Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-gray-600" />
                      <p className="font-semibold text-gray-900">Driver</p>
                    </div>
                    <p className="text-lg text-gray-700">{selectedRoute.driver}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-5 h-5 text-gray-600" />
                      <p className="font-semibold text-gray-900">Vehicle</p>
                    </div>
                    <p className="text-lg text-gray-700">{selectedRoute.vehicle}</p>
                  </div>
                </div>

                {/* Route Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 mb-1">Total Stops</p>
                    <p className="text-2xl font-bold text-blue-900">{selectedRoute.stops}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-green-900">{selectedRoute.completedStops}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-700 mb-1">Distance</p>
                    <p className="text-2xl font-bold text-purple-900">{selectedRoute.distance}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-700 mb-1">Est. Time</p>
                    <p className="text-2xl font-bold text-orange-900">{selectedRoute.estimatedTime}</p>
                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <p className="font-semibold text-gray-900">Schedule</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Start Time</p>
                      <p className="text-lg font-bold text-gray-900">{selectedRoute.startTime}</p>
                    </div>
                    <div className="h-8 w-px bg-gray-300" />
                    <div>
                      <p className="text-sm text-gray-600">End Time</p>
                      <p className="text-lg font-bold text-gray-900">{selectedRoute.endTime}</p>
                    </div>
                  </div>
                </div>

                {/* Efficiency */}
                {selectedRoute.efficiency > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-600" />
                        <p className="font-semibold text-gray-900">Route Efficiency</p>
                      </div>
                      <p className="text-3xl font-bold text-green-600">{selectedRoute.efficiency}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedRoute.efficiency}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600"
                      />
                    </div>
                  </div>
                )}

                {/* Collection Points */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <p className="font-semibold text-gray-900">Collection Points</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{selectedRoute.collectionPoints} <span className="text-lg text-gray-600">points</span></p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Edit Route
                  </motion.button>
                  {selectedRoute.status === 'active' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowDetailsDialog(false);
                        setViewMode('map');
                      }}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-5 h-5" />
                      Track on Map
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Route Optimization Suggestions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            title: 'Route Optimization',
            description: 'AI-powered route suggestions',
            icon: Zap,
            color: 'yellow',
            value: '12% faster',
          },
          {
            title: 'Fuel Efficiency',
            description: 'Reduce fuel consumption',
            icon: TrendingUp,
            color: 'green',
            value: '18% savings',
          },
          {
            title: 'Time Savings',
            description: 'Optimize collection times',
            icon: Clock,
            color: 'blue',
            value: '45 min/day',
          },
        ].map((suggestion) => {
          const Icon = suggestion.icon;
          const colorMap: Record<string, { bg: string; text: string; border: string }> = {
            yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
            green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
            blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
          };

          return (
            <motion.div
              key={suggestion.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-xl border-2 ${colorMap[suggestion.color].bg} ${colorMap[suggestion.color].border}`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${colorMap[suggestion.color].text} bg-white mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{suggestion.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-2">{suggestion.value}</p>
              <p className="text-sm text-gray-600">{suggestion.description}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}