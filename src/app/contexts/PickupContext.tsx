"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import {
  PickupRequest,
  RequestStatus,
  ValidationResult,
  DriverRef,
  POINTS_PER_KG,
} from "@/app/types/recyclehub";

const VALID_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  Pending: ["In-Progress", "Rejected"],
  "In-Progress": ["Validating", "Rejected"],
  Validating: ["Completed", "Rejected"],
  Completed: [],
  Rejected: [],
};

export type PipelineFilter = RequestStatus | "All";

interface PickupContextValue {
  requests: PickupRequest[];
  filterStatus: PipelineFilter;
  setFilterStatus: (status: PipelineFilter) => void;
  filteredRequests: PickupRequest[];
  statusCounts: Record<RequestStatus | "All", number>;
  updateRequestStatus: (id: string, next: RequestStatus) => boolean;
  attachValidation: (id: string, result: ValidationResult) => void;
  assignDriverToRequest: (id: string, driver: DriverRef) => boolean;
  addRequest: (req: PickupRequest) => void;
  getRequestById: (id: string) => PickupRequest | undefined;
}

const PickupContext = createContext<PickupContextValue | null>(null);

const seed: PickupRequest[] = [
  {
    id: "REQ-101",
    createdAt: new Date(Date.now() - 5 * 60_000),
    updatedAt: new Date(Date.now() - 5 * 60_000),
    citizen: {
      id: "C-1",
      name: "John Doe",
      address: "123 Nile St, Downtown",
      lat: 30.0444,
      lng: 31.2357,
    },
    zone: { id: "Z-DT", name: "Downtown", city: "Cairo", active: true },
    status: "Pending",
    priority: "High",
    items: [{ plasticType: "PET", expectedQuantity: 45, expectedWeightKg: 1.8 }],
  },
  {
    id: "REQ-102",
    // Deliberately set 3 hours in the past → triggers Smart Guard delayed-pickup alert
    createdAt: new Date(Date.now() - 3 * 60 * 60_000),
    updatedAt: new Date(Date.now() - 3 * 60 * 60_000),
    citizen: {
      id: "C-2",
      name: "Sarah J.",
      address: "45 Garden City",
      lat: 30.0333,
      lng: 31.2333,
    },
    zone: { id: "Z-GC", name: "Garden City", city: "Cairo", active: true },
    status: "In-Progress",
    priority: "Critical",
    items: [{ plasticType: "PET", expectedQuantity: 120, expectedWeightKg: 4.8 }],
    driver: { id: "D-01", name: "Ahmed Kamal", vehicle: "Small Truck" },
  },
  {
    id: "REQ-103",
    createdAt: new Date(Date.now() - 20 * 60_000),
    updatedAt: new Date(Date.now() - 20 * 60_000),
    citizen: {
      id: "C-3",
      name: "Mike Tyson",
      address: "Industrial Zone B",
      lat: 30.05,
      lng: 31.2,
    },
    zone: { id: "Z-IB", name: "Industrial B", city: "Cairo", active: true },
    status: "Validating",
    priority: "High",
    items: [{ plasticType: "HDPE", expectedQuantity: 300, expectedWeightKg: 18 }],
    driver: { id: "D-02", name: "Sarah Wilson", vehicle: "Motorcycle" },
  },
  {
    id: "REQ-104",
    createdAt: new Date(Date.now() - 60 * 60_000),
    updatedAt: new Date(Date.now() - 60 * 60_000),
    citizen: {
      id: "C-4",
      name: "Ali Ahmed",
      address: "Maadi Hub 5",
      lat: 29.9667,
      lng: 31.25,
    },
    zone: { id: "Z-MD", name: "Maadi", city: "Cairo", active: true },
    status: "Completed",
    priority: "Normal",
    items: [{ plasticType: "PET", expectedQuantity: 60, expectedWeightKg: 2.4 }],
    driver: { id: "D-03", name: "Zainab Ali", vehicle: "TukTuk" },
    pointsAwarded: 24,
  },
  // ── High-volume Industrial B pickups → triggers Zone Capacity alert (>1 000 kg) ──
  {
    id: "REQ-105",
    createdAt: new Date(Date.now() - 4 * 60 * 60_000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60_000),
    citizen: {
      id: "C-5",
      name: "Cairo Industrial Co.",
      address: "Industrial Zone B, Unit 12",
      lat: 30.051,
      lng: 31.201,
    },
    zone: { id: "Z-IB", name: "Industrial B", city: "Cairo", active: true },
    status: "Completed",
    priority: "High",
    items: [{ plasticType: "PP", expectedQuantity: 8000, expectedWeightKg: 520 }],
    driver: { id: "D-04", name: "Omar Hassan", vehicle: "Large Truck" },
    pointsAwarded: 5200,
  },
  {
    id: "REQ-106",
    createdAt: new Date(Date.now() - 5 * 60 * 60_000),
    updatedAt: new Date(Date.now() - 5 * 60 * 60_000),
    citizen: {
      id: "C-6",
      name: "Delta Plastics Ltd.",
      address: "Industrial Zone B, Warehouse 7",
      lat: 30.049,
      lng: 31.199,
    },
    zone: { id: "Z-IB", name: "Industrial B", city: "Cairo", active: true },
    status: "Completed",
    priority: "Normal",
    items: [{ plasticType: "HDPE", expectedQuantity: 7500, expectedWeightKg: 480 }],
    driver: { id: "D-04", name: "Omar Hassan", vehicle: "Large Truck" },
    pointsAwarded: 4800,
  },
];

