"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import L, { LatLngExpression, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "./LiveMapView.css";
import { ThermometerSun, AlertTriangle, CarFront, CloudRain, Sun, CloudLightning, CloudFog } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Driver = {
  id: number;
  name: string;
  color: string;
  iconColor: string;
  vehicle: string;
  license: string;
  status: "available" | "moving" | "idle" | "paused";
  currentLocation: [number, number];
  speed: number;
  phone: string;
};

type Zone = {
  center: [number, number];
  color: string;
  description: string;
  radius: number;
  majorStreets: string[];
};

type DriverRuntime = {
  marker: L.Marker;
  isAnimating: boolean;
  currentRoute: L.Polyline | null;
  progress: number;
  totalDistance: number;
  totalDuration: number;
  animationStartTime: number | null;
  remainingTime: number;
  routePath: [number, number][];
  animationInterval: any;
  speedMultiplier: number;
  baseTotalTime: number;
  elapsedSimulationTime: number; // NEW
  isPaused: boolean; // NEW
  baseElapsedTime: number;
  data: Driver;
};

const CAIRO: [number, number] = [30.0444, 31.2357];

const cairoLocations: Record<string, [number, number]> = {
  "Tahrir Square": [30.0444, 31.2357],
  "Egyptian Museum Entrance": [30.0478, 31.2336],
  "Mogamma Building": [30.045, 31.2345],
  "Cairo Opera House": [30.042, 31.2235],
  "Ramsis Square": [30.0622, 31.2469],
  "Zamalek Club": [30.0561, 31.2194],
  "Abbas El-Akkad Street": [30.062, 31.335],
  "Road 9": [29.965, 31.262],
  "Giza Square": [30.0131, 31.2089],
  "Dokki Square": [30.04, 31.215],
  "Merghany Street": [30.092, 31.328],
  "26th July Street": [30.057, 31.2175],
  "Pyramids Road (Harram)": [30.025, 31.195],
  "Alhassan Location": [30.464388, 30.890404],
};

const STARTS: Record<number, [number, number]> = {
  1: cairoLocations["Tahrir Square"],
  2: cairoLocations["Ramsis Square"],
  3: cairoLocations["Dokki Square"],
  4: cairoLocations["Giza Square"],
  5: cairoLocations["Zamalek Club"],
  6: cairoLocations["Abbas El-Akkad Street"],
  7: cairoLocations["Alhassan Location"],
};

const zones: Record<string, Zone> = {
  "Downtown - Tahrir": {
    center: cairoLocations["Tahrir Square"],
    color: "#FF6384",
    description: "Central Cairo, Tahrir Square and Kasr El Nil area",
    radius: 0.004,
    majorStreets: ["Tahrir Square", "Kasr El Nil St"],
  },
  "Nasr City - Abbas El-Akkad": {
    center: cairoLocations["Abbas El-Akkad Street"],
    color: "#36A2EB",
    description: "Commercial hub on Abbas El-Akkad Street",
    radius: 0.006,
    majorStreets: ["Abbas El-Akkad St", "Makram Ebeid St"],
  },
  "Maadi - Road 9": {
    center: cairoLocations["Road 9"],
    color: "#FFCE56",
    description: "Main commercial streets in Maadi",
    radius: 0.005,
    majorStreets: ["Road 9", "Road 233"],
  },
  "Heliopolis - Merghany": {
    center: cairoLocations["Merghany Street"],
    color: "#4BC0C0",
    description: "Historic streets in Heliopolis",
    radius: 0.005,
    majorStreets: ["Merghany St", "Al-Ahram St"],
  },
  "Zamalek - 26th July": {
    center: cairoLocations["26th July Street"],
    color: "#9966FF",
    description: "Commercial streets in Zamalek island",
    radius: 0.003,
    majorStreets: ["26th July St", "Brazil St"],
  },
  "Giza - Pyramids Road": {
    center: cairoLocations["Pyramids Road (Harram)"],
    color: "#FF9F40",
    description: "Main roads in Giza area",
    radius: 0.005,
    majorStreets: ["Pyramids Road", "Faisal St"],
  },
};

