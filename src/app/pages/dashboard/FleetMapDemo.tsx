import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Truck, Building2, Users, Info } from 'lucide-react';
import FleetMap from '@/app/components/maps/FleetMap';
import { useRole } from '@/app/contexts/RoleContext';
import { getMapDataForRole } from '@/app/data/mockMapData';
import { Driver, Route, Center, Community } from '@/app/components/maps/types';

export default function FleetMapDemo() {
  const { user } = useRole();
  const role = user?.role || 'admin';
  
  // Get filtered data based on role
  const { drivers, routes, centers, communities } = getMapDataForRole(role, user?.id);
  
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);

  const handleDriverClick = (driver: Driver) => {
    setSelectedDriver(driver);
    setSelectedRoute(null);
    setSelectedCenter(null);
    setSelectedCommunity(null);
  };

  const handleRouteClick = (route: Route) => {
    setSelectedRoute(route);
    setSelectedDriver(null);
    setSelectedCenter(null);
    setSelectedCommunity(null);
  };

  const handleCenterClick = (center: Center) => {
    setSelectedCenter(center);
    setSelectedDriver(null);
    setSelectedRoute(null);
    setSelectedCommunity(null);
  };

  const handleCommunityClick = (community: Community) => {
    setSelectedCommunity(community);
    setSelectedDriver(null);
    setSelectedRoute(null);
    setSelectedCenter(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <MapPin className="w-8 h-8" />
              Fleet & Operations Map
            </h1>
            <p className="text-emerald-50">
              Real-time tracking and route management for RecycleHub
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-xl px-6 py-3">
            <div className="text-sm text-emerald-100">Current Role</div>
            <div className="text-2xl font-bold capitalize">{role}</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {role !== 'citizen' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Truck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{drivers.length}</div>
                <div className="text-sm text-gray-600">Active Drivers</div>
              </div>
            </div>
          </motion.div>
        )}

        {role !== 'citizen' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-lg border border-blue-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{routes.length}</div>
                <div className="text-sm text-gray-600">Routes</div>
              </div>
            </div>
          </motion.div>
        )}

        {role !== 'citizen' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 shadow-lg border border-cyan-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <Building2 className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{centers.length}</div>
                <div className="text-sm text-gray-600">Centers</div>
              </div>
            </div>
          </motion.div>
        )}

        {role === 'citizen' || role === 'admin' || role === 'manager' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-4 shadow-lg border border-purple-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{communities.length}</div>
                <div className="text-sm text-gray-600">Communities</div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3"
      >
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-900">
          <p className="font-semibold mb-1">Interactive Map Features</p>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>Click on markers to view detailed information</li>
            <li>Use layer controls to toggle different data views</li>
            <li>Routes are calculated using real road networks via OSRM</li>
            <li>
              {role === 'driver' && 'You can only see your assigned route and vehicle'}
              {role === 'citizen' && 'Discover communities near you and join them'}
              {(role === 'admin' || role === 'manager') && 'You have access to all operational data'}
            </li>
          </ul>
        </div>
      </motion.div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Details Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-1 space-y-4"
        >
          {/* Selected Item Details */}
          {(selectedDriver || selectedRoute || selectedCenter || selectedCommunity) ? (
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-3">Details</h3>
              
              {selectedDriver && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <Truck size={20} />
                    <span className="font-semibold">Driver Information</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedDriver.name}</p>
                    <p><span className="font-medium">Status:</span> <span className="capitalize">{selectedDriver.status}</span></p>
                    <p><span className="font-medium">Load:</span> {selectedDriver.load}%</p>
                    {selectedDriver.vehicleType && (
                      <p><span className="font-medium">Vehicle:</span> {selectedDriver.vehicleType}</p>
                    )}
                    <div className="mt-3 pt-3 border-t">
                      <div className="bg-gray-100 rounded-lg p-2">
                        <div className="text-xs text-gray-600 mb-1">Load Progress</div>
                        <div className="w-full bg-gray-300 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                            style={{ width: `${selectedDriver.load}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedRoute && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <MapPin size={20} />
                    <span className="font-semibold">Route Information</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedRoute.name}</p>
                    <p><span className="font-medium">Status:</span> <span className="capitalize">{selectedRoute.status}</span></p>
                    <p><span className="font-medium">Stops:</span> {selectedRoute.stops.length}</p>
                    {selectedRoute.distance && (
                      <p><span className="font-medium">Distance:</span> {selectedRoute.distance} km</p>
                    )}
                    {selectedRoute.duration && (
                      <p><span className="font-medium">Duration:</span> {selectedRoute.duration} min</p>
                    )}
                  </div>
                </div>
              )}

              {selectedCenter && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-cyan-600 mb-2">
                    <Building2 size={20} />
                    <span className="font-semibold">Center Information</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedCenter.name}</p>
                    <p><span className="font-medium">Type:</span> <span className="capitalize">{selectedCenter.type}</span></p>
                    <p><span className="font-medium">Capacity:</span> {selectedCenter.currentLoad} / {selectedCenter.capacity}</p>
                    {selectedCenter.operatingHours && (
                      <p><span className="font-medium">Hours:</span> {selectedCenter.operatingHours}</p>
                    )}
                    <div className="mt-3 pt-3 border-t">
                      <div className="bg-gray-100 rounded-lg p-2">
                        <div className="text-xs text-gray-600 mb-1">Capacity Usage</div>
                        <div className="w-full bg-gray-300 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${(selectedCenter.currentLoad / selectedCenter.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedCommunity && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-600 mb-2">
                    <Users size={20} />
                    <span className="font-semibold">Community Information</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedCommunity.name}</p>
                    <p><span className="font-medium">Members:</span> {selectedCommunity.members}</p>
                    <p><span className="font-medium">Bottles:</span> {selectedCommunity.totalBottles.toLocaleString()}</p>
                    <p><span className="font-medium">Level:</span> {selectedCommunity.level}</p>
                    {selectedCommunity.isJoined && (
                      <div className="mt-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-semibold">
                        ✓ You are a member
                      </div>
                    )}
                    {!selectedCommunity.isJoined && role === 'citizen' && (
                      <button className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors">
                        Join Community
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Click on a marker to view details
              </p>
            </div>
          )}

          {/* Quick Actions */}
          {role === 'admin' && (
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <h3 className="font-bold text-sm mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  Optimize All Routes
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  Assign New Driver
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  View Analytics
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-3"
        >
          <FleetMap
            role={role}
            currentUserId={user?.id}
            center={[30.5000, 30.9500]}
            zoom={10}
            height="700px"
            drivers={drivers}
            routes={routes}
            centers={centers}
            communities={communities}
            onDriverClick={handleDriverClick}
            onRouteClick={handleRouteClick}
            onCenterClick={handleCenterClick}
            onCommunityClick={handleCommunityClick}
            theme="dark"
            showLayerControl={true}
            showLegend={true}
          />
        </motion.div>
      </div>
    </div>
  );
}
