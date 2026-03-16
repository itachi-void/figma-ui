//
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
// استيراد أيقونات lucide-react (تأكد إنها مسطبة عندك)
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
} from "lucide-react";

// الخطوة دي سحرية عشان نشغل Leaflet في Next.js بدون أخطاء SSR
import dynamic from "next/dynamic";
const LiveMapView = dynamic(() => import("../../components/LiveMapView"), {
  ssr: false,
});

type RouteStatus = "active" | "completed" | "pending" | "cancelled";
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
  route?: [number, number][];
  currentPosition?: [number, number];
}

const routesData: RouteData[] = [
  // ... (نفس البيانات اللي في الكود بتاعك بالضبط بدون تغيير)
  {
    id: "RT-001",
    name: "Downtown Cairo Route",
    driver: "Ahmed Hassan",
    vehicle: "Mercedes Sprinter 2022",
    status: "active",
    priority: "high",
    stops: 15,
    completedStops: 8,
    distance: "12.3 km",
    estimatedTime: "1h 45m",
    collectionPoints: 45,
    startTime: "08:00",
    endTime: "11:45",
    efficiency: 92,
  },
];

export default function RoutesManagement() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  // ... (باقي الـ state زي ما هو في كودك)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Route Management</h1>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg ${viewMode === "list" ? "bg-white shadow-sm" : "text-gray-600"}`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 rounded-lg ${viewMode === "map" ? "bg-white shadow-sm" : "text-gray-600"}`}
            >
              Live Map
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* دي الليستة القديمة بتاعتك... */}
            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
              <h2 className="text-lg font-bold">Routes List</h2>
              <p className="text-gray-500">Total Routes: {routesData.length}</p>
              {/* كود عرض الكروت مكانه هنا */}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white p-4 rounded-xl shadow-sm"
          >
            {/* استدعاء المكون الجديد للخريطة */}
            <LiveMapView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
