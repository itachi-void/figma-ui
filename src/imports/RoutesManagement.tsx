"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Navigation,
  Truck,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Download,
  Route,
  TrendingUp,
  Play,
  StopCircle,
  Zap,
  Target,
  AlertTriangle,
  FileText,
  Calendar
} from "lucide-react";
import LiveMapView from "../../components/LiveMapView";
import { notify } from "../../utils/notifications";
import { useRole } from "@/app/contexts/RoleContext";
import RouteComparisonModal from "../../components/RouteComparisonModal";

type RouteStatus = "active" | "completed" | "pending" | "cancelled" | "delayed";
type RoutePriority = "high" | "medium" | "low";

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
}

const mockRoutes: RouteData[] = [
  {
    id: "RT-001",
    name: "Downtown Commercial Sector",
    driver: "Ahmed Hassan",
    vehicle: "Mercedes Sprinter EV (A-102)",
    status: "active",
    priority: "high",
    stops: 24,
    completedStops: 18,
    distance: "18.5 km",
    estimatedTime: "3h 45m",
    collectionPoints: 450,
    startTime: "07:00 AM",
    endTime: "10:45 AM",
    efficiency: 94,
  },
  {
    id: "RT-002",
    name: "North Suburbs Residential",
    driver: "Sara Mahmoud",
    vehicle: "Volvo FMX (B-205)",
    status: "completed",
    priority: "medium",
    stops: 45,
    completedStops: 45,
    distance: "32.1 km",
    estimatedTime: "5h 30m",
    collectionPoints: 890,
    startTime: "06:00 AM",
    endTime: "11:30 AM",
    efficiency: 98,
  },
  {
    id: "RT-003",
    name: "Industrial Park East",
    driver: "Mohamed Ali",
    vehicle: "Scania P-Series (C-304)",
    status: "delayed",
    priority: "high",
    stops: 15,
    completedStops: 4,
    distance: "22.4 km",
    estimatedTime: "4h 15m",
    collectionPoints: 1200,
    startTime: "09:00 AM",
    endTime: "01:15 PM",
    efficiency: 76,
  },
  {
    id: "RT-004",
    name: "Westside High-Rise District",
    driver: "Omar Khaled",
    vehicle: "Mercedes Sprinter EV (A-108)",
    status: "active",
    priority: "medium",
    stops: 12,
    completedStops: 2,
    distance: "8.5 km",
    estimatedTime: "2h 00m",
    collectionPoints: 310,
    startTime: "10:30 AM",
    endTime: "12:30 PM",
    efficiency: 88,
  },
  {
    id: "RT-005",
    name: "South Central Market",
    driver: "Unassigned",
    vehicle: "Pending",
    status: "pending",
    priority: "low",
    stops: 28,
    completedStops: 0,
    distance: "14.2 km",
    estimatedTime: "2h 45m",
    collectionPoints: 560,
    startTime: "01:00 PM",
    endTime: "03:45 PM",
    efficiency: 0,
  },
];

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
  completed: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800",
  pending: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700",
  delayed: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800",
  cancelled: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
};


