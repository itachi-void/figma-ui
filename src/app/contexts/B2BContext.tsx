"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import type { PlasticType } from "@/app/types/recyclehub";

/* ─── Types ─────────────────────────────────────────────── */
export type PartnerType = "Factory" | "Recycler" | "Manufacturer";
export type PartnerStatus = "Active" | "Inactive" | "Negotiating";

export interface B2BPartnerExtended {
  id: string;
  name: string;
  type: PartnerType;
  contact: string;
  email: string;
  phone: string;
  location: string;
  tonsContributed: number;
  activeSince: string;
  status: PartnerStatus;
  contractValueUSD: number;
  plasticTypes: PlasticType[];
  avatarColor: string;
  initials: string;
  monthlyCapacity: number;
  rating: number;
  description: string;
}

export interface Shipment {
  id: string;
  partnerId: string;
  pickupRequestId: string;
  tonsShipped: number;
  assignedAt: Date;
  status: "Pending" | "Shipped" | "Delivered";
}

interface B2BContextValue {
  partners: B2BPartnerExtended[];
  shipments: Shipment[];
  assignedRequestIds: Set<string>;
  assignShipment: (
    partnerId: string,
    pickupRequestId: string,
    tonsShipped: number
  ) => void;
  addPartner: (partner: Omit<B2BPartnerExtended, "id">) => void;
  getPartnerById: (id: string) => B2BPartnerExtended | undefined;
  totalTons: number;
  totalRevenue: number;
}

/* ─── Seed Data ──────────────────────────────────────────── */
const seedPartners: B2BPartnerExtended[] = [
  {
    id: "BP-01",
    name: "EcoFactory Cairo",
    type: "Factory",
    contact: "Dr. Hassan Mostafa",
    email: "h.mostafa@ecofactory.eg",
    phone: "+20 2 1234 5678",
    location: "Industrial Zone A, Cairo",
    tonsContributed: 128.5,
    activeSince: "2023-03",
    status: "Active",
    contractValueUSD: 245000,
    plasticTypes: ["PET", "HDPE"],
    avatarColor: "bg-emerald-500",
    initials: "EF",
    monthlyCapacity: 15,
    rating: 4.8,
    description:
      "Egypt's leading eco-manufacturing plant converting PET and HDPE into industrial-grade raw pellets.",
  },
  {
    id: "BP-02",
    name: "PlastiRecycle Ltd",
    type: "Recycler",
    contact: "Eng. Amira Khalil",
    email: "a.khalil@plastircycle.com",
    phone: "+20 2 2345 6789",
    location: "6th of October City, Giza",
    tonsContributed: 89.2,
    activeSince: "2023-07",
    status: "Active",
    contractValueUSD: 178000,
    plasticTypes: ["PET", "PP", "PS"],
    avatarColor: "bg-blue-500",
    initials: "PR",
    monthlyCapacity: 10,
    rating: 4.5,
    description:
      "Specializing in closed-loop plastic recycling with 98% material recovery rate across PET and PP streams.",
  },
  {
    id: "BP-03",
    name: "GreenManufacture Co.",
    type: "Manufacturer",
    contact: "Mr. Tarek Nabil",
    email: "t.nabil@greenmanufacture.com",
    phone: "+20 2 3456 7890",
    location: "Borg El Arab Industrial Zone, Alexandria",
    tonsContributed: 214.7,
    activeSince: "2022-11",
    status: "Active",
    contractValueUSD: 520000,
    plasticTypes: ["PET", "HDPE", "LDPE", "PP"],
    avatarColor: "bg-violet-500",
    initials: "GM",
    monthlyCapacity: 25,
    rating: 4.9,
    description:
      "Large-scale manufacturer producing eco-friendly packaging from 100% recycled plastics for FMCG brands.",
  },
  {
    id: "BP-04",
    name: "Cairo Bottles Inc.",
    type: "Factory",
    contact: "Ms. Fatma Sherif",
    email: "f.sherif@cairobottles.com",
    phone: "+20 2 4567 8901",
    location: "Obour City, Cairo",
    tonsContributed: 56.4,
    activeSince: "2024-01",
    status: "Active",
    contractValueUSD: 112000,
    plasticTypes: ["PET"],
    avatarColor: "bg-amber-500",
    initials: "CB",
    monthlyCapacity: 8,
    rating: 4.3,
    description:
      "Food-grade PET bottle manufacturer sourcing 60% of raw material from post-consumer recycled content.",
  },
  {
    id: "BP-05",
    name: "Delta Recyclers",
    type: "Recycler",
    contact: "Eng. Mostafa Saad",
    email: "m.saad@deltarecyclers.eg",
    phone: "+20 2 5678 9012",
    location: "Mansoura Industrial Park",
    tonsContributed: 43.1,
    activeSince: "2024-02",
    status: "Negotiating",
    contractValueUSD: 85000,
    plasticTypes: ["PVC", "LDPE", "Other"],
    avatarColor: "bg-teal-500",
    initials: "DR",
    monthlyCapacity: 6,
    rating: 4.1,
    description:
      "Delta region's primary recycler for mixed plastics and PVC streams, processing material for the construction industry.",
  },
  {
    id: "BP-06",
    name: "Nile Green Materials",
    type: "Recycler",
    contact: "Dr. Nadia Fouad",
    email: "n.fouad@nilegreen.com",
    phone: "+20 2 6789 0123",
    location: "New Cairo Tech Valley",
    tonsContributed: 31.8,
    activeSince: "2024-04",
    status: "Active",
    contractValueUSD: 67000,
    plasticTypes: ["HDPE", "PP"],
    avatarColor: "bg-rose-500",
    initials: "NG",
    monthlyCapacity: 5,
    rating: 4.6,
    description:
      "Innovation-focused recycler specialising in high-value HDPE and PP compounds for automotive parts production.",
  },
];

