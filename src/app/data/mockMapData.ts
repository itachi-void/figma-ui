import { Driver, Route, Center, Community } from '../components/maps/types';

export const getMapDataForRole = (role: string, userId?: string) => {
  const drivers: Driver[] = [
    { id: 'D-129', name: 'Ahmed K.', status: 'on_route', load: 65, vehicleType: 'Truck', lat: 30.50, lng: 30.90 },
    { id: 'D-130', name: 'Sarah W.', status: 'active', load: 20, vehicleType: 'Van', lat: 30.52, lng: 30.95 },
    { id: 'D-140', name: 'Omar F.', status: 'inactive', load: 0, vehicleType: 'Motorcycle', lat: 30.48, lng: 30.92 },
  ];

  const routes: Route[] = [
    { id: 'R-700', name: 'Route A - Downtown', status: 'in_progress', stops: [1,2,3], distance: 15.2, duration: 45, coordinates: [[30.50, 30.90], [30.51, 30.92], [30.52, 30.95]] },
    { id: 'R-701', name: 'Route B - Outskirts', status: 'planned', stops: [1,2], distance: 8.5, duration: 25, coordinates: [[30.48, 30.92], [30.45, 30.85]] }
  ];

  const centers: Center[] = [
    { id: 'C-01', name: 'Main Hub', type: 'collection', currentLoad: 5000, capacity: 10000, operatingHours: '08:00 AM - 10:00 PM', lat: 30.45, lng: 30.85 },
    { id: 'C-02', name: 'North Facility', type: 'processing', currentLoad: 18000, capacity: 20000, operatingHours: '24/7', lat: 30.55, lng: 30.98 }
  ];

  const communities: Community[] = [
     { id: 'COM-01', name: 'Green Neighborhood', members: 45, totalBottles: 12500, level: 5, isJoined: false, lat: 30.48, lng: 30.88 },
     { id: 'COM-02', name: 'Eco Warriors', members: 156, totalBottles: 28000, level: 8, isJoined: true, lat: 30.51, lng: 30.89 }
  ];

  // Filtering logic based on Role (mock implementation)
  if (role === 'driver') {
    return { drivers: drivers.slice(0, 1), routes: routes.slice(0, 1), centers: centers.slice(0, 1), communities: [] };
  }
  
  if (role === 'citizen') {
    return { drivers: [], routes: [], centers: [], communities };
  }

  // Admin and Manager can see everything
  return { drivers, routes, centers, communities };
}
