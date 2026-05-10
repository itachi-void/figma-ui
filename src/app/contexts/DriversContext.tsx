"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

/* ─── Types ─────────────────────────────────────────── */
export type DriverLiveStatus = "available" | "busy" | "off-duty";

export interface LiveDriver {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;   // tailwind bg class
  vehicle: string;
  vehicleType: "Motorcycle" | "TukTuk" | "Van" | "Small Truck" | "Large Truck";
  zone: string;
  phone: string;
  rating: number;         // 0–5
  completedToday: number;
  fuel: number;           // 0–100
  capacity: number;       // 0–100 (current load %)
  status: DriverLiveStatus;
  assignedRequestId?: string;
  lat: number;
  lng: number;
}

interface DriversContextValue {
  drivers: LiveDriver[];
  availableDrivers: LiveDriver[];
  getDriverById: (id: string) => LiveDriver | undefined;
  assignDriver: (driverId: string, requestId: string) => void;
  releaseDriver: (driverId: string) => void;
  setDriverStatus: (driverId: string, status: DriverLiveStatus) => void;
}

/* ─── Seed Pool ──────────────────────────────────────── */
const seedDrivers: LiveDriver[] = [
  {
    id: "D-01",
    name: "Ahmed Kamal",
    initials: "AK",
    avatarColor: "bg-emerald-500",
    vehicle: "VEH-101",
    vehicleType: "Small Truck",
    zone: "Downtown",
    phone: "+20 10 1234 5678",
    rating: 4.8,
    completedToday: 6,
    fuel: 78,
    capacity: 40,
    status: "available",
    lat: 30.04,
    lng: 31.24,
  },
  {
    id: "D-02",
    name: "Sarah Wilson",
    initials: "SW",
    avatarColor: "bg-violet-500",
    vehicle: "VEH-102",
    vehicleType: "Motorcycle",
    zone: "Garden City",
    phone: "+20 10 2345 6789",
    rating: 4.9,
    completedToday: 8,
    fuel: 85,
    capacity: 0,
    status: "available",
    lat: 30.045,
    lng: 31.23,
  },
  {
    id: "D-03",
    name: "Zainab Ali",
    initials: "ZA",
    avatarColor: "bg-rose-500",
    vehicle: "VEH-103",
    vehicleType: "TukTuk",
    zone: "Maadi",
    phone: "+20 10 3456 7890",
    rating: 4.6,
    completedToday: 4,
    fuel: 22,
    capacity: 12,
    status: "available",
    lat: 30.035,
    lng: 31.25,
  },
  {
    id: "D-04",
    name: "Omar Sayed",
    initials: "OS",
    avatarColor: "bg-amber-500",
    vehicle: "VEH-104",
    vehicleType: "Large Truck",
    zone: "Industrial B",
    phone: "+20 10 4567 8901",
    rating: 4.5,
    completedToday: 3,
    fuel: 60,
    capacity: 75,
    status: "busy",
    assignedRequestId: "REQ-103",
    lat: 30.042,
    lng: 31.238,
  },
  {
    id: "D-05",
    name: "Fatima Nour",
    initials: "FN",
    avatarColor: "bg-teal-500",
    vehicle: "VEH-105",
    vehicleType: "Van",
    zone: "Downtown",
    phone: "+20 10 5678 9012",
    rating: 4.7,
    completedToday: 5,
    fuel: 91,
    capacity: 30,
    status: "available",
    lat: 30.048,
    lng: 31.237,
  },
  {
    id: "D-06",
    name: "Karim Bassem",
    initials: "KB",
    avatarColor: "bg-blue-500",
    vehicle: "VEH-106",
    vehicleType: "Motorcycle",
    zone: "Garden City",
    phone: "+20 10 6789 0123",
    rating: 4.3,
    completedToday: 2,
    fuel: 45,
    capacity: 0,
    status: "off-duty",
    lat: 30.033,
    lng: 31.231,
  },
  {
    id: "D-07",
    name: "Nadia Hassan",
    initials: "NH",
    avatarColor: "bg-pink-500",
    vehicle: "VEH-107",
    vehicleType: "Small Truck",
    zone: "Maadi",
    phone: "+20 10 7890 1234",
    rating: 4.9,
    completedToday: 7,
    fuel: 55,
    capacity: 55,
    status: "available",
    lat: 29.97,
    lng: 31.248,
  },
];

/* ─── Haversine ──────────────────────────────────────── */
export function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ─── Context ────────────────────────────────────────── */
const DriversContext = createContext<DriversContextValue | null>(null);

export function DriversProvider({ children }: { children: ReactNode }) {
  const [drivers, setDrivers] = useState<LiveDriver[]>(seedDrivers);

  const availableDrivers = useMemo(
    () => drivers.filter((d) => d.status === "available" && d.fuel > 20 && d.capacity < 85),
    [drivers]
  );

  const getDriverById = useCallback(
    (id: string) => drivers.find((d) => d.id === id),
    [drivers]
  );

  const assignDriver = useCallback((driverId: string, requestId: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId
          ? { ...d, status: "busy", assignedRequestId: requestId }
          : d
      )
    );
  }, []);

  const releaseDriver = useCallback((driverId: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId
          ? { ...d, status: "available", assignedRequestId: undefined, completedToday: d.completedToday + 1 }
          : d
      )
    );
  }, []);

  const setDriverStatus = useCallback(
    (driverId: string, status: DriverLiveStatus) => {
      setDrivers((prev) =>
        prev.map((d) => (d.id === driverId ? { ...d, status } : d))
      );
    },
    []
  );

  const ctxValue = useMemo(
    () => ({
      drivers,
      availableDrivers,
      getDriverById,
      assignDriver,
      releaseDriver,
      setDriverStatus,
    }),
    [drivers, availableDrivers, getDriverById, assignDriver, releaseDriver, setDriverStatus]
  );

  return (
    <DriversContext.Provider value={ctxValue}>
      {children}
    </DriversContext.Provider>
  );
}

export function useDrivers() {
  const ctx = useContext(DriversContext);
  if (!ctx) throw new Error("useDrivers must be within DriversProvider");
  return ctx;
}