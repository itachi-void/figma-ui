export interface Driver {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'on_route' | string;
  load: number;
  vehicleType?: string;
  lat: number;
  lng: number;
}

export interface Route {
  id: string;
  name: string;
  status: 'planned' | 'in_progress' | 'completed' | string;
  stops: any[];
  distance?: number;
  duration?: number;
  coordinates: [number, number][];
}

export interface Center {
  id: string;
  name: string;
  type: string;
  currentLoad: number;
  capacity: number;
  operatingHours?: string;
  lat: number;
  lng: number;
}

export interface Community {
  id: string;
  name: string;
  members: number;
  totalBottles: number;
  level: number;
  isJoined?: boolean;
  lat: number;
  lng: number;
}