const initialDrivers: Driver[] = [
  {
    id: 1,
    name: "Ahmed Hassan",
    color: "#3498DB",
    iconColor: "#FFFFFF",
    vehicle: "Mercedes Sprinter 2022",
    license: "CAI-12345",
    status: "available",
    currentLocation: STARTS[1],
    speed: 0,
    phone: "+20 100 123 4567",
  },
  {
    id: 2,
    name: "Mohamed Ali",
    color: "#E74C3C",
    iconColor: "#FFFFFF",
    vehicle: "Ford Transit 2021",
    license: "CAI-67890",
    status: "available",
    currentLocation: STARTS[2],
    speed: 0,
    phone: "+20 100 234 5678",
  },
  {
    id: 3,
    name: "Omar Khaled",
    color: "#2ECC71",
    iconColor: "#FFFFFF",
    vehicle: "Volkswagen Crafter 2023",
    license: "CAI-54321",
    status: "available",
    currentLocation: STARTS[3],
    speed: 0,
    phone: "+20 100 345 6789",
  },
  {
    id: 4,
    name: "Youssef Mahmoud",
    color: "#9B59B6",
    iconColor: "#FFFFFF",
    vehicle: "Renault Master 2020",
    license: "CAI-09876",
    status: "available",
    currentLocation: STARTS[4],
    speed: 0,
    phone: "+20 100 456 7890",
  },
  {
    id: 5,
    name: "Karim Said",
    color: "#F39C12",
    iconColor: "#FFFFFF",
    vehicle: "Toyota Hiace 2021",
    license: "CAI-11223",
    status: "available",
    currentLocation: STARTS[5],
    speed: 0,
    phone: "+20 100 567 8901",
  },
  {
    id: 6,
    name: "Hassan Ibrahim",
    color: "#1ABC9C",
    iconColor: "#FFFFFF",
    vehicle: "Peugeot Boxer 2022",
    license: "CAI-33445",
    status: "available",
    currentLocation: STARTS[6],
    speed: 0,
    phone: "+20 100 678 9012",
  },
  {
    id: 7,
    name: "Alhassan Hisham",
    color: "#FF6B6B",
    iconColor: "#FFFFFF",
    vehicle: "Plastic Scooter",
    license: "CAI-55667",
    status: "available",
    currentLocation: STARTS[7],
    speed: 0,
    phone: "+20 100 789 0123",
  },
];

const INCIDENTS = [
  { id: 1, lat: 30.050, lng: 31.233, type: 'roadwork', title: 'Road Expansion' },
  { id: 2, lat: 30.060, lng: 31.320, type: 'accident', title: 'Minor Collision' },
  { id: 3, lat: 30.020, lng: 31.205, type: 'roadwork', title: 'Metro Construction' },
  { id: 4, lat: 30.057, lng: 31.217, type: 'roadwork', title: 'Bridge Maintenance' },
];

const TRAFFIC_SEGMENTS = [
  { path: [cairoLocations["Tahrir Square"], cairoLocations["Ramsis Square"]], color: '#EF4444', weight: 4 }, // Red (Heavy)
  { path: [cairoLocations["Ramsis Square"], cairoLocations["Abbas El-Akkad Street"]], color: '#F59E0B', weight: 4 }, // Orange (Moderate)
  { path: [cairoLocations["Dokki Square"], cairoLocations["Giza Square"]], color: '#10B981', weight: 4 }, // Green (Clear)
  { path: [cairoLocations["Tahrir Square"], cairoLocations["Zamalek Club"]], color: '#F59E0B', weight: 4 }, // Orange
  { path: [cairoLocations["Abbas El-Akkad Street"], cairoLocations["Merghany Street"]], color: '#10B981', weight: 4 }, // Green
  { path: [cairoLocations["Zamalek Club"], cairoLocations["Dokki Square"]], color: '#EF4444', weight: 4 }, // Red
];

