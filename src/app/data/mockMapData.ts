import { Driver, Route, Center, Community } from '../components/maps/types';

export const getMapDataForRole = (role: string, userId?: string) => {
  const drivers: Driver[] = [
    { id: 'D-101', name: 'Ahmed Hassan', status: 'available', load: 85, vehicleType: 'Mercedes Sprinter EV', lat: 30.0444, lng: 31.2357 },
    { id: 'D-102', name: 'Mohamed Ali', status: 'on_route', load: 40, vehicleType: 'Ford Transit', lat: 30.0622, lng: 31.2469 },
    { id: 'D-103', name: 'Omar Khaled', status: 'inactive', load: 0, vehicleType: 'Volkswagen Crafter', lat: 30.04, lng: 31.215 },
    { id: 'D-104', name: 'Youssef Mahmoud', status: 'active', load: 60, vehicleType: 'Renault Master', lat: 30.0131, lng: 31.2089 },
    { id: 'D-105', name: 'Karim Said', status: 'active', load: 20, vehicleType: 'Toyota Hiace', lat: 30.0561, lng: 31.2194 },
    { id: 'D-106', name: 'Hassan Ibrahim', status: 'active', load: 75, vehicleType: 'Peugeot Boxer', lat: 30.0620, lng: 31.3350 },
    { id: 'D-107', name: 'Alhassan Hisham', status: 'active', load: 0, vehicleType: 'Plastic Scooter', lat: 30.464388, lng: 30.890404 },
  ];

  const routes: Route[] = [
    { id: 'R-001', name: 'Downtown Commercial Sector', status: 'in_progress', stops: [1,2,3], distance: 18.5, duration: 225, coordinates: [[30.0444, 31.2357], [30.0478, 31.2336], [30.045, 31.2345]] },
    { id: 'R-002', name: 'North Suburbs Residential', status: 'planned', stops: [1,2], distance: 32.1, duration: 330, coordinates: [[30.0622, 31.2469], [30.0620, 31.3350]] },
    { id: 'R-003', name: 'Westside High-Rise District', status: 'in_progress', stops: [1,2,3,4], distance: 8.5, duration: 120, coordinates: [[30.04, 31.215], [30.0131, 31.2089], [30.0561, 31.2194]] }
  ];

  const centers: Center[] = [
    { id: 'C-01', name: 'Downtown Hub (Tahrir)', type: 'collection', currentLoad: 5000, capacity: 10000, operatingHours: '08:00 AM - 10:00 PM', lat: 30.0444, lng: 31.2357 },
    { id: 'C-02', name: 'East Facility (Nasr City)', type: 'processing', currentLoad: 18000, capacity: 20000, operatingHours: '24/7', lat: 30.0620, lng: 31.3350 },
    { id: 'C-03', name: 'South Center (Maadi)', type: 'collection', currentLoad: 3500, capacity: 8000, operatingHours: '09:00 AM - 09:00 PM', lat: 29.965, lng: 31.262 }
  ];

  const communities: Community[] = [
     { id: 'COM-01', name: 'Zamalek Eco-Warriors', members: 45, totalBottles: 12500, level: 5, isJoined: false, lat: 30.057, lng: 31.2175 },
     { id: 'COM-02', name: 'Heliopolis Green', members: 156, totalBottles: 28000, level: 8, isJoined: true, lat: 30.092, lng: 31.328 },
     { id: 'COM-03', name: 'Giza Pyramids Cleanup', members: 89, totalBottles: 15400, level: 6, isJoined: false, lat: 30.025, lng: 31.195 }
  ];

  // Filtering logic based on Role (mock implementation)
  if (role === 'driver') {
    return { drivers: drivers, routes: routes, centers: centers, communities: [] };
  }
  
  if (role === 'citizen') {
    return { drivers: [], routes: [], centers: [], communities };
  }

  // Admin and Manager can see everything
  return { drivers, routes, centers, communities };
}
