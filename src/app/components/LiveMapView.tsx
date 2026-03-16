import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import L, { LatLngExpression, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import './LiveMapView.css';
// لو تستخدم npm لـ FontAwesome
// import '@fortawesome/fontawesome-free/css/all.min.css';

type Driver = {
  id: number;
  name: string;
  color: string;
  iconColor: string;
  vehicle: string;
  license: string;
  status: 'available' | 'moving' | 'idle';
  currentLocation: [number, number];
  speed: number;
  phone: string;
};

type Zone = {
  center: [number, number];
  color: string;
  description: string;
  radius: number; // degrees multiplier (سنحوّله لمتر)
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
  "Mogamma Building": [30.0450, 31.2345],
  "Cairo Opera House": [30.0420, 31.2235],
  "Kasr El Nil Bridge": [30.0430, 31.2300],
  "Ramsis Square": [30.0622, 31.2469],
  "Cairo Tower": [30.0458, 31.2243],
  "Zamalek Club": [30.0561, 31.2194],
  "26th July Street": [30.0570, 31.2175],
  "Brazil Street": [30.0580, 31.2150],
  "Heliopolis Square (El-Nozha)": [30.0961, 31.3306],
  "Nozha Street": [30.0975, 31.3220],
  "Al-Ahram Street": [30.0830, 31.3150],
  "Merghany Street": [30.0920, 31.3280],
  "Abbas El-Akkad Street": [30.0620, 31.3350],
  "Makram Ebeid Street": [30.0720, 31.3280],
  "Nasr City Police Station": [30.0580, 31.3400],
  "El-Tayaran Street": [30.0650, 31.3320],
  "Road 9": [29.9650, 31.2620],
  "Road 233": [29.9680, 31.2600],
  "Corniche El-Maadi": [29.9600, 31.2600],
  "Maadi Grand Mall": [29.9660, 31.2650],
  "Giza Square": [30.0131, 31.2089],
  "Pyramids Road (Harram)": [30.0250, 31.1950],
  "Faisal Street": [30.0220, 31.2000],
  "Cairo University": [30.0270, 31.2100],
  "Dokki Square": [30.0400, 31.2150],
  "Mohanadiseen": [30.0530, 31.2000],
  "Lebanon Square": [30.0550, 31.2050],
  "El-Batal Ahmed Abdel Aziz": [30.0480, 31.2100],
  "American University": [30.0190, 31.5000],
  "Fifth Settlement": [30.0300, 31.4700],
  "90th Street": [30.0220, 31.4800],
  "Shubra Street": [30.0833, 31.2333],
  "Rod El-Farag": [30.0750, 31.2400],
  "Sphinx Square": [30.0570, 31.1950],
  "Gameat El Dowal El Arabiya": [30.0550, 31.1900],
  "Ain Shams University": [30.0770, 31.2900],
  "Mataria Palace": [30.1300, 31.3100],
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
  "Downtown - Tahrir & Kasr El Nil": {
    center: cairoLocations["Tahrir Square"], color: "#FF6384",
    description: "Central Cairo, Tahrir Square and Kasr El Nil area",
    radius: 0.004, majorStreets: ["Tahrir Square", "Kasr El Nil St", "Mohamed Mahmoud St"]
  },
  "Nasr City - Abbas El-Akkad": {
    center: cairoLocations["Abbas El-Akkad Street"], color: "#36A2EB",
    description: "Commercial hub on Abbas El-Akkad Street",
    radius: 0.006, majorStreets: ["Abbas El-Akkad St", "Makram Ebeid St", "El-Tayaran St"]
  },
  "Maadi - Road 9 & Road 233": {
    center: cairoLocations["Road 9"], color: "#FFCE56",
    description: "Main commercial streets in Maadi",
    radius: 0.005, majorStreets: ["Road 9", "Road 233", "Corniche El-Maadi"]
  },
  "Heliopolis - Merghany & Al-Ahram": {
    center: cairoLocations["Merghany Street"], color: "#4BC0C0",
    description: "Historic streets in Heliopolis",
    radius: 0.005, majorStreets: ["Merghany St", "Al-Ahram St", "Nozha St"]
  },
  "Zamalek - 26th July & Brazil": {
    center: cairoLocations["26th July Street"], color: "#9966FF",
    description: "Commercial streets in Zamalek island",
    radius: 0.003, majorStreets: ["26th July St", "Brazil St", "El-Gezira St"]
  },
  "Giza - Pyramids Road & Faisal": {
    center: cairoLocations["Pyramids Road (Harram)"], color: "#FF9F40",
    description: "Main roads in Giza area",
    radius: 0.005, majorStreets: ["Pyramids Road", "Faisal St", "El-Nil St"]
  }
};

const initialDrivers: Driver[] = [
  { id: 1, name: "Ahmed Hassan", color: "#3498DB", iconColor: "#FFFFFF", vehicle: "Mercedes Sprinter 2022", license: "CAI-12345", status: "available", currentLocation: STARTS[1], speed: 0, phone: "+20 100 123 4567" },
  { id: 2, name: "Mohamed Ali", color: "#E74C3C", iconColor: "#FFFFFF", vehicle: "Ford Transit 2021", license: "CAI-67890", status: "available", currentLocation: STARTS[2], speed: 0, phone: "+20 100 234 5678" },
  { id: 3, name: "Omar Khaled", color: "#2ECC71", iconColor: "#FFFFFF", vehicle: "Volkswagen Crafter 2023", license: "CAI-54321", status: "available", currentLocation: STARTS[3], speed: 0, phone: "+20 100 345 6789" },
  { id: 4, name: "Youssef Mahmoud", color: "#9B59B6", iconColor: "#FFFFFF", vehicle: "Renault Master 2020", license: "CAI-09876", status: "available", currentLocation: STARTS[4], speed: 0, phone: "+20 100 456 7890" },
  { id: 5, name: "Karim Said", color: "#F39C12", iconColor: "#FFFFFF", vehicle: "Toyota Hiace 2021", license: "CAI-11223", status: "available", currentLocation: STARTS[5], speed: 0, phone: "+20 100 567 8901" },
  { id: 6, name: "Hassan Ibrahim", color: "#1ABC9C", iconColor: "#FFFFFF", vehicle: "Peugeot Boxer 2022", license: "CAI-33445", status: "available", currentLocation: STARTS[6], speed: 0, phone: "+20 100 678 9012" },
];

function haversineKm([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) ** 2 +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const LiveMapView: React.FC = () => {
  // ======== State (React) ========
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [selectedZoneName, setSelectedZoneName] = useState<string | null>(null);
  const [activeRoutes, setActiveRoutes] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [currentSpeedSetting, setCurrentSpeedSetting] = useState(40);
  const [mapStyle, setMapStyle] = useState<'satellite'|'standard'|'dark'|'terrain'>('satellite');
  const [now, setNow] = useState<string>('Loading...');
  const [simulationStart, setSimulationStart] = useState<number | null>(null);

  // ======== Refs ========
  const mapRef = useRef<LeafletMap | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const driverLayersRef = useRef<Record<number, DriverRuntime>>({});
  const zoneLayersRef = useRef<Record<string, L.Circle>>({});
  const simulationTimerRef = useRef<any>(null);

  // ======== Effects: System clock ========
  useEffect(() => {
    const timer = setInterval(() => {
      const t = new Date();
      const timeStr = t.toLocaleTimeString('en-US', { hour12: false });
      setNow(timeStr);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ======== Effect: Initialize Map ========
  useEffect(() => {
    if (mapRef.current || !mapDivRef.current) return;

    const map = L.map(mapDivRef.current).setView(CAIRO as LatLngExpression, 13);
    mapRef.current = map;

    // Base layers
    const baseLayers = {
      satellite: L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: '© Esri, Earthstar Geographics', maxZoom: 19, minZoom: 10 }
      ),
      standard: L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: '© OpenStreetMap contributors', maxZoom: 19, minZoom: 10 }
      ),
      dark: L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { attribution: '© OpenStreetMap, © CartoDB', maxZoom: 19, minZoom: 10, subdomains: 'abcd' }
      ),
      terrain: L.tileLayer(
        'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        { attribution: '© OpenStreetMap, © OpenTopoMap', maxZoom: 17, minZoom: 10 }
      ),
    } as const;

    baseLayers.satellite.addTo(map);

    // Zones
    Object.entries(zones).forEach(([name, z]) => {
      const circle = L.circle(z.center, {
        color: z.color, fillColor: z.color, fillOpacity: 0.15,
        radius: z.radius * 111320, weight: 2
      }).addTo(map);
      zoneLayersRef.current[name] = circle;

      L.marker(z.center, {
        icon: L.divIcon({
          html: `<div style="
            background:${z.color};color:#fff;padding:4px 8px;border-radius:12px;
            font-weight:bold;font-size:11px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);text-align:center;min-width:70px;">
            ${name.split(' - ')[0]}</div>`,
          iconSize: [80, 30],
          className: ''
        })
      }).addTo(map);
    });

    // Drivers
    initialDrivers.forEach(d => {
      const marker = L.marker(d.currentLocation, {
        icon: L.divIcon({
          html: `<div style="
            width:40px;height:40px;background:${d.color};border-radius:50%;
            display:flex;align-items:center;justify-content:center;color:${d.iconColor};
            font-weight:bold;border:3px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,.4);font-size:16px;position:relative;">
            ${d.name.charAt(0)}
            <div style="position:absolute;bottom:-5px;right:-5px;width:15px;height:15px;
            background:${d.status === 'available' ? '#2ecc71' : '#e74c3c'};
            border-radius:50%;border:2px solid #fff;"></div>
          </div>`,
          iconSize: [40, 40],
          className: 'driver-marker'
        }),
        zIndexOffset: 1000 + d.id
      }).addTo(map);

      marker.bindPopup(`
        <div style="padding:10px;min-width:250px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <div style="width:50px;height:50px;background:${d.color};border-radius:50%;
              display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:20px;">
              ${d.name.charAt(0)}
            </div>
            <div>
              <h3 style="margin:0 0 5px 0;color:#2c3e50;">${d.name}</h3>
              <p style="margin:0;font-size:12px;color:#7f8c8d;">
                <i class="fas fa-car"></i> ${d.vehicle}
              </p>
            </div>
          </div>
          <div style="background:#f8f9fa;border-radius:6px;padding:8px;margin-bottom:10px;">
            <p style="margin:0 0 5px 0;font-size:11px;color:#2c3e50;">
              <i class="fas fa-id-card"></i> <strong>License:</strong> ${d.license}
            </p>
            <p style="margin:0 0 5px 0;font-size:11px;color:#2c3e50;">
              <i class="fas fa-phone"></i> <strong>Phone:</strong> ${d.phone}
            </p>
            <p style="margin:0;font-size:11px;color:#2c3e50;">
              <i class="fas fa-map-marker-alt"></i>
              ${d.currentLocation[0].toFixed(6)}, ${d.currentLocation[1].toFixed(6)}
            </p>
          </div>
          <p style="margin:0;font-size:11px;color:#95a5a6;text-align:center;">
            <i class="fas fa-info-circle"></i> Click to select this driver
          </p>
        </div>
      `);

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
      // Cleanup on unmount
      Object.values(driverLayersRef.current).forEach(dr => {
        if (dr.animationInterval) clearInterval(dr.animationInterval);
        dr.marker.remove();
        if (dr.currentRoute) dr.currentRoute.remove();
      });
      Object.values(zoneLayersRef.current).forEach(z => z.remove());
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ======== Effect: Switch Base Layer when style changes ========
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove current tile layer(s)
    map.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) map.removeLayer(layer);
    });

    // Add selected
    const layerByStyle: Record<typeof mapStyle, L.TileLayer> = {
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri, Earthstar Geographics', maxZoom: 19, minZoom: 10,
      }),
      standard: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors', maxZoom: 19, minZoom: 10,
      }),
      dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap, © CartoDB', maxZoom: 19, minZoom: 10, subdomains: 'abcd',
      }),
      terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap, © OpenTopoMap', maxZoom: 17, minZoom: 10,
      }),
    };
    layerByStyle[mapStyle].addTo(map);
  }, [mapStyle]);

  // ======== Actions ========
  const selectDriver = useCallback((id: number) => {
    const map = mapRef.current;
    if (!map) return;
    if (selectedDriverId === id) return;

    setSelectedDriverId(id);
    const dr = driverLayersRef.current[id];
    if (dr) {
      dr.marker.setZIndexOffset(2000);
      dr.marker.openPopup();
      if (!dr.isAnimating) map.setView(dr.marker.getLatLng(), 14);
    }
  }, [selectedDriverId]);

  const selectZone = useCallback((name: string) => {
    const map = mapRef.current;
    if (!map) return;
    if (selectedZoneName === name) return;

    // Reset previous visual
    if (selectedZoneName && zoneLayersRef.current[selectedZoneName]) {
      zoneLayersRef.current[selectedZoneName].setStyle({ fillOpacity: 0.15, weight: 2 });
    }

    setSelectedZoneName(name);
    if (zoneLayersRef.current[name]) {
      zoneLayersRef.current[name].setStyle({ fillOpacity: 0.3, weight: 3 });
      zoneLayersRef.current[name].bringToFront();
      const anyAnimating = Object.values(driverLayersRef.current).some(d => d.isAnimating);
      if (!anyAnimating) map.setView(zones[name].center, 14);
    }
  }, [selectedZoneName]);

  const zoomIn = () => mapRef.current?.zoomIn();
  const zoomOut = () => mapRef.current?.zoomOut();
  const resetView = () => mapRef.current?.setView(CAIRO as LatLngExpression, 13);
  const locate = () => {
    if (!mapRef.current) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => mapRef.current!.setView([pos.coords.latitude, pos.coords.longitude], 15),
      () => {/* handle notification */}
    );
  };

  async function getRealRoadRoute(start: [number, number], end: [number, number]) {
    // OSRM public endpoint (قد ينهار تحت الضغط/CORS)
    try {
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
      const r = await fetch(osrmUrl);
      const j = await r.json();
      if (j.routes && j.routes.length > 0) {
        const route = j.routes[0];
        const distance = route.distance / 1000;
        const duration = route.duration / 60;
        const path: [number, number][] = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
        return { path, distance, duration, source: 'OSRM' as const };
      }
    } catch {}

    // GraphHopper (مفتاح مضمّن في القالب — من الأفضل جعله من الإعدادات)
    try {
      const k = 'd45e4afb-8c3c-4e0c-a9ea-90e0c5e1f4c5'; // ضع مفتاحك أو أنقل للإعدادات/بيئة
      const ghUrl = `https://graphhopper.com/api/1/route?point=${start[0]},${start[1]}&point=${end[0]},${end[1]}&vehicle=car&locale=en&key=${k}&instructions=false`;
      const r = await fetch(ghUrl);
      const j = await r.json();
      if (j.paths && j.paths.length > 0) {
        const path: [number, number][] = j.paths[0].points.coordinates.map((c: [number, number]) => [c[1], c[0]]);
        const distance = j.paths[0].distance / 1000;
        const duration = j.paths[0].time / 60000;
        return { path, distance, duration, source: 'GraphHopper' as const };
      }
    } catch {}

    // Fallback direct
    const dist = haversineKm(start, end);
    return { path: [start, end] as [number, number][], distance: dist, duration: dist * 2.5, source: 'Direct' as const };
  }

  const planRoute = async () => {
    if (!selectedDriverId || !selectedZoneName) return;
    const map = mapRef.current;
    if (!map) return;

    const dr = driverLayersRef.current[selectedDriverId];
    const zone = zones[selectedZoneName];
    if (!dr || !zone) return;

    // Remove previous
    if (dr.currentRoute) {
      map.removeLayer(dr.currentRoute);
      dr.currentRoute = null;
    }

    const route = await getRealRoadRoute(dr.data.currentLocation, zone.center);

    const routeLayer = L.polyline(route.path, {
      color: dr.data.color, weight: 6, opacity: 0.9, lineCap: 'round', lineJoin: 'round',
    }).addTo(map);

    dr.currentRoute = routeLayer;
    dr.totalDistance = route.distance;
    dr.totalDuration = Math.round(route.duration);
    dr.progress = 0;
    dr.remainingTime = route.duration * 60000;
    dr.routePath = route.path;
    dr.speedMultiplier = 1.0;
    dr.baseTotalTime = route.duration * 60000;
    dr.baseElapsedTime = 0;

    setActiveRoutes(v => v + 1);
    setTotalDistance(v => v + route.distance);

    map.fitBounds(routeLayer.getBounds());
  };

  const startJourney = () => {
    if (!selectedDriverId) return;
    const dr = driverLayersRef.current[selectedDriverId];
    if (!dr || !dr.currentRoute || dr.isAnimating) return;

    dr.isAnimating = true;
    dr.progress = 0;
    dr.remainingTime = dr.baseTotalTime;
    dr.animationStartTime = Date.now();
    dr.baseElapsedTime = 0;
    dr.speedMultiplier = 1.0;

    setDrivers(prev => prev.map(d => d.id === selectedDriverId ? { ...d, status: 'moving' } : d));
    setSimulationStart(Date.now());

    // Animation loop (مقتبس ومبسّط)
    const updateInterval = 100;

    const tick = () => {
      if (!dr.isAnimating) {
        clearInterval(dr.animationInterval);
        dr.animationInterval = null;
        return;
      }
      const elapsed = Date.now() - (dr.animationStartTime ?? Date.now());
      const totalTime = dr.baseTotalTime;
      const progress = Math.min(100, (elapsed / totalTime) * 100);

      dr.progress = progress;
      dr.remainingTime = Math.max(0, totalTime - elapsed);

      const path = dr.routePath;
      if (path && path.length >= 2) {
        const idx = Math.min(path.length - 2, Math.floor((progress / 100) * (path.length - 1)));
        const segProg = (progress / 100) * (path.length - 1) - idx;
        const [sLat, sLng] = path[idx];
        const [eLat, eLng] = path[idx + 1];
        const cLat = sLat + (eLat - sLat) * segProg;
        const cLng = sLng + (eLng - sLng) * segProg;
        dr.marker.setLatLng([cLat, cLng]);
      }

      if (progress >= 100) {
        dr.progress = 100;
        dr.remainingTime = 0;
        dr.isAnimating = false;
        clearInterval(dr.animationInterval);
        dr.animationInterval = null;

        setDrivers(prev => prev.map(d => d.id === dr.data.id ? { ...d, status: 'available', speed: 0 } : d));
        setActiveRoutes(v => Math.max(0, v - 1));
      }
    };

    if (dr.animationInterval) clearInterval(dr.animationInterval);
    dr.animationInterval = setInterval(tick, updateInterval);
  };

  const stopAll = () => {
    Object.values(driverLayersRef.current).forEach(dr => {
      if (dr.animationInterval) clearInterval(dr.animationInterval);
      dr.animationInterval = null;
      dr.isAnimating = false;
      dr.data.speed = 0;
    });
    setDrivers(prev => prev.map(d => ({ ...d, status: 'available', speed: 0 })));
    setActiveRoutes(0);
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = null;
    }
  };

  const resetAll = () => {
    stopAll();
    const map = mapRef.current;
    if (map) {
      Object.values(driverLayersRef.current).forEach(dr => {
        if (dr.currentRoute) {
          map.removeLayer(dr.currentRoute);
          dr.currentRoute = null;
        }
      });
      map.setView(CAIRO as LatLngExpression, 13);
    }
    setSelectedDriverId(null);
    setSelectedZoneName(null);
    setActiveRoutes(0);
    setTotalDistance(0);
    setCurrentSpeedSetting(40);
    setDrivers(initialDrivers);
  };

  const applySpeed = () => {
    if (!selectedDriverId) return;
    const dr = driverLayersRef.current[selectedDriverId];
    if (!dr || !dr.isAnimating) return;

    const baseSpeed = 40; // km/h
    const newMultiplier = currentSpeedSetting / baseSpeed;

    if (dr.animationInterval) {
      clearInterval(dr.animationInterval);
      const elapsed = Date.now() - (dr.animationStartTime ?? Date.now());
      const totalTime = dr.baseTotalTime;
      const remainingTime = totalTime - elapsed;
      const newRemainingTime = remainingTime / newMultiplier;
      const newTotalDuration = elapsed + newRemainingTime;

      dr.speedMultiplier = newMultiplier;
      dr.totalDuration = newTotalDuration / 60000;
      dr.remainingTime = newRemainingTime;
      dr.baseTotalTime = totalTime;
      dr.baseElapsedTime = elapsed;

      // restart
      dr.animationStartTime = Date.now() - elapsed;
      const updateInterval = 100;
      const tick = () => {
        if (!dr.isAnimating) {
          clearInterval(dr.animationInterval);
          dr.animationInterval = null;
          return;
        }
        const el = Date.now() - (dr.animationStartTime ?? Date.now());
        const total = dr.baseTotalTime;
        const prog = Math.min(100, (el / total) * 100);
        dr.progress = prog;
        dr.remainingTime = Math.max(0, total - el);

        const path = dr.routePath;
        if (path && path.length >= 2) {
          const idx = Math.min(path.length - 2, Math.floor((prog / 100) * (path.length - 1)));
          const segProg = (prog / 100) * (path.length - 1) - idx;
          const [sLat, sLng] = path[idx];
          const [eLat, eLng] = path[idx + 1];
          const cLat = sLat + (eLat - sLat) * segProg;
          const cLng = sLng + (eLng - sLng) * segProg;
          dr.marker.setLatLng([cLat, cLng]);
        }

        if (prog >= 100) {
          dr.progress = 100;
          dr.remainingTime = 0;
          dr.isAnimating = false;
          clearInterval(dr.animationInterval);
          dr.animationInterval = null;

          setDrivers(prev => prev.map(d => d.id === dr.data.id ? { ...d, status: 'available', speed: 0 } : d));
          setActiveRoutes(v => Math.max(0, v - 1));
        }
      };
      dr.animationInterval = setInterval(tick, updateInterval);
    }

    // تحديث السرعة المعروضة للسائق (تقريبية)
    const avgSpeed = (dr.totalDistance / (dr.baseTotalTime / 1000)) * 3600;
    const currentSpeed = avgSpeed * dr.speedMultiplier;
    setDrivers(prev => prev.map(d => d.id === dr.data.id ? { ...d, speed: Math.round(currentSpeed) } : d));
  };

  // ======== Derived UI values ========
  const selectedDriver = useMemo(() => drivers.find(d => d.id === selectedDriverId) || null, [drivers, selectedDriverId]);
  const selectedZone = useMemo(() => (selectedZoneName ? zones[selectedZoneName] : null), [selectedZoneName]);

  // ======== UI ========
  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <h1><i className="fas fa-map-marked-alt"></i> Cairo Advanced Tracking</h1>
          <p>Real-time tracking with detailed Cairo maps</p>
        </div>
        <div className="header-right">
          <div className="system-time">
            <i className="fas fa-clock"></i> <span>{now}</span>
          </div>
          <div className="system-status">
            <i className="fas fa-circle" style={{ color: '#2ecc71' }}></i> Live Tracking
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        
        {/* Left Panel */}
        <div className="left-panel">
          {/* Dashboard Stats */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon"><i className="fas fa-users"></i></div>
              <div className="stat-value">{drivers.length}</div>
              <div className="stat-label">Total Drivers</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="fas fa-map-marked-alt"></i></div>
              <div className="stat-value">{Object.keys(zones).length}</div>
              <div className="stat-label">Total Zones</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="fas fa-route"></i></div>
              <div className="stat-value">{activeRoutes}</div>
              <div className="stat-label">Active Routes</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="fas fa-road"></i></div>
              <div className="stat-value">{totalDistance.toFixed(1)} km</div>
              <div className="stat-label">Total Distance</div>
            </div>
          </div>

          {/* Driver Selection */}
          <div className="selection-section">
            <div className="section-title">
              <span><i className="fas fa-user-tie"></i> Select Driver</span>
            </div>
            <div className="driver-selection">
              {drivers.map(d => (
                <div
                  key={d.id}
                  className={`driver-option ${selectedDriverId === d.id ? 'selected' : ''}`}
                  onClick={() => selectDriver(d.id)}
                  data-driver-id={d.id}
                >
                  <div className="driver-avatar" style={{ background: d.color }}>
                    {d.name.charAt(0)}
                  </div>
                  <div className="driver-info">
                    <div className="driver-name">{d.name}</div>
                    <div className="driver-details">{d.vehicle} • {d.license}</div>
                    <div style={{ fontSize: 10, color: d.status === 'available' ? '#2ecc71' : '#e74c3c' }}>
                      <i className="fas fa-circle" style={{ fontSize: 6 }}></i> {d.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone Selection */}
          <div className="selection-section">
            <div className="section-title">
              <span><i className="fas fa-map-marked-alt"></i> Select Zone</span>
            </div>
            <div className="zone-selection">
              {Object.entries(zones).map(([name, z]) => (
                <div
                  key={name}
                  className={`zone-option ${selectedZoneName === name ? 'selected' : ''}`}
                  onClick={() => selectZone(name)}
                  data-zone-name={name}
                >
                  <div className="zone-icon" style={{ background: z.color }}>
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="zone-info">
                    <div className="zone-name">{name}</div>
                    <div className="zone-details">{z.description.substring(0, 35)}...</div>
                    <div style={{ fontSize: 9, color: '#95a5a6' }}>
                      <i className="fas fa-road"></i> {z.majorStreets[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Info */}
          <div className="selected-info">
            {!selectedDriver && !selectedZone && (
              <>
                <h3><i className="fas fa-info-circle"></i> Selection Summary</h3>
                <p>Select a driver and a zone to plan a route on detailed Cairo maps.</p>
              </>
            )}

            {selectedDriver && !selectedZone && selectedDriver && (
              <>
                <h3><i className="fas fa-user" style={{ color: '#3498db' }}></i> Driver Selected</h3>
                <p>
                  <strong>Driver:</strong> {selectedDriver.name}<br/>
                  <strong>Vehicle:</strong> {selectedDriver.vehicle}<br/>
                  <strong>License:</strong> {selectedDriver.license}<br/>
                  Now select a destination zone.
                </p>
              </>
            )}

            {selectedZone && !selectedDriver && (
              <>
                <h3><i className="fas fa-map-marker-alt" style={{ color: '#f39c12' }}></i> Zone Selected</h3>
                <p>
                  <strong>Zone:</strong> {selectedZoneName}<br/>
                  <strong>Major Streets:</strong> {selectedZone?.majorStreets.join(', ')}<br/>
                  Now select a driver for this zone.
                </p>
              </>
            )}

            {selectedDriver && selectedZone && (
              <>
                <h3><i className="fas fa-check-circle" style={{ color: '#2ecc71' }}></i> Ready for Cairo Route</h3>
                <p>
                  <strong>Driver:</strong> {selectedDriver.name}<br/>
                  <strong>Destination:</strong> {selectedZoneName?.split(' - ')[0]}<br/>
                  <strong>Vehicle:</strong> {selectedDriver.vehicle}<br/>
                  <span style={{ fontSize: 11, color: '#95a5a6' }}>
                    <i className="fas fa-info-circle"></i> Will follow detailed Cairo roads
                  </span>
                </p>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="actions-section">
            <div className="action-buttons">
              <button className={`btn btn-primary ${!(selectedDriverId && selectedZoneName) ? 'btn-disabled' : ''}`}
                      onClick={planRoute} disabled={!(selectedDriverId && selectedZoneName)}>
                <i className="fas fa-route"></i> Plan Detailed Route
              </button>
              <button className={`btn btn-success ${!(selectedDriverId && selectedZoneName) ? 'btn-disabled' : ''}`}
                      onClick={startJourney} disabled={!(selectedDriverId && selectedZoneName)}>
                <i className="fas fa-play"></i> Start Journey
              </button>
              <button className="btn btn-danger" onClick={stopAll}>
                <i className="fas fa-stop"></i> Stop All
              </button>
              <button className="btn btn-secondary" onClick={resetAll}>
                <i className="fas fa-redo"></i> Reset
              </button>
            </div>
          </div>
        </div> {/* END left-panel */}

        {/* Map Container */}
        <div className="map-container">
          <div id="map" ref={mapDivRef}></div>

          {/* Map Style Selector */}
          <div className="map-style-selector">
            <button className={`map-style-btn ${mapStyle === 'standard' ? 'active' : ''}`} onClick={() => setMapStyle('standard')} title="Standard Map">
              <i className="fas fa-map"></i>
            </button>
            <button className={`map-style-btn ${mapStyle === 'satellite' ? 'active' : ''}`} onClick={() => setMapStyle('satellite')} title="Satellite View">
              <i className="fas fa-satellite"></i>
            </button>
            <button className={`map-style-btn ${mapStyle === 'dark' ? 'active' : ''}`} onClick={() => setMapStyle('dark')} title="Dark Mode">
              <i className="fas fa-moon"></i>
            </button>
            <button className={`map-style-btn ${mapStyle === 'terrain' ? 'active' : ''}`} onClick={() => setMapStyle('terrain')} title="Terrain View">
              <i className="fas fa-mountain"></i>
            </button>
          </div>

          {/* Map Controls */}
          <div className="map-controls">
            <button className="map-btn" onClick={zoomIn} title="Zoom In"><i className="fas fa-plus"></i></button>
            <button className="map-btn" onClick={zoomOut} title="Zoom Out"><i className="fas fa-minus"></i></button>
            <button className="map-btn" onClick={resetView} title="Reset View"><i className="fas fa-home"></i></button>
            <button className="map-btn" onClick={locate} title="Locate Me"><i className="fas fa-location-arrow"></i></button>
          </div>

          {/* Status Overlay */}
          <div className="map-overlay status-overlay">
            <div className="status-title">
              <span><i className="fas fa-tachometer-alt"></i> Journey Status</span>
            </div>
            <div className="status-details">
              <div className="status-item">
                <span className="status-label">Selected Driver:</span>
                <span className="status-value">{selectedDriver?.name ?? 'None'}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Selected Zone:</span>
                <span className="status-value">{selectedZoneName?.split(' - ')[0] ?? 'None'}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Route Distance:</span>
                <span className="status-value">
                  {selectedDriverId ? (driverLayersRef.current[selectedDriverId]?.totalDistance ?? 0).toFixed(1) : '0'} km
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Est. Duration:</span>
                <span className="status-value">
                  {selectedDriverId ? Math.round(driverLayersRef.current[selectedDriverId]?.totalDuration ?? 0) : 0} min
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Current Speed:</span>
                <span className="status-value">{selectedDriver?.speed ?? 0} km/h</span>
              </div>
              <div className="status-item">
                <span className="status-label">Driver Status:</span>
                <span className="status-value">
                  {selectedDriver?.status ? (selectedDriver.status === 'moving' ? 'On Road' : selectedDriver.status) : 'Idle'}
                </span>
              </div>
            </div>

            {/* Speed Control */}
            <div className="speed-control-section">
              <div className="status-title" style={{ marginBottom: 8 }}>
                <span><i className="fas fa-tachometer-alt"></i> Speed Control</span>
              </div>
              <div className="speed-control">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span className="status-label">Current Speed:</span>
                  <span className="status-value">{currentSpeedSetting} km/h</span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                  <button className={`speed-btn speed-slow ${currentSpeedSetting === 20 ? 'active' : ''}`} onClick={() => setCurrentSpeedSetting(20)}>
                    <i className="fas fa-turtle"></i> Slow
                  </button>
                  <button className={`speed-btn speed-normal ${currentSpeedSetting === 40 ? 'active' : ''}`} onClick={() => setCurrentSpeedSetting(40)}>
                    <i className="fas fa-car"></i> Normal
                  </button>
                  <button className={`speed-btn speed-fast ${currentSpeedSetting === 60 ? 'active' : ''}`} onClick={() => setCurrentSpeedSetting(60)}>
                    <i className="fas fa-running"></i> Fast
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="status-label" style={{ fontSize: 11 }}>Custom:</span>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={currentSpeedSetting}
                    onChange={e => setCurrentSpeedSetting(parseInt(e.target.value))}
                    id="speedSlider"
                    style={{ flex: 1 }}
                  />
                  <span className="status-value" style={{ fontSize: 11, minWidth: 40 }}>
                    {currentSpeedSetting}
                  </span>
                </div>
                <button
                  className={`btn btn-secondary ${!(selectedDriverId && driverLayersRef.current[selectedDriverId]?.isAnimating) ? 'btn-disabled' : ''}`}
                  onClick={applySpeed}
                  style={{ marginTop: 8, padding: 6, fontSize: 11, width: '100%' }}
                  disabled={!(selectedDriverId && driverLayersRef.current[selectedDriverId]?.isAnimating)}
                >
                  <i className="fas fa-bolt"></i> Apply Speed
                </button>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="map-overlay legend">
            <h4><i className="fas fa-key"></i> Map Legend</h4>
            <div className="legend-items">
              <div className="legend-item"><div className="legend-color" style={{ background: '#2ecc71' }}></div><span>Available Driver</span></div>
              <div className="legend-item"><div className="legend-color" style={{ background: '#3498db' }}></div><span>Moving Driver</span></div>
              <div className="legend-item"><div className="legend-color" style={{ background: '#e74c3c' }}></div><span>Selected Zone</span></div>
              <div className="legend-item"><div className="legend-color" style={{ background: '#f39c12' }}></div><span>Real Cairo Road</span></div>
              <div className="legend-item"><div className="legend-color" style={{ background: '#9b59b6' }}></div><span>Driving Progress</span></div>
            </div>
          </div>

          {/* Progress Overlay */}
          <div className="map-overlay progress-overlay">
            <div className="status-title">
              <span><i className="fas fa-ruler"></i> Journey Progress</span>
            </div>
            <div className="progress-item">
              <span>Progress:</span>
              <span className="progress-value">
                {selectedDriverId ? (driverLayersRef.current[selectedDriverId]?.progress ?? 0).toFixed(1) : '0'}%
              </span>
            </div>
            <div className="progress-item">
              <span>Time Remaining:</span>
              <span className="progress-value">
                {selectedDriverId ? Math.round((driverLayersRef.current[selectedDriverId]?.remainingTime ?? 0) / 60000) : 0} min
              </span>
            </div>
            <div className="progress-item">
              <span>Distance Left:</span>
              <span className="progress-value">
                {selectedDriverId
                  ? (() => {
                      const dr = driverLayersRef.current[selectedDriverId];
                      if (!dr) return '0 km';
                      const left = dr.totalDistance * (1 - (dr.progress / 100));
                      return `${left.toFixed(1)} km`;
                    })()
                  : '0 km'}
              </span>
            </div>
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{
                  width: `${selectedDriverId ? (driverLayersRef.current[selectedDriverId]?.progress ?? 0) : 0}%`
                }}></div>
              </div>
              <div className="progress-text">
                Real Road Journey: 
                <span style={{ marginLeft: 6 }}>
                  {simulationStart
                    ? (() => {
                        const elapsed = Date.now() - simulationStart;
                        const m = Math.floor(elapsed / 60000).toString().padStart(2, '0');
                        const s = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
                        return `${m}:${s}`;
                      })()
                    : '00:00'}
                </span>
              </div>
            </div>
          </div>

        </div> {/* END map-container */}
      </div> {/* END main-content */}
    </div> {/* END app-container */}
  );
};

export default LiveMapView;