/* ��── Context ────────────────────────────────────────────── */
const B2BContext = createContext<B2BContextValue | null>(null);

export function B2BProvider({ children }: { children: ReactNode }) {
  const [partners, setPartners] = useState<B2BPartnerExtended[]>(seedPartners);
  const [shipments, setShipments] = useState<Shipment[]>([]);

  const assignedRequestIds = useMemo(
    () => new Set(shipments.map((s) => s.pickupRequestId)),
    [shipments]
  );

  const assignShipment = useCallback(
    (partnerId: string, pickupRequestId: string, tonsShipped: number) => {
      const newShipment: Shipment = {
        id: `SHIP-${Date.now()}`,
        partnerId,
        pickupRequestId,
        tonsShipped,
        assignedAt: new Date(),
        status: "Pending",
      };
      setShipments((prev) => [...prev, newShipment]);
    },
    []
  );

  const addPartner = useCallback((partner: Omit<B2BPartnerExtended, "id">) => {
    const id = `BP-${Date.now().toString().slice(-6)}`;
    setPartners((prev) => [...prev, { ...partner, id }]);
  }, []);

  const getPartnerById = useCallback(
    (id: string) => partners.find((p) => p.id === id),
    [partners]
  );

  const totalTons = useMemo(
    () => partners.reduce((s, p) => s + p.tonsContributed, 0),
    [partners]
  );

  const totalRevenue = useMemo(
    () => partners.reduce((s, p) => s + p.contractValueUSD, 0),
    [partners]
  );

  return (
    <B2BContext.Provider
      value={{
        partners,
        shipments,
        assignedRequestIds,
        assignShipment,
        addPartner,
        getPartnerById,
        totalTons,
        totalRevenue,
      }}
    >
      {children}
    </B2BContext.Provider>
  );
}

export function useB2B() {
  const ctx = useContext(B2BContext);
  if (!ctx) throw new Error("useB2B must be used within B2BProvider");
  return ctx;
}