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

type Driver = {
  id: number;
  name: string;
  color: string;
  iconColor: string;
  vehicle: string;
  license: string;
  status: "available" | "moving" | "idle";
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
};

const STARTS: Record<number, [number, number]> = {
  1: cairoLocations["Tahrir Square"],
  2: cairoLocations["Ramsis Square"],
  3: cairoLocations["Dokki Square"],
  4: cairoLocations["Giza Square"],
  5: cairoLocations["Zamalek Club"],
  6: cairoLocations["Abbas El-Akkad Street"],
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
  const [currentSpeedSetting, setCurrentSpeedSetting] = useState(40);
  const [mapStyle, setMapStyle] = useState<
    "satellite" | "standard" | "dark" | "terrain"
  >("satellite");
  const [now, setNow] = useState<string>("Loading...");
  const [simulationStart, setSimulationStart] = useState<number | null>(null);

  const mapRef = useRef<LeafletMap | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const driverLayersRef = useRef<Record<number, DriverRuntime>>({});
  const zoneLayersRef = useRef<Record<string, L.Circle>>({});
  const simulationTimerRef = useRef<any>(null);

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
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
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
        currentRoute: null,
        progress: 0,
        totalDistance: 0,
        totalDuration: 0,
        animationStartTime: null,
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
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
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
    dr.remainingTime = route.duration * 60000;
    dr.routePath = route.path;
    dr.baseTotalTime = route.duration * 60000;

    setActiveRoutes((v) => v + 1);
    setTotalDistance((v) => v + route.distance);
    mapRef.current.fitBounds(dr.currentRoute.getBounds());
  };

  const startJourney = () => {
    if (!selectedDriverId) return;
    const dr = driverLayersRef.current[selectedDriverId];
    if (!dr || !dr.currentRoute || dr.isAnimating) return;

    dr.isAnimating = true;
    dr.animationStartTime = Date.now();
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === selectedDriverId ? { ...d, status: "moving" } : d,
      ),
    );
    setSimulationStart(Date.now());

    const tick = () => {
      if (!dr.isAnimating) return clearInterval(dr.animationInterval);
      const elapsed = Date.now() - (dr.animationStartTime ?? Date.now());
      const progress = Math.min(100, (elapsed / dr.baseTotalTime) * 100);

      dr.progress = progress;
      dr.remainingTime = Math.max(0, dr.baseTotalTime - elapsed);

      if (dr.routePath.length >= 2) {
        const [sLat, sLng] = dr.routePath[0];
        const [eLat, eLng] = dr.routePath[dr.routePath.length - 1];
        dr.marker.setLatLng([
          sLat + (eLat - sLat) * (progress / 100),
          sLng + (eLng - sLng) * (progress / 100),
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

          <div className="actions-section">
            <div className="action-buttons">
              <button
                className={`btn btn-primary ${!(selectedDriverId && selectedZoneName) ? "btn-disabled" : ""}`}
                onClick={planRoute}
              >
                Plan Route
              </button>
              <button
                className={`btn btn-success ${!(selectedDriverId && selectedZoneName) ? "btn-disabled" : ""}`}
                onClick={startJourney}
              >
                Start Journey
              </button>
              <button className="btn btn-danger" onClick={stopAll}>
                Stop All
              </button>
              <button className="btn btn-secondary" onClick={resetAll}>
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="map-container">
          <div id="map" ref={mapDivRef}></div>
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
