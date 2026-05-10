import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "@/app/utils/leafletConfig";
import {
  Users,
  MapPin,
  Package,
  CircleCheck,
  CircleX,
  Truck,
  Filter,
  Search,
  Zap,
  ChevronRight,
  Flame,
  UserPlus,
} from "lucide-react";
import { useRole } from "@/app/contexts/RoleContext";
import { notify } from "@/app/utils/notifications";
import { usePickup, type PipelineFilter } from "@/app/contexts/PickupContext";
import { STATUS_PIPELINE, type RequestStatus, type PickupRequest } from "@/app/types/recyclehub";
import { AIValidationModal } from "@/app/components/AIValidationModal";
import { DriverAssignmentModal } from "@/app/components/DriverAssignmentModal";
import { LogisticsImpactBar } from "@/app/components/LogisticsImpactBar";
import { useDrivers } from "@/app/contexts/DriversContext";

const mockRequests = [
  {
    id: "REQ-101",
    citizen: "John Doe",
    location: "123 Nile St, Downtown",
    bottles: 45,
    priority: "High",
    status: "Pending",
    time: "5m ago",
    lat: 30.0444,
    lng: 31.2357,
  },
  {
    id: "REQ-102",
    citizen: "Sarah J.",
    location: "45 Garden City",
    bottles: 120,
    priority: "Critical",
    status: "Pending",
    time: "12m ago",
    lat: 30.0333,
    lng: 31.2333,
  },
  {
    id: "REQ-103",
    citizen: "Mike Tyson",
    location: "Industrial Zone B",
    bottles: 300,
    priority: "High",
    status: "Assigned",
    driver: "Ahmed K.",
    time: "20m ago",
    lat: 30.05,
    lng: 31.2,
  },
  {
    id: "REQ-104",
    citizen: "Ali Ahmed",
    location: "Maadi Hub 5",
    bottles: 60,
    priority: "Normal",
    status: "Pending",
    time: "45m ago",
    lat: 29.9667,
    lng: 31.25,
  },
];

const availableDrivers = [
  {
    id: "D-01",
    name: "Ahmed Kamal",
    vehicle: "Small Truck",
    status: "On Route",
    load: 65,
    fuel: 40,
    lat: 30.04,
    lng: 31.24,
  },
  {
    id: "D-02",
    name: "Sarah Wilson",
    vehicle: "Motorcycle",
    status: "Available",
    load: 0,
    fuel: 85,
    lat: 30.045,
    lng: 31.23,
  },
  {
    id: "D-03",
    name: "Zainab Ali",
    vehicle: "TukTuk",
    status: "Available",
    load: 12,
    fuel: 15,
    lat: 30.035,
    lng: 31.25,
  }, // Low fuel
  {
    id: "D-04",
    name: "Omar Sayed",
    vehicle: "Large Truck",
    status: "Available",
    load: 90,
    fuel: 60,
    lat: 30.042,
    lng: 31.238,
  }, // High load
  {
    id: "D-05",
    name: "Fatima N.",
    vehicle: "Van",
    status: "Available",
    load: 30,
    fuel: 75,
    lat: 30.048,
    lng: 31.237,
  },
];