export function PickupProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<PickupRequest[]>(seed);
  const [filterStatus, setFilterStatus] = useState<PipelineFilter>("All");

  const updateRequestStatus = useCallback(
    (id: string, next: RequestStatus) => {
      let ok = false;
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          const allowed = VALID_TRANSITIONS[r.status] ?? [];
          if (!allowed.includes(next)) return r;
          ok = true;

          let pointsAwarded = r.pointsAwarded;
          if (next === "Completed") {
            const kg = r.items.reduce((s, i) => s + i.expectedWeightKg, 0);
            pointsAwarded = Math.round(kg * POINTS_PER_KG);
            // TODO(wallet): trigger WalletContext.addPoints(pointsAwarded, ...)
            // once PickupProvider is mounted under WalletProvider.
          }

          return {
            ...r,
            status: next,
            updatedAt: new Date(),
            pointsAwarded,
          };
        })
      );
      return ok;
    },
    []
  );

  const assignDriverToRequest = useCallback(
    (id: string, driver: DriverRef): boolean => {
      let ok = false;
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          // Only valid from Pending
          if (r.status !== "Pending") return r;
          ok = true;
          return {
            ...r,
            status: "In-Progress" as RequestStatus,
            driver,
            updatedAt: new Date(),
          };
        })
      );
      return ok;
    },
    []
  );

  const attachValidation = useCallback(
    (id: string, result: ValidationResult) => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, validation: result, updatedAt: new Date() } : r
        )
      );
    },
    []
  );

  const addRequest = useCallback((req: PickupRequest) => {
    setRequests((prev) => [req, ...prev]);
  }, []);

  const getRequestById = useCallback(
    (id: string) => requests.find((r) => r.id === id),
    [requests]
  );

  const filteredRequests = useMemo(
    () =>
      filterStatus === "All"
        ? requests
        : requests.filter((r) => r.status === filterStatus),
    [requests, filterStatus]
  );

  const statusCounts = useMemo(() => {
    const counts = {
      All: requests.length,
      Pending: 0,
      "In-Progress": 0,
      Validating: 0,
      Completed: 0,
      Rejected: 0,
    } as Record<RequestStatus | "All", number>;
    for (const r of requests) counts[r.status]++;
    return counts;
  }, [requests]);

  return (
    <PickupContext.Provider
      value={{
        requests,
        filterStatus,
        setFilterStatus,
        filteredRequests,
        statusCounts,
        updateRequestStatus,
        attachValidation,
        assignDriverToRequest,
        addRequest,
        getRequestById,
      }}
    >
      {children}
    </PickupContext.Provider>
  );
}

export function usePickup() {
  const ctx = useContext(PickupContext);
  if (!ctx) throw new Error("usePickup must be used within PickupProvider");
  return ctx;
}