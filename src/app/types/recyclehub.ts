export type RequestStatus =
  | "Pending"
  | "In-Progress"
  | "Validating"
  | "Completed"
  | "Rejected";

export type Priority = "Normal" | "High" | "Critical";

export type PlasticType = "PET" | "HDPE" | "PVC" | "LDPE" | "PP" | "PS" | "Other";

export interface Zone {
  id: string;
  name: string;
  city: string;
  active: boolean;
}

export interface PickupItem {
  plasticType: PlasticType;
  expectedQuantity: number;
  expectedWeightKg: number;
}

export interface ValidationResult {
  validatedAt: Date;
  matchPercentage: number;
  expectedQuantity: number;
  detectedQuantity: number;
  expectedWeightKg: number;
  detectedWeightKg: number;
  imageUrls: string[];
  discrepancyNotes?: string;
  approved: boolean;
  validatedBy: string;
}

export interface CitizenRef {
  id: string;
  name: string;
  phone?: string;
  address: string;
  lat?: number;
  lng?: number;
}

export interface DriverRef {
  id: string;
  name: string;
  vehicle?: string;
  phone?: string;
}

export interface PickupRequest {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  citizen: CitizenRef;
  driver?: DriverRef;
  zone: Zone;
  status: RequestStatus;
  priority: Priority;
  items: PickupItem[];
  notes?: string;
  validation?: ValidationResult;
  pointsAwarded?: number;
}

export interface WalletTransaction {
  id: string;
  requestId?: string;
  citizenId: string;
  amount: number;
  type: "earned" | "spent" | "adjustment";
  description: string;
  createdAt: Date;
}

export interface B2BPartner {
  id: string;
  name: string;
  contact: string;
  zonesAssigned: string[];
  fleetSize: number;
  rating: number;
  active: boolean;
}

export const STATUS_PIPELINE: RequestStatus[] = [
  "Pending",
  "In-Progress",
  "Validating",
  "Completed",
];

export const POINTS_PER_KG = 10;
