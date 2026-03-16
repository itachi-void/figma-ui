'use client';

import { motion } from 'motion/react';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Truck, 
  Settings, 
  Calendar,
  Tool,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { useState } from 'react';

// Mock Data
const vehicles = [
  { id: 'V-101', type: 'Small Truck', driver: 'Ahmed Kamal', status: 'Healthy', nextService: '12 May 2026', lastService: '12 Mar 2026', issues: 0, mileage: 45000 },
  { id: 'V-102', type: 'Garbage Truck', driver: 'Mohamed Ali', status: 'Needs Maintenance', nextService: '15 Mar 2026', lastService: '10 Jan 2026', issues: 2, mileage: 82000 },
  { id: 'V-103', type: 'Motorcycle', driver: 'Sarah Wilson', status: 'In Repair', nextService: 'N/A', lastService: '14 Mar 2026', issues: 1, mileage: 12000 },
  { id: 'V-104', type: 'TukTuk', driver: 'Zainab Ali', status: 'Healthy', nextService: '20 Jul 2026', lastService: '20 Jan 2026', issues: 0, mileage: 3400 },
];

export default function FleetMaintenance() {
  const [activeTab, setActiveTab] = useState('all');

  // Stats calculate
  const totalVehicles = vehicles.length;
  const healthyCount = vehicles.filter(v => v.status === 'Healthy').length;
  const maintenanceCount = vehicles.filter(v => v.status === 'Needs Maintenance').length;
  const repairingCount = vehicles.filter(v => v.status === 'In Repair').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-black text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600 flex items-center gap-3">
            <Wrench className="w-8 h-8 text-orange-500" />
            Fleet Maintenance
          </h1>
          <p className="text-gray-600 mt-2 font-medium">Tracking vehicle health, mileage, and scheduled services</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Log Maintenance
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Fleet" value={totalVehicles} icon={Truck} color="text-blue-600" bg="bg-blue-100" />
        <StatCard title="Healthy" value={healthyCount} icon={CheckCircle} color="text-emerald-600" bg="bg-emerald-100" />
        <StatCard title="Needs Service" value={maintenanceCount} icon={AlertTriangle} color="text-amber-600" bg="bg-amber-100" />
        <StatCard title="In Repair" value={repairingCount} icon={Settings} color="text-red-600" bg="bg-red-100" />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex gap-2 p-1 bg-gray-50 rounded-xl">
             {['all', 'healthy', 'needs service', 'in repair'].map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                   activeTab === tab ? 'bg-orange-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'
                 }`}
               >
                 {tab}
               </button>
             ))}
          </div>

          <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <input type="text" placeholder="Search vehicle ID..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Vehicle</th>
                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Driver</th>
                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Mileage</th>
                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Next Service</th>
                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vehicles.filter(v => activeTab === 'all' || v.status.toLowerCase() === activeTab).map((vehicle, idx) => (
                <motion.tr 
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group hover:bg-orange-50/30 transition-colors"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Truck className="w-5 h-5 text-gray-600 focus:text-orange-500" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900">{vehicle.id}</p>
                        <p className="text-xs text-gray-500">{vehicle.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max ${
                      vehicle.status === 'Healthy' ? 'bg-emerald-100 text-emerald-700' : 
                      vehicle.status === 'Needs Maintenance' ? 'bg-amber-100 text-amber-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {vehicle.status === 'Healthy' && <CheckCircle className="w-3 h-3" />}
                      {vehicle.status === 'Needs Maintenance' && <AlertTriangle className="w-3 h-3" />}
                      {vehicle.status === 'In Repair' && <Wrench className="w-3 h-3" />}
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="py-4 font-bold text-gray-700">{vehicle.driver}</td>
                  <td className="py-4 text-gray-600 font-medium">{vehicle.mileage.toLocaleString()} km</td>
                  <td className="py-4">
                    <div className="flex items-center gap-1 text-gray-600 font-medium">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      {vehicle.nextService}
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <button className="px-4 py-2 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                      View Log
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-4 border-b-4 hover:border-orange-500 transition-colors"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-gray-500 font-medium text-sm">{title}</p>
        <p className="text-3xl font-black text-gray-900">{value}</p>
      </div>
    </motion.div>
  );
}