const WEATHER_DATA = [
  { id: 1, lat: 30.0444, lng: 31.2357, temp: '25°C', condition: 'sunny' },
  { id: 2, lat: 30.0620, lng: 31.3350, temp: '24°C', condition: 'cloudy' },
  { id: 3, lat: 30.0131, lng: 31.2089, temp: '26°C', condition: 'sunny' },
  { id: 4, lat: 30.0570, lng: 31.2175, temp: '23°C', condition: 'rain' },
];

function haversineKm(
  [lat1, lon1]: [number, number],
  [lat2, lon2]: [number, number],
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const LiveMapView: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [selectedZoneName, setSelectedZoneName] = useState<string | null>(null);
  const [activeRoutes, setActiveRoutes] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [globalSpeed, setGlobalSpeed] = useState(1);
  const playbackSpeedRef = useRef(1);
  const [mapStyle, setMapStyle] = useState<"satellite" | "standard" | "dark" | "terrain">("satellite");
  const [now, setNow] = useState<string>("Loading...");
  const [showTraffic, setShowTraffic] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showWeather, setShowWeather] = useState(true);

  const handleSpeedChange = (speed: number) => {
    setGlobalSpeed(speed);
    playbackSpeedRef.current = speed;
  };

  const mapRef = useRef<LeafletMap | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const driverLayersRef = useRef<Record<number, DriverRuntime>>({});
  const zoneLayersRef = useRef<Record<string, L.Circle>>({});
  const simulationTimerRef = useRef<any>(null);
  
  const trafficLayersRef = useRef<L.Polyline[]>([]);
  const incidentLayersRef = useRef<L.Marker[]>([]);
  const weatherLayersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      const t = new Date();
      setNow(t.toLocaleTimeString("en-US", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (mapRef.current || !mapDivRef.current) return;

    const map = L.map(mapDivRef.current).setView(CAIRO as LatLngExpression, 13);
    mapRef.current = map;

    // Fix map rendering issue in React
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    const baseLayers = {
      satellite: L.tileLayer(
        "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        { maxZoom: 19 },
      ),
      standard: L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { maxZoom: 19 },
      ),
      dark: L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 19 },
      ),
      terrain: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        maxZoom: 17,
      }),
    } as const;

    baseLayers.satellite.addTo(map);

    Object.entries(zones).forEach(([name, z]) => {
      const circle = L.circle(z.center, {
        color: z.color,
        fillColor: z.color,
        fillOpacity: 0.15,
        radius: z.radius * 111320,
        weight: 2,
      }).addTo(map);
      zoneLayersRef.current[name] = circle;

      L.marker(z.center, {
        icon: L.divIcon({
          html: `<div style="background:${z.color};color:#fff;padding:4px 8px;border-radius:12px;font-weight:bold;font-size:11px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);text-align:center;min-width:70px;">${name.split(" - ")[0]}</div>`,
          className: "",
        }),
      }).addTo(map);
    });

    initialDrivers.forEach((d) => {
      const marker = L.marker(d.currentLocation, {
        icon: L.divIcon({
          html: `<div style="width:40px;height:40px;background:${d.color};border-radius:50%;display:flex;align-items:center;justify-content:center;color:${d.iconColor};font-weight:bold;border:3px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,.4);font-size:16px;position:relative;">${d.name.charAt(0)}<div style="position:absolute;bottom:-5px;right:-5px;width:15px;height:15px;background:${d.status === "available" ? "#2ecc71" : "#e74c3c"};border-radius:50%;border:2px solid #fff;"></div></div>`,
          className: "driver-marker",
        }),
        zIndexOffset: 1000 + d.id,
      }).addTo(map);

      driverLayersRef.current[d.id] = {
        marker,
        isAnimating: false,
        isPaused: false,
        currentRoute: null,
        progress: 0,
        totalDistance: 0,
        totalDuration: 0,
        animationStartTime: null,
        elapsedSimulationTime: 0,
        remainingTime: 0,
        routePath: [],
        animationInterval: null,
        speedMultiplier: 1.0,
        baseTotalTime: 0,
        baseElapsedTime: 0,
        data: d,
      };
    });

    return () => {
      Object.values(driverLayersRef.current).forEach((dr) => {
        if (dr.animationInterval) clearInterval(dr.animationInterval);
        dr.marker.remove();
        if (dr.currentRoute) dr.currentRoute.remove();
      });
      Object.values(zoneLayersRef.current).forEach((z) => z.remove());
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) map.removeLayer(layer);
    });

    const layerByStyle: Record<typeof mapStyle, L.TileLayer> = {
      satellite: L.tileLayer(
        "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        { maxZoom: 19 },
      ),
      standard: L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { maxZoom: 19 },
      ),
      dark: L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 19 },
      ),
      terrain: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        maxZoom: 17,
      }),
    };
    layerByStyle[mapStyle].addTo(map);
  }, [mapStyle]);

  // Handle Traffic & Incidents Overlays
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old
    trafficLayersRef.current.forEach(layer => layer.remove());
    incidentLayersRef.current.forEach(layer => layer.remove());
    weatherLayersRef.current.forEach(layer => layer.remove());
    trafficLayersRef.current = [];
    incidentLayersRef.current = [];
    weatherLayersRef.current = [];

    if (showTraffic) {
      TRAFFIC_SEGMENTS.forEach(async (seg: any) => {
        let coords = seg.path as [number, number][];
        if (!seg.realPath) {
           try {
              const str = coords.map((c: any) => `${c[1]},${c[0]}`).join(';');
              const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${str}?overview=full&geometries=geojson`);
              const data = await res.json();
              if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                 seg.realPath = data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
              }
           } catch(e) { console.error(e); }
        }
        if (seg.realPath) coords = seg.realPath;

        if (mapRef.current && showTraffic) { // Ensure map and toggle didn't vanish
          const pl = L.polyline(coords, { 
            color: seg.color, 
            weight: seg.weight, 
            opacity: 0.8 
          }).addTo(mapRef.current);
          trafficLayersRef.current.push(pl);
        }
      });
    }

    if (showIncidents) {
      INCIDENTS.forEach(inc => {
        const isRoadwork = inc.type === 'roadwork';
        const iconHtml = isRoadwork ? '🚧' : '⚠️';
        const marker = L.marker([inc.lat, inc.lng], {
          icon: L.divIcon({
            html: `<div class="incident-marker incident-${inc.type}" title="${inc.title}" style="background:white;border-radius:50%;padding:4px;box-shadow:0 2px 4px rgba(0,0,0,0.2);display:inline-block;font-size:16px;">${iconHtml}</div>`,
            className: ''
          }),
          zIndexOffset: 500
        }).addTo(map);
        incidentLayersRef.current.push(marker);
      });
    }

    if (showWeather) {
      WEATHER_DATA.forEach(w => {
        const iconHtml = w.condition === 'sunny' ? '☀️' : w.condition === 'rain' ? '🌧️' : '☁️';
        const marker = L.marker([w.lat, w.lng], {
          icon: L.divIcon({
            html: `<div style="background:rgba(255,255,255,0.9);border-radius:12px;padding:4px 8px;box-shadow:0 2px 5px rgba(0,0,0,0.2);display:flex;align-items:center;gap:4px;font-weight:bold;font-size:12px;color:#333;width:max-content;backdrop-filter:blur(4px);">
              <span style="font-size:16px">${iconHtml}</span> ${w.temp}
            </div>`,
            className: ''
          }),
          zIndexOffset: 400
        }).addTo(map);
        weatherLayersRef.current.push(marker);
      });
    }
  }, [showTraffic, showIncidents, showWeather]);

  const selectDriver = useCallback((id: number) => {
    setSelectedDriverId(id);
    const dr = driverLayersRef.current[id];
    if (dr && !dr.isAnimating)
      mapRef.current?.setView(dr.marker.getLatLng(), 14);
  }, []);

  const selectZone = useCallback((name: string) => {
    setSelectedZoneName(name);
    const anyAnimating = Object.values(driverLayersRef.current).some(
      (d) => d.isAnimating,
    );
    if (!anyAnimating) mapRef.current?.setView(zones[name].center, 14);
  }, []);

  const zoomIn = () => mapRef.current?.zoomIn();
  const zoomOut = () => mapRef.current?.zoomOut();
  const resetView = () =>
    mapRef.current?.setView(CAIRO as LatLngExpression, 13);
  const locate = () => {
    if (navigator.geolocation && mapRef.current) {
      navigator.geolocation.getCurrentPosition((pos) =>
        mapRef.current!.setView(
          [pos.coords.latitude, pos.coords.longitude],
          15,
        ),
      );
    }
  };

  async function getRealRoadRoute(
    start: [number, number],
    end: [number, number],
  ) {
    try {
      // OSRM expects longitude,latitude format
      const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`);
      const data = await response.json();

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        // OSRM returns coordinates as [lon, lat], Leaflet expects [lat, lon]
        const path = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number]);
        
        return {
          path,
          distance: route.distance / 1000, // convert meters to km
          duration: route.duration / 60, // convert seconds to minutes
          source: "OSRM" as const,
        };
      }
    } catch (error) {
      console.error("OSRM Routing failed, falling back to direct calculation", error);
    }
    
    // Fallback if API fails
    const dist = haversineKm(start, end);
    return {
      path: [start, end] as [number, number][],
      distance: dist,
      duration: dist * 2.5,
      source: "Direct" as const,
    };
  }

  const planRoute = async () => {
    if (!selectedDriverId || !selectedZoneName || !mapRef.current) return;
    const dr = driverLayersRef.current[selectedDriverId];
    const zone = zones[selectedZoneName];
    if (!dr || !zone) return;

    if (dr.currentRoute) mapRef.current.removeLayer(dr.currentRoute);

    const route = await getRealRoadRoute(dr.data.currentLocation, zone.center);
    dr.currentRoute = L.polyline(route.path, {
      color: dr.data.color,
      weight: 6,
      opacity: 0.9,
    }).addTo(mapRef.current);

    dr.totalDistance = route.distance;
    dr.totalDuration = Math.round(route.duration);
    dr.progress = 0;
    dr.elapsedSimulationTime = 0;
    dr.isPaused = false;
    dr.remainingTime = route.duration * 60000;
    dr.routePath = route.path;
    dr.baseTotalTime = route.duration * 60000;

    setActiveRoutes((v) => v + 1);
    setTotalDistance((v) => v + route.distance);
    mapRef.current.fitBounds(dr.currentRoute.getBounds());
  };

  const togglePause = () => {
    if (!selectedDriverId) return;
    const dr = driverLayersRef.current[selectedDriverId];
    if (!dr || !dr.isAnimating) return;
    
    dr.isPaused = !dr.isPaused;
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === selectedDriverId ? { ...d, status: dr.isPaused ? "paused" : "moving" } : d,
      ),
    );
  };

  const startJourney = () => {
    if (!selectedDriverId) return;
    const dr = driverLayersRef.current[selectedDriverId];
    if (!dr || !dr.currentRoute || dr.isAnimating) return;

    dr.isAnimating = true;
    dr.isPaused = false;
    dr.animationStartTime = Date.now();
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === selectedDriverId ? { ...d, status: "moving" } : d,
      ),
    );

    const tick = () => {
      if (!dr.isAnimating) return clearInterval(dr.animationInterval);
      if (dr.isPaused) return;

      dr.elapsedSimulationTime += 100 * playbackSpeedRef.current;
      const progress = Math.min(100, (dr.elapsedSimulationTime / dr.baseTotalTime) * 100);

      dr.progress = progress;
      dr.remainingTime = Math.max(0, dr.baseTotalTime - dr.elapsedSimulationTime);

      if (dr.routePath.length >= 2) {
        const totalSegments = dr.routePath.length - 1;
        const currentPos = (progress / 100) * totalSegments;
        const targetIndex = Math.min(Math.floor(currentPos), totalSegments - 1);
        const remainder = currentPos - targetIndex;

        const [sLat, sLng] = dr.routePath[targetIndex];
        const [eLat, eLng] = dr.routePath[targetIndex + 1];

        dr.marker.setLatLng([
          sLat + (eLat - sLat) * remainder,
          sLng + (eLng - sLng) * remainder,
        ]);
      }

      if (progress >= 100) {
        dr.isAnimating = false;
        clearInterval(dr.animationInterval);
        setDrivers((prev) =>
          prev.map((d) =>
            d.id === dr.data.id ? { ...d, status: "available", speed: 0 } : d,
          ),
        );
        setActiveRoutes((v) => Math.max(0, v - 1));
      }
    };
    dr.animationInterval = setInterval(tick, 100);
  };

  const stopAll = () => {
    Object.values(driverLayersRef.current).forEach((dr) => {
      if (dr.animationInterval) clearInterval(dr.animationInterval);
      dr.isAnimating = false;
      dr.isPaused = false;
      if (dr.currentRoute) mapRef.current?.removeLayer(dr.currentRoute);
    });
    setDrivers((prev) =>
      prev.map((d) => ({ ...d, status: "available", speed: 0 })),
    );
    setActiveRoutes(0);
  };

  const resetAll = () => {
    stopAll();
    Object.values(driverLayersRef.current).forEach(
      (dr) => dr.currentRoute && mapRef.current?.removeLayer(dr.currentRoute),
    );
    mapRef.current?.setView(CAIRO as LatLngExpression, 13);
    setSelectedDriverId(null);
    setSelectedZoneName(null);
    setActiveRoutes(0);
    setTotalDistance(0);
  };

  const applySpeed = () => {
    // simplified for brevity
  };

  const selectedDriver = drivers.find((d) => d.id === selectedDriverId) || null;
  const selectedZone = selectedZoneName ? zones[selectedZoneName] : null;

  return (
    <div className="app-container">
      <div className="header">
        <div>
          <h1>🗺️ Cairo Advanced Tracking</h1>
        </div>
        <div>
          <span>⌚ {now}</span>
        </div>
      </div>
      <div className="main-content">
        <div className="left-panel">
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-value">{drivers.length}</div>
              <div className="stat-label">Drivers</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{activeRoutes}</div>
              <div className="stat-label">Active</div>
            </div>
          </div>

          <div className="selection-section">
            <div className="section-title">Select Driver</div>
            {drivers.map((d) => (
              <div
                key={d.id}
                className={`driver-option ${selectedDriverId === d.id ? "selected" : ""}`}
                onClick={() => selectDriver(d.id)}
              >
                <div className="driver-avatar" style={{ background: d.color }}>
                  {d.name.charAt(0)}
                </div>
                <div>
                  <div>{d.name}</div>
                  <div style={{ fontSize: 12, color: "gray" }}>{d.vehicle}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="selection-section">
            <div className="section-title">Select Zone</div>
            {Object.entries(zones).map(([name, z]) => (
              <div
                key={name}
                className={`zone-option ${selectedZoneName === name ? "selected" : ""}`}
                onClick={() => selectZone(name)}
              >
                <div className="zone-icon" style={{ background: z.color }}>
                  📍
                </div>
                <div>
                  <div>{name}</div>
                  <div style={{ fontSize: 12, color: "gray" }}>
                    {z.description.substring(0, 25)}...
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="selection-section">
            <div className="section-title">Map Overlays</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#4b5563', fontWeight: 600 }}>
                <input type="checkbox" checked={showTraffic} onChange={e => setShowTraffic(e.target.checked)} style={{ accentColor: '#10b981', width: '16px', height: '16px' }} />
                Real-time Traffic
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#4b5563', fontWeight: 600 }}>
                <input type="checkbox" checked={showIncidents} onChange={e => setShowIncidents(e.target.checked)} style={{ accentColor: '#ef4444', width: '16px', height: '16px' }} />
                Road Incidents
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#4b5563', fontWeight: 600 }}>
                <input type="checkbox" checked={showWeather} onChange={e => setShowWeather(e.target.checked)} style={{ accentColor: '#3b82f6', width: '16px', height: '16px' }} />
                Live Weather
              </label>
            </div>
          </div>

          <div className="actions-section">
            <div className="action-buttons">
              <button
                className={`btn btn-primary ${(selectedDriver?.status === "moving" || selectedDriver?.status === "paused" || !selectedDriverId || !selectedZoneName) ? "btn-disabled" : ""}`}
                onClick={planRoute}
                disabled={selectedDriver?.status === "moving" || selectedDriver?.status === "paused"}
              >
                Plan Route
              </button>

              {selectedDriver?.status === "moving" ? (
                 <button className="btn btn-warning" onClick={togglePause}>
                   Pause Journey
                 </button>
              ) : selectedDriver?.status === "paused" ? (
                 <button className="btn btn-success" onClick={togglePause}>
                   Resume Journey
                 </button>
              ) : (
                 <button
                   className={`btn btn-success ${!(selectedDriverId && selectedZoneName) ? "btn-disabled" : ""}`}
                   onClick={startJourney}
                   disabled={!(selectedDriverId && selectedZoneName)}
                 >
                   Start Journey
                 </button>
              )}

              <button className="btn btn-danger" onClick={stopAll}>
                Stop All
              </button>
              <button className="btn btn-secondary" onClick={resetAll}>
                Reset
              </button>
            </div>

            <div className="speed-controls" style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Simulation Speed:</span>
              {[1, 2, 5, 10].map(s => (
                <button
                   key={s}
                   onClick={() => handleSpeedChange(s)}
                   style={{ 
                     padding: '4px 10px', 
                     borderRadius: '6px', 
                     border: 'none', 
                     cursor: 'pointer', 
                     fontWeight: 'bold',
                     background: globalSpeed === s ? '#3b82f6' : '#e5e7eb', 
                     color: globalSpeed === s ? 'white' : '#4b5563',
                     transition: 'all 0.2s'
                   }}
                >
                   {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="map-container">
          <div id="map" ref={mapDivRef}></div>
          
          {/* Weather Widget */}
          <div className="weather-widget">
            <ThermometerSun className="w-8 h-8 text-amber-500" />
            <div>
              <div style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1 }}>Cairo, EG</div>
              <div style={{ fontSize: '1.2rem', color: '#111827' }}>34°C <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: '#4B5563' }}>Sunny</span></div>
            </div>
          </div>

          {/* Map Feature Toggles */}
          <div className="map-toggles">
            <button 
              className={`toggle-btn ${showTraffic ? 'active' : ''}`}
              onClick={() => setShowTraffic(!showTraffic)}
              title="Toggle Live Traffic"
            >
              <CarFront className="w-5 h-5" />
            </button>
            <button 
              className={`toggle-btn ${showIncidents ? 'active' : ''}`}
              onClick={() => setShowIncidents(!showIncidents)}
              title="Toggle Incident Reports"
            >
              <AlertTriangle className="w-5 h-5" />
            </button>
          </div>

          {/* Traffic Legend Overlay */}
          <AnimatePresence>
            {showTraffic && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="traffic-legend"
              >
                <div className="traffic-legend-item">
                  <div className="traffic-dot" style={{ background: '#10B981', boxShadow: '0 0 5px #10B981' }}></div> Fast
                </div>
                <div className="traffic-legend-item">
                  <div className="traffic-dot" style={{ background: '#F59E0B', boxShadow: '0 0 5px #F59E0B' }}></div> Moderate
                </div>
                <div className="traffic-legend-item">
                  <div className="traffic-dot" style={{ background: '#EF4444', boxShadow: '0 0 5px #EF4444' }}></div> Heavy
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="map-style-selector">
            <button
              className={`map-style-btn ${mapStyle === "standard" ? "active" : ""}`}
              onClick={() => setMapStyle("standard")}
            >
              🗺️
            </button>
            <button
              className={`map-style-btn ${mapStyle === "satellite" ? "active" : ""}`}
              onClick={() => setMapStyle("satellite")}
            >
              🛰️
            </button>
            <button
              className={`map-style-btn ${mapStyle === "dark" ? "active" : ""}`}
              onClick={() => setMapStyle("dark")}
            >
              🌙
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMapView;