export default function RoutesManagement() {
  const { role: currentRole } = useRole();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const toggleComparisonSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedForComparison(prev => 
      prev.includes(id) ? prev.filter(rId => rId !== id) : [...prev, id]
    );
  };

  const handleRouteAction = (action: string, routeName: string) => {
    if (action === "start") {
      notify.success("Route Started", `${routeName} has been initiated.`);
    } else if (action === "pause") {
      notify.warning("Route Paused", `${routeName} is currently on hold.`);
    } else if (action === "alert") {
      notify.critical("Route Alert", `Immediate attention required for ${routeName}`, "View Details");
    } else if (action === "complete") {
      notify.success("Route Completed", `${routeName} has been finished successfully.`);
    }
  };

  const filteredRoutes = mockRoutes.filter((route) => {
    // If the user is a driver, only show their specific route. For demo, we assume the driver is "Ahmed Hassan".
    if (currentRole === 'driver' && route.driver !== "Ahmed Hassan") {
      return false;
    }

    const matchesSearch = route.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          route.driver.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || route.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Route className="w-6 h-6 text-white" />
            </div>
            Active Routes
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track daily collection trajectories</p>
        </div>
        
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shadow-inner">
            <button
              onClick={() => setViewMode("list")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "list" 
                  ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" 
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                List View
              </div>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "map" 
                  ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" 
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Live Map
              </div>
            </button>
          </div>
          {(currentRole === 'admin' || currentRole === 'manager') && (
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              onClick={() => notify.info("Create Route", "The route creation wizard will open shortly.")}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Route</span>
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* KPI Cards - Only for Admin and Managers */}
            {(currentRole === 'admin' || currentRole === 'manager') && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                      <Truck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +2
                    </span>
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Routes</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">24</p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +15%
                    </span>
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Completed Today</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">14</p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +1
                    </span>
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Delayed Routes</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">3</p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                      94%
                    </span>
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Avg Fleet Efficiency</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">92%</p>
                </div>
              </div>
            )}

            {/* List Header Actions - Hidden for Driver */}
            {currentRole !== 'driver' && (
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search routes or drivers..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex w-full sm:w-auto items-center gap-3">
                  <select 
                    className="w-full sm:w-auto px-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm outline-none dark:text-white"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="delayed">Delayed</option>
                  </select>
                  {selectedForComparison.length >= 2 && (
                    <button 
                      onClick={() => setShowComparison(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl text-sm font-bold transition-colors shadow-sm"
                    >
                      <Target className="w-4 h-4" />
                      Compare ({selectedForComparison.length})
                    </button>
                  )}
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            )}

            {/* Routes List Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredRoutes.map((route) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -2 }}
                  className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {currentRole !== 'driver' && (
                            <div 
                              onClick={(e) => toggleComparisonSelection(route.id, e)}
                              className="relative cursor-pointer flex-shrink-0"
                            >
                              <div className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-colors shadow-sm ${selectedForComparison.includes(route.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}`}>
                                {selectedForComparison.includes(route.id) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                              </div>
                            </div>
                          )}
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{route.name}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyles[route.status]}`}>
                            {route.status}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 line-clamp-1">{route.id} • {route.driver}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {currentRole === 'driver' ? (
                        <>
                          <button onClick={() => handleRouteAction("start", route.name)} className="px-3 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center gap-1 shadow-sm">
                            <Play className="w-3.5 h-3.5" /> Start
                          </button>
                          <button onClick={() => handleRouteAction("complete", route.name)} className="px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1 shadow-sm">
                            <CheckCircle className="w-3.5 h-3.5" /> Finish
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleRouteAction("start", route.name)} className="p-2 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30 rounded-xl cursor-pointer">
                            <Play className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleRouteAction("pause", route.name)} className="p-2 text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/30 rounded-xl cursor-pointer">
                            <StopCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleRouteAction("alert", route.name)} className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-xl cursor-pointer">
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 flex items-center gap-1"><Truck className="w-3 h-3"/> Vehicle</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={route.vehicle}>{route.vehicle.split(" ")[0]}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Time</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{route.estimatedTime}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 flex items-center gap-1"><Navigation className="w-3 h-3"/> Distance</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{route.distance}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 flex items-center gap-1"><Zap className="w-3 h-3"/> Efficiency</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${route.efficiency > 90 ? 'bg-emerald-500' : route.efficiency > 75 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            style={{width: `${route.efficiency}%`}}
                          />
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{route.efficiency}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar for Stops */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{route.completedStops} / {route.stops} Stops Completed</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(route.completedStops / route.stops) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
              {/* Empty States based on Role */}
              {filteredRoutes.length === 0 && (
                currentRole === 'driver' ? (
                  <div className="col-span-1 xl:col-span-2 p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <Truck className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Routes Assigned Today</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                      You currently have no active deliveries or pickups. Take a rest or check with your manager!
                    </p>
                    <button className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800/80 font-medium transition-all flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      View Schedule
                    </button>
                  </div>
                ) : (
                  <div className="col-span-1 xl:col-span-2 p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 border-dashed">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Routes Found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your search query or status filter to find what you're looking for.</p>
                  </div>
                )
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="map"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-gray-900 p-2 md:p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 h-[calc(100vh-200px)] min-h-[600px] relative overflow-hidden"
          >
            <LiveMapView />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showComparison && (
          <RouteComparisonModal
            routes={mockRoutes.filter(r => selectedForComparison.includes(r.id))}
            onClose={() => setShowComparison(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