export default function PickupRequests() {
  const { role } = useRole();
  const {
    filterStatus,
    setFilterStatus,
    statusCounts,
    filteredRequests: pipelineRequests,
    updateRequestStatus,
  } = usePickup();
  const { getDriverById } = useDrivers();
  const [activeTab, setActiveTab] = useState<
    "pending" | "assigned" | "completed"
  >("pending");
  const [selectedReq, setSelectedReq] = useState<
    (typeof mockRequests)[0] | null
  >(null);
  const [viewMode, setViewMode] = useState<"list" | "map">(
    "list",
  );
  const [selectedRequests, setSelectedRequests] = useState<
    string[]
  >([]);
  const [filterPriority, setFilterPriority] =
    useState<string>("All");
  const [filterZone, setFilterZone] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [validatingRequest, setValidatingRequest] = useState<PickupRequest | null>(null);
  const [assigningRequest, setAssigningRequest] = useState<PickupRequest | null>(null);

  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRequests((prev) =>
      prev.includes(id)
        ? prev.filter((rId) => rId !== id)
        : [...prev, id],
    );
  };

  const toggleAll = () => {
    const visibleIds = visibleRequests
      .filter((r) => r.status.toLowerCase() === activeTab)
      .map((r) => r.id);
    if (selectedRequests.length === visibleIds.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(visibleIds);
    }
  };

  // Haversine formula for distance
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleAutoAssign = () => {
    if (!selectedReq) return;

    // Filter available drivers based on status, fuel, and load limits
    const eligibleDrivers = availableDrivers.filter(
      (driver) =>
        driver.status === "Available" &&
        driver.fuel > 20 &&
        driver.load < 80,
    );

    if (eligibleDrivers.length === 0) {
      notify.warning(
        "Assignment Failed",
        "No drivers available meeting the fuel (>20%) and capacity (<80%) requirements.",
      );
      return;
    }

    // Find closest eligible driver
    let closestDriver = eligibleDrivers[0];
    let minDistance = calculateDistance(
      selectedReq.lat,
      selectedReq.lng,
      closestDriver.lat,
      closestDriver.lng,
    );

    for (let i = 1; i < eligibleDrivers.length; i++) {
      const driver = eligibleDrivers[i];
      const dist = calculateDistance(
        selectedReq.lat,
        selectedReq.lng,
        driver.lat,
        driver.lng,
      );
      if (dist < minDistance) {
        minDistance = dist;
        closestDriver = driver;
      }
    }

    notify.success(
      "AI Auto-Assigned",
      `Closest eligible driver ${closestDriver.name} (${minDistance.toFixed(1)}km away, ${closestDriver.fuel}% Fuel) assigned to request ${selectedReq.id}.`,
    );
    setSelectedReq(null);
  };

  const handleAssign = (driverName: string) => {
    notify.success(
      "Request Assigned",
      `Request ${selectedReq?.id} assigned to ${driverName} successfully.`,
    );
    setSelectedReq(null);
  };

  if (role === "driver") {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Truck className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Access Restricted
        </h2>
        <p className="text-gray-500 max-w-md">
          Pickup requests management is not available for
          Drivers. Please refer to your personalized Routes
          Management dashboard.
        </p>
      </div>
    );
  }

  // Filter requests based on role. Assuming the logged in Citizen is 'John Doe'
  let visibleRequests =
    role === "citizen"
      ? mockRequests.filter((r) => r.citizen === "John Doe")
      : mockRequests;

  if (filterPriority !== "All") {
    visibleRequests = visibleRequests.filter(
      (r) => r.priority === filterPriority,
    );
  }

  // Basic mock zone filtering logic (string matching)
  if (filterZone !== "All") {
    visibleRequests = visibleRequests.filter((r) =>
      r.location.includes(filterZone),
    );
  }

  // Search filtering
  if (searchQuery.trim() !== "") {
    visibleRequests = visibleRequests.filter((r) =>
      r.citizen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Pickup{" "}
            <span className="text-rose-600">Requests</span>
          </h1>
          <p className="text-gray-500 font-medium">
            Coordinate citizen requests and optimize driver
            assignments
          </p>
        </div>
      </div>

      {/* Live Impact Bar */}
      <LogisticsImpactBar />

      {/* Pipeline Status Filter (PickupContext-driven) */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/40 dark:border-gray-800 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-gray-500 mr-2">
            Pipeline
          </span>
          {(["All", ...STATUS_PIPELINE] as PipelineFilter[]).map((status) => {
            const active = filterStatus === status;
            const count = statusCounts[status] ?? 0;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  active
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100"
                }`}
              >
                {status}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    active ? "bg-white/25 text-white" : "bg-white text-gray-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
          <div className="ml-auto text-xs text-gray-500">
            Showing <span className="font-bold text-emerald-600">{pipelineRequests.length}</span> request(s)
          </div>
        </div>

        {pipelineRequests.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pipelineRequests.map((req) => {
              const nextMap: Partial<Record<RequestStatus, RequestStatus>> = {
                Pending: "In-Progress",
                "In-Progress": "Validating",
                Validating: "Completed",
              };
              const next = nextMap[req.status];
              const assignedDriver = req.driver
                ? getDriverById(req.driver.id)
                : null;

              /* status colour ring */
              const statusRing: Record<string, string> = {
                Pending: "border-amber-200 dark:border-amber-800/40",
                "In-Progress": "border-blue-200 dark:border-blue-800/40",
                Validating: "border-violet-200 dark:border-violet-800/40",
                Completed: "border-emerald-200 dark:border-emerald-800/40",
                Rejected: "border-red-200 dark:border-red-800/40",
              };
              const statusBadge: Record<string, string> = {
                Pending: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
                "In-Progress": "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
                Validating: "bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400",
                Completed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
                Rejected: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
              };

              return (
                <div
                  key={req.id}
                  className={`rounded-xl border-2 ${statusRing[req.status] ?? "border-gray-100 dark:border-gray-800"} bg-white dark:bg-gray-900 p-4 flex flex-col gap-2.5 shadow-sm hover:shadow-md transition-shadow`}
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-gray-900 dark:text-white">
                        {req.id}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${statusBadge[req.status] ?? ""}`}>
                        {req.status}
                      </span>
                    </div>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      req.priority === "Critical"
                        ? "bg-red-100 text-red-600"
                        : req.priority === "High"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {req.priority}
                    </span>
                  </div>

                  {/* Citizen + zone */}
                  <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                    {req.citizen.name}
                    <span className="text-gray-400 mx-1">·</span>
                    <span className="text-gray-400">{req.zone.name}</span>
                  </div>

                  {/* Items */}
                  <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                    <Package className="w-3 h-3" />
                    {req.items[0]?.expectedQuantity}× {req.items[0]?.plasticType}
                    <span className="text-gray-300">·</span>
                    {req.items.reduce((s, i) => s + i.expectedWeightKg, 0).toFixed(1)}kg
                  </div>

                  {/* Assigned driver chip (for In-Progress / Validating) */}
                  {req.driver && (
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/15 border border-blue-100 dark:border-blue-800/30">
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${assignedDriver?.avatarColor ?? "bg-blue-500"}`}>
                        <span className="text-[8px] font-black text-white">
                          {assignedDriver?.initials ?? req.driver.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 truncate">
                        {req.driver.name}
                      </span>
                      <span className="ml-auto text-[9px] text-blue-400 flex-shrink-0">
                        {req.driver.vehicle}
                      </span>
                    </div>
                  )}

                  {/* Action button */}
                  {req.status === "Pending" ? (
                    <button
                      onClick={() => setAssigningRequest(req)}
                      className="mt-0.5 w-full px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] font-black tracking-wider uppercase shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                    >
                      <Truck className="w-3 h-3" />
                      Assign Driver
                    </button>
                  ) : next && req.status === "Validating" ? (
                    <button
                      onClick={() => setValidatingRequest(req)}
                      className="mt-0.5 w-full px-3 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white text-[10px] font-black tracking-wider uppercase shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                      🤖 Open AI Validation
                    </button>
                  ) : next ? (
                    <button
                      onClick={() => {
                        if (next === "Validating") {
                          const ok = updateRequestStatus(req.id, next);
                          if (ok) {
                            setValidatingRequest(req);
                            notify.info("AI Validation Started", `Request ${req.id} — AI modal opened.`);
                          }
                        } else {
                          const ok = updateRequestStatus(req.id, next);
                          if (ok) notify.success("Status Updated", `${req.id} → ${next}`);
                        }
                      }}
                      className="mt-0.5 w-full px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black tracking-wider uppercase shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                      Move to {next}
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Requests List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl border border-gray-50 dark:border-gray-800 overflow-hidden">
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-rose-500" />{" "}
                  Recent Requests
                </h2>
                <div className="flex items-center bg-white dark:bg-gray-900 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                  {(["pending", "assigned", "completed"] as const).map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          activeTab === tab
                            ? "bg-rose-600 text-white shadow-lg shadow-rose-500/20"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {tab}
                      </button>
                    ),
                  )}
                </div>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500"}`}
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === "map" ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500"}`}
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Advanced Filters */}
                {role !== "citizen" && (
                  <div className="flex items-center gap-2">
                    <select
                      value={filterPriority}
                      onChange={(e) =>
                        setFilterPriority(e.target.value)
                      }
                      className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold rounded-xl px-3 py-2 outline-none border border-transparent focus:border-rose-500 transition-colors"
                    >
                      <option value="All">
                        All Priorities
                      </option>
                      <option value="Critical">
                        Critical
                      </option>
                      <option value="High">High</option>
                      <option value="Normal">Normal</option>
                    </select>

                    <select
                      value={filterZone}
                      onChange={(e) =>
                        setFilterZone(e.target.value)
                      }
                      className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold rounded-xl px-3 py-2 outline-none border border-transparent focus:border-rose-500 transition-colors"
                    >
                      <option value="All">All Zones</option>
                      <option value="Downtown">
                        Downtown
                      </option>
                      <option value="Garden City">
                        Garden City
                      </option>
                      <option value="Maadi">Maadi</option>
                    </select>
                  </div>
                )}

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-[10px] font-bold outline-none w-full md:w-[200px]"
                  />
                </div>
              </div>
            </div>

            {viewMode === "map" ? (
              <div className="h-[500px] w-full bg-gray-100 dark:bg-gray-800 relative overflow-hidden rounded-b-[2.5rem] z-0">
                <MapContainer
                  center={[30.0444, 31.2357]}
                  zoom={11}
                  style={{
                    height: "100%",
                    width: "100%",
                    zIndex: 1,
                  }}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {visibleRequests.map((req) => (
                    <Marker
                      key={req.id}
                      position={[req.lat, req.lng]}
                    >
                      <Popup>
                        <div>
                          <strong>{req.citizen}</strong>
                          <br />
                          {req.bottles} Bottles
                          <br />
                          {req.location}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  {role !== "citizen" ? availableDrivers.map((driver) => (
                    <Marker
                      key={driver.id}
                      position={[driver.lat, driver.lng]}
                    >
                      <Popup>
                        <div>
                          <strong>{driver.name}</strong>
                          <br />
                          {driver.vehicle} - Fuel: {driver.fuel}%
                        </div>
                      </Popup>
                    </Marker>
                  )) : null}
                </MapContainer>
              </div>
            ) : (
              <>
                {role !== "citizen" &&
                  visibleRequests.filter(
                    (r) =>
                      r.status.toLowerCase() === activeTab,
                  ).length > 0 && (
                    <div className="px-6 py-3 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            onChange={toggleAll}
                            checked={
                              selectedRequests.length > 0 &&
                              selectedRequests.length ===
                                visibleRequests.filter(
                                  (r) =>
                                    r.status.toLowerCase() ===
                                    activeTab,
                                ).length
                            }
                            className="peer sr-only"
                          />
                          <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 peer-checked:bg-rose-500 peer-checked:border-rose-500 transition-colors flex items-center justify-center">
                            <CircleCheck className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase">
                          Select All
                        </span>
                      </label>
                      {selectedRequests.length > 0 && (
                        <div className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
                          {selectedRequests.length} Selected
                        </div>
                      )}
                    </div>
                  )}
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                  {visibleRequests.filter(
                    (r) =>
                      r.status.toLowerCase() === activeTab,
                  ).length > 0 ? (
                    visibleRequests
                      .filter(
                        (r) =>
                          r.status.toLowerCase() ===
                          activeTab,
                      )
                      .map((req) => (
                        <div
                          key={req.id}
                          onClick={() =>
                            role !== "citizen" &&
                            setSelectedReq(req)
                          }
                          className={`p-6 flex items-center justify-between group transition-all ${
                            role !== "citizen"
                              ? "cursor-pointer hover:bg-gray-50/50"
                              : ""
                          } ${selectedReq?.id === req.id || selectedRequests.includes(req.id) ? "bg-rose-50/50 dark:bg-rose-900/10" : ""}`}
                        >
                          <div className="flex items-center gap-6">
                            {role !== "citizen" && (
                              <div
                                onClick={(e) =>
                                  toggleSelection(req.id, e)
                                }
                                className="relative cursor-pointer flex-shrink-0"
                              >
                                <div
                                  className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${selectedRequests.includes(req.id) ? "bg-rose-500 border-rose-500 text-white" : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"}`}
                                >
                                  {selectedRequests.includes(
                                    req.id,
                                  ) && (
                                    <CircleCheck className="w-3 h-3" />
                                  )}
                                </div>
                              </div>
                            )}
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                                req.priority === "Critical"
                                  ? "bg-red-100 text-red-600 animate-pulse"
                                  : req.priority === "High"
                                    ? "bg-rose-50 text-rose-600"
                                    : "bg-blue-50 text-blue-600"
                              }`}
                            >
                              <Flame className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-black text-gray-900 dark:text-white">
                                  {req.citizen}
                                </h3>
                                <span
                                  className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                                    req.priority ===
                                    "Critical"
                                      ? "bg-red-600 text-white"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  {req.priority}
                                </span>
                              </div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                <MapPin className="w-3 h-3" />{" "}
                                {req.location}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-gray-900 dark:text-white">
                              {req.bottles} Bottles
                            </p>
                            <p className="text-[10px] font-bold text-gray-400">
                              {req.time}
                            </p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="p-12 text-center flex flex-col items-center">
                      {role === "citizen" ? (
                        <>
                          <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-4">
                            <Package className="w-8 h-8 text-rose-500" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            No Requests Found
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-6">
                            You haven't made any pickup
                            requests in this status. Start
                            recycling today!
                          </p>
                          <button className="px-6 py-2 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            New Request
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">
                            No requests match this filters.
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Panel / Driver Selection - Hidden for Citizens */}
        {role !== "citizen" && (
          <div className="space-y-6">
            {selectedReq ? (
              <div
                key="details"
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl border-2 border-rose-500/20"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">
                    Assignment
                  </h3>
                  <button
                    onClick={() => setSelectedReq(null)}
                    className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <CircleX className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl mb-8">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                    Request Data
                  </p>
                  <div className="space-y-4">
                    {/* Mini Map Real Integration */}
                    <div className="h-32 w-full bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-inner z-0">
                      <MapContainer
                        center={[
                          selectedReq.lat,
                          selectedReq.lng,
                        ]}
                        zoom={14}
                        style={{
                          height: "100%",
                          width: "100%",
                          zIndex: 1,
                        }}
                        zoomControl={false}
                        dragging={false}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker
                          position={[
                            selectedReq.lat,
                            selectedReq.lng,
                          ]}
                        />
                      </MapContainer>
                      {/* Overlay must be OUTSIDE MapContainer to avoid context errors */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-2 z-[400] pointer-events-none">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                          {selectedReq.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-sm">
                        <Users className="w-5 h-5 text-rose-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">
                          {selectedReq.citizen}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Citizen Profile
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-sm">
                        <Package className="w-5 h-5 text-rose-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">
                          {selectedReq.bottles} Bottles
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Recyclable Volume
                        </p>
                      </div>
                    </div>

                    {/* Mock Image Thumbnails */}
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1604187351574-c75ca79f5807?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                          alt="Recyclables"
                          className="w-full h-full object-cover opacity-80"
                        />
                      </div>
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                          alt="Bags"
                          className="w-full h-full object-cover opacity-80"
                        />
                      </div>
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center group cursor-pointer relative">
                        <span className="text-xs font-bold text-gray-500">
                          +2
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  Available Drivers Near Zone
                </h4>
                <div className="space-y-3">
                  {availableDrivers.map((driver) => (
                    <div
                      key={driver.id}
                      onClick={() =>
                        handleAssign(driver.name)
                      }
                      className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl cursor-pointer hover:border-rose-500 transition-all flex items-center justify-between group shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                          <Truck className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">
                            {driver.name}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {driver.vehicle} • {driver.load}%
                            Load • {driver.fuel}% Fuel
                            {selectedReq &&
                              ` • ${calculateDistance(selectedReq.lat, selectedReq.lng, driver.lat, driver.lng).toFixed(1)}km away`}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-rose-500 transition-colors" />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleAutoAssign}
                  className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Auto-Assign (AI Best Match)
                </button>
              </div>
            ) : (
              <div
                key="placeholder"
                className="bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 h-full flex flex-col items-center justify-center"
              >
                <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <UserPlus className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Select a Request
                </h3>
                <p className="text-sm text-gray-500">
                  Click on a request from the list to manage
                  assignment or auto-calculate the best route.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Validation Modal */}
      {validatingRequest && (
        <AIValidationModal
          request={validatingRequest}
          onClose={() => setValidatingRequest(null)}
        />
      )}

      {/* Driver Assignment Modal */}
      {assigningRequest && (
        <DriverAssignmentModal
          request={assigningRequest}
          onClose={() => setAssigningRequest(null)}
        />
      )}
    </div>
  );
}