import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MapPin, 
  Clock, 
  Package, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Navigation, 
  Filter, 
  Search,
  Bell,
  Zap,
  MoreVertical,
  ChevronRight,
  Flame,
  UserPlus
} from 'lucide-react';
import { useRole } from '@/app/contexts/RoleContext';
import { ScrollReveal } from '@/app/components/ScrollReveal';
import { notify } from '@/app/utils/notifications';

const mockRequests = [
  { id: 'REQ-101', citizen: 'John Doe', location: '123 Nile St, Downtown', bottles: 45, priority: 'High', status: 'Pending', time: '5m ago' },
  { id: 'REQ-102', citizen: 'Sarah J.', location: '45 Garden City', bottles: 120, priority: 'Critical', status: 'Pending', time: '12m ago' },
  { id: 'REQ-103', citizen: 'Mike Tyson', location: 'Industrial Zone B', bottles: 300, priority: 'High', status: 'Assigned', driver: 'Ahmed K.', time: '20m ago' },
  { id: 'REQ-104', citizen: 'Ali Ahmed', location: 'Maadi Hub 5', bottles: 60, priority: 'Normal', status: 'Pending', time: '45m ago' },
];

const availableDrivers = [
  { id: 'D-01', name: 'Ahmed Kamal', vehicle: 'Small Truck', status: 'On Route', load: '65%' },
  { id: 'D-02', name: 'Sarah Wilson', vehicle: 'Motorcycle', status: 'Available', load: '0%' },
  { id: 'D-03', name: 'Zainab Ali', vehicle: 'TukTuk', status: 'Available', load: '12%' },
];

export default function PickupRequests() {
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState<'pending' | 'assigned' | 'completed'>('pending');
  const [selectedReq, setSelectedReq] = useState<typeof mockRequests[0] | null>(null);

  const handleAssign = (driverName: string) => {
    notify.success('Request Assigned', `Request ${selectedReq?.id} assigned to ${driverName} successfully.`);
    setSelectedReq(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Pickup <span className="text-rose-600">Requests</span></h1>
          <p className="text-gray-500 font-medium">Coordinate citizen requests and optimize driver assignments</p>
        </div>
        
        <div className="flex items-center bg-white dark:bg-gray-900 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          {(['pending', 'assigned', 'completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Requests List */}
        <div className="lg:col-span-2 space-y-4">
          <ScrollReveal direction="right" once={false}>
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl border border-gray-50 dark:border-gray-800 overflow-hidden">
              <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-rose-500" /> Recent Requests
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input type="text" placeholder="Search requests..." className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-[10px] font-bold outline-none w-[200px]" />
                </div>
              </div>

              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {mockRequests.filter(r => r.status.toLowerCase() === activeTab).map((req, i) => (
                  <motion.div
                    key={req.id}
                    whileHover={{ x: 5 }}
                    onClick={() => setSelectedReq(req)}
                    className={`p-6 flex items-center justify-between group cursor-pointer transition-all ${
                      selectedReq?.id === req.id ? 'bg-rose-50/50 dark:bg-rose-900/10' : 'hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        req.priority === 'Critical' ? 'bg-red-100 text-red-600 animate-pulse' :
                        req.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <Flame className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-black text-gray-900 dark:text-white">{req.citizen}</h3>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                            req.priority === 'Critical' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'
                          }`}>{req.priority}</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {req.location}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900 dark:text-white">{req.bottles} Bottles</p>
                      <p className="text-[10px] font-bold text-gray-400">{req.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Action Panel / Driver Selection */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {selectedReq ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl border-2 border-rose-500/20"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Assignment</h3>
                  <button onClick={() => setSelectedReq(null)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><XCircle className="w-5 h-5 text-gray-400" /></button>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl mb-8">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Request Data</p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-sm">
                        <Users className="w-5 h-5 text-rose-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">{selectedReq.citizen}</p>
                        <p className="text-[10px] text-gray-400">Citizen Profile</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-sm">
                        <MapPin className="w-5 h-5 text-rose-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">{selectedReq.location}</p>
                        <p className="text-[10px] text-gray-400">Target Location</p>
                      </div>
                    </div>
                  </div>
                </div>

                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Available Drivers Near Zone</h4>
                <div className="space-y-3">
                  {availableDrivers.map(driver => (
                    <motion.div
                      key={driver.id}
                      whileHover={{ scale: 1.02, x: 5 }}
                      onClick={() => handleAssign(driver.name)}
                      className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl cursor-pointer hover:border-rose-500 transition-all flex items-center justify-between group shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                          <Truck className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{driver.name}</p>
                          <p className="text-[10px] text-gray-400">{driver.vehicle} • {driver.load} Load</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-rose-500 transition-colors" />
                    </motion.div>
                  ))}
                </div>

                <button className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10">
                  Auto-Assign (AI Best Match)
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 h-full flex flex-col items-center justify-center"
              >
                <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <UserPlus className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Select a Request</h3>
                <p className="text-sm text-gray-500">Click on a request from the list to manage assignment or auto-calculate the best route.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
