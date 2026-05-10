import { useState, useEffect } from 'react';
import { X, Navigation, Clock, Target, Zap } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

export interface RouteData {
  id: string;
  name: string;
  driver: string;
  vehicle: string;
  status: string;
  priority: string;
  stops: number;
  completedStops: number;
  distance: string;
  estimatedTime: string;
  collectionPoints: number;
  startTime: string;
  endTime: string;
  efficiency: number;
}

interface Props {
  routes: RouteData[];
  onClose: () => void;
}

// Helper to parse "18.5 km" -> 18.5
const parseDistance = (dist: string) => parseFloat(dist.replace(/[^\d.-]/g, '')) || 0;

// Helper to parse "3h 45m" -> minutes
const parseTime = (time: string) => {
  const hMatch = time.match(/(\d+)h/);
  const mMatch = time.match(/(\d+)m/);
  const h = hMatch ? parseInt(hMatch[1], 10) : 0;
  const m = mMatch ? parseInt(mMatch[1], 10) : 0;
  return (h * 60) + m;
};

export default function RouteComparisonModal({ routes, onClose }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!routes || routes.length === 0) return null;

  // Colors for each route
  const colors = ["#8b5cf6", "#10b981", "#f59e0b", "#3b82f6", "#ec4899"];

  // Bar Chart Data (Distance & Time & Stops)
  const barData = routes.map((r) => ({
    name: r.id,
    distance: parseDistance(r.distance),
    time: parseTime(r.estimatedTime),
    stops: r.stops,
    label: r.name
  }));

  // Radar Chart Data (Normalized 0-100 for comparison)
  const maxDistance = Math.max(...barData.map(d => d.distance)) || 1;
  const maxTime = Math.max(...barData.map(d => d.time)) || 1;
  const maxStops = Math.max(...barData.map(d => d.stops)) || 1;

  const radarDataArr = [
    { subject: 'Efficiency (%)', fullMark: 100 },
    { subject: 'Distance', fullMark: 100 },
    { subject: 'Est. Time', fullMark: 100 },
    { subject: 'Total Stops', fullMark: 100 },
    { subject: 'Collection Pts', fullMark: 100 },
  ];

  const maxPts = Math.max(...routes.map(r => r.collectionPoints)) || 1;

  const radarData = radarDataArr.map(metric => {
    const point = { subject: metric.subject } as any;
    routes.forEach((r, idx) => {
      const key = `route${idx}`;
      if (metric.subject === 'Efficiency (%)') {
        point[key] = r.efficiency;
      } else if (metric.subject === 'Distance') {
        point[key] = (parseDistance(r.distance) / maxDistance) * 100;
      } else if (metric.subject === 'Est. Time') {
        point[key] = (parseTime(r.estimatedTime) / maxTime) * 100;
      } else if (metric.subject === 'Total Stops') {
        point[key] = (r.stops / maxStops) * 100;
      } else if (metric.subject === 'Collection Pts') {
        point[key] = (r.collectionPoints / maxPts) * 100;
      }
    });
    return point;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-md">
      <div 
        className={`bg-white dark:bg-gray-900 w-full max-w-6xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800 transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 p-2 rounded-xl">
                <Target className="w-6 h-6" />
              </div>
              Route Comparison Dashboard
            </h2>
            <p className="text-gray-500 font-medium ml-12">Comparing {routes.length} selected routes to optimize fleet assignments</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Quick Summary Widgets */}
            {routes.slice(0, 4).map((route, i) => (
              <div key={route.id} className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
                <div 
                   className="absolute top-0 left-0 w-1.5 h-full" 
                   style={{ backgroundColor: colors[i % colors.length] }} 
                />
                <div className="flex items-center justify-between mb-4 pl-3">
                  <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 flex-1 pr-2">{route.name}</h3>
                  <span className="text-xs font-black px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {route.id}
                  </span>
                </div>
                
                <div className="space-y-3 pl-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1"><Zap className="w-4 h-4 text-amber-500"/> Efficiency:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{route.efficiency}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1"><Navigation className="w-4 h-4 text-blue-500"/> Distance:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{route.distance}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1"><Clock className="w-4 h-4 text-rose-500"/> Time:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{route.estimatedTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1"><Target className="w-4 h-4 text-emerald-500"/> Stops:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{route.stops}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Radar Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">Aggregate Performance (Normalized)</h3>
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    {routes.map((r, i) => (
                      <Radar
                        key={r.id}
                        name={r.id}
                        dataKey={`route${i}`}
                        stroke={colors[i % colors.length]}
                        fill={colors[i % colors.length]}
                        fillOpacity={0.3}
                      />
                    ))}
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
                * Values are normalized relative to the maximum observed across selected routes.
              </p>
            </div>

            {/* Bar Charts */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">Distance vs Time Correlation</h3>
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                    <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar yAxisId="left" dataKey="distance" name="Distance (km)" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
                    <Bar yAxisId="right" dataKey="time" name="Time (mins)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
