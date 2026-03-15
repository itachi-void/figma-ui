import { useEffect, useState, useRef } from "react";
import { motion } from 'motion/react';
import { MapPin, Navigation, Clock, Activity } from 'lucide-react';

interface RouteData {
  id: string;
  name: string;
  driver: string;
  vehicle: string;
  status: string;
  route?: [number, number][];
  currentPosition?: [number, number];
  efficiency: number;
}

interface CollectionPoint {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: string;
}

interface LiveMapViewProps {
  routesData: RouteData[];
  collectionPoints: CollectionPoint[];
}

export function LiveMapView({ routesData, collectionPoints }: LiveMapViewProps) {
  const [isClient, setIsClient] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [L, setL] = useState<any>(null);
  const [vehicleMarkers, setVehicleMarkers] = useState<any[]>([]);
  const [animationInterval, setAnimationInterval] = useState<any>(null);
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainer.current) return;

    // Dynamically import Leaflet on client side only
    import('leaflet').then((leaflet) => {
      setL(leaflet);
      
      // Fix Leaflet default marker icon issue
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Initialize map centered on Cairo
      const mapInstance = leaflet.map(mapContainer.current).setView([30.0444, 31.2357], 12);

      // Add satellite tile layer (high detail for Cairo)
      leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri, Earthstar Geographics',
        maxZoom: 19,
        minZoom: 10
      }).addTo(mapInstance);

      // Add labels overlay
      leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap, © CartoDB',
        maxZoom: 19,
        subdomains: 'abcd',
        pane: 'shadowPane'
      }).addTo(mapInstance);

      setMap(mapInstance);

      return () => {
        if (animationInterval) clearInterval(animationInterval);
        mapInstance.remove();
      };
    });
  }, [isClient]);

  useEffect(() => {
    if (!map || !L) return;

    // Clear existing markers
    vehicleMarkers.forEach(marker => map.removeLayer(marker));
    const newMarkers: any[] = [];

    // Add collection points
    collectionPoints.forEach(point => {
      const statusColors: Record<string, string> = {
        completed: '#10b981',
        active: '#f59e0b',
        pending: '#6b7280',
      };

      const color = statusColors[point.status] || '#6b7280';

      const pointMarker = L.circleMarker([point.lat, point.lng], {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      pointMarker.bindPopup(`
        <div style="padding: 8px; min-width: 180px;">
          <h3 style="margin: 0 0 6px 0; color: ${color}; font-weight: bold;">${point.name}</h3>
          <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: capitalize;">
            Status: <span style="color: ${color}; font-weight: 600;">${point.status}</span>
          </p>
        </div>
      `);

      newMarkers.push(pointMarker);
    });

    // Add vehicle routes with live simulation
    const activeRoutes = routesData.filter(route => route.status === 'active' && route.route);
    
    activeRoutes.forEach((route, index) => {
      if (!route.route) return;

      // Draw route path
      const routePath = L.polyline(route.route, {
        color: getRouteColor(index),
        weight: 4,
        opacity: 0.7,
        smoothFactor: 1
      }).addTo(map);

      newMarkers.push(routePath);

      // Create custom vehicle icon
      const vehicleIcon = L.divIcon({
        html: `
          <div style="
            width: 40px;
            height: 40px;
            background: ${getRouteColor(index)};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            border: 3px solid white;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            font-size: 16px;
          ">
            🚛
          </div>
        `,
        iconSize: [40, 40],
        className: 'vehicle-marker'
      });

      // Add vehicle marker
      const vehicleMarker = L.marker(route.currentPosition || route.route[0], {
        icon: vehicleIcon,
        zIndexOffset: 1000
      }).addTo(map);

      vehicleMarker.bindPopup(`
        <div style="padding: 12px; min-width: 250px;">
          <div style="margin-bottom: 8px;">
            <h3 style="margin: 0 0 4px 0; color: #1f2937; font-weight: bold;">${route.name}</h3>
            <p style="margin: 0; font-size: 13px; color: #6b7280;">${route.id}</p>
          </div>
          <div style="background: #f3f4f6; border-radius: 6px; padding: 8px; margin-bottom: 8px;">
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #374151;">
              <strong>Driver:</strong> ${route.driver}
            </p>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #374151;">
              <strong>Vehicle:</strong> ${route.vehicle}
            </p>
            <p style="margin: 0; font-size: 12px; color: #374151;">
              <strong>Efficiency:</strong> <span style="color: #10b981; font-weight: 600;">${route.efficiency}%</span>
            </p>
          </div>
          <p style="margin: 0; font-size: 11px; color: #9ca3af; text-align: center;">
            🚛 Live tracking active
          </p>
        </div>
      `);

      newMarkers.push(vehicleMarker);

      // Animate vehicle movement
      let currentStep = 0;
      const totalSteps = route.route.length - 1;

      const interval = setInterval(() => {
        if (currentStep < totalSteps) {
          currentStep++;
          const newPosition = route.route![currentStep];
          vehicleMarker.setLatLng(newPosition);
        } else {
          currentStep = 0;
          vehicleMarker.setLatLng(route.route![0]);
        }
      }, 4000); // Move every 4 seconds

      setAnimationInterval(interval);
    });

    setVehicleMarkers(newMarkers);

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      const group = L.featureGroup(newMarkers);
      map.fitBounds(group.getBounds().pad(0.1));
    }

  }, [map, L, routesData, collectionPoints]);

  const getRouteColor = (index: number): string => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    return colors[index % colors.length];
  };

  if (!isClient) {
    return (
      <div className="h-[600px] w-full bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Cairo Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="h-[600px] w-full rounded-xl shadow-lg"
        style={{ zIndex: 1 }}
      />

      {/* Live Tracking Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 right-4 bg-white rounded-xl shadow-xl p-4 max-w-xs z-[1000]"
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-gray-900">Live Tracking</h3>
        </div>

        <div className="space-y-3">
          {routesData.filter(r => r.status === 'active').map((route, index) => (
            <div key={route.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div 
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: getRouteColor(index) }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{route.name}</p>
                <p className="text-xs text-gray-600">{route.driver}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-emerald-600">{route.efficiency}%</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Map Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-4 bg-white rounded-xl shadow-xl p-4 z-[1000]"
      >
        <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Map Legend
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-700">Completed Point</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-700">Active Point</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span className="text-gray-700">Pending Point</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-lg">🚛</span>
            <span className="text-gray-700">Active Vehicle</span>
          </div>
        </div>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 right-4 bg-white rounded-xl shadow-xl p-4 z-[1000]"
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-blue-600" />
          <h4 className="font-bold text-gray-900 text-sm">Journey Progress</h4>
        </div>
        <div className="space-y-2">
          {routesData.filter(r => r.status === 'active').map((route, index) => {
            const progress = route.efficiency || 0;
            return (
              <div key={route.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">{route.name}</span>
                  <span className="text-xs font-bold text-gray-900">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: getRouteColor(index)
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}