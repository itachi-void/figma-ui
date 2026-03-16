import React, { useEffect, useRef } from 'react';
import { Driver, Route, Center, Community } from './types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface FleetMapProps {
  role: string;
  currentUserId?: string;
  center: [number, number];
  zoom: number;
  height: string;
  drivers: Driver[];
  routes: Route[];
  centers: Center[];
  communities: Community[];
  onDriverClick: (driver: Driver) => void;
  onRouteClick: (route: Route) => void;
  onCenterClick: (center: Center) => void;
  onCommunityClick: (community: Community) => void;
  theme?: 'dark' | 'light';
  showLayerControl?: boolean;
  showLegend?: boolean;
}

export default function FleetMap({
  role,
  center,
  zoom,
  height,
  drivers,
  routes,
  centers,
  communities,
  onDriverClick,
  onRouteClick,
  onCenterClick,
  onCommunityClick,
}: FleetMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(center, zoom);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing markers/layers conceptually (would need a layered approach in reality)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Add Drivers
    drivers.forEach(driver => {
      const marker = L.marker([driver.lat, driver.lng]).addTo(map);
      marker.on('click', () => onDriverClick(driver));
      marker.bindTooltip(driver.name);
    });

    // Add Centers
    centers.forEach(center => {
       const marker = L.marker([center.lat, center.lng]).addTo(map);
       marker.on('click', () => onCenterClick(center));
       marker.bindTooltip(center.name);
    });

    // Add Communities
    communities.forEach(community => {
       const marker = L.marker([community.lat, community.lng]).addTo(map);
       marker.on('click', () => onCommunityClick(community));
       marker.bindTooltip(community.name);
    });

    // Add Routes
    routes.forEach(async (route) => {
      if (!route.coordinates || route.coordinates.length < 2) return;
      
      let pathCoords = route.coordinates as [number, number][];
      
      try {
        const coordsStr = pathCoords.map(c => `${c[1]},${c[0]}`).join(';');
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`);
        const data = await res.json();
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
           pathCoords = data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
        }
      } catch (e) {
        console.error("OSRM route fetch failed", e);
      }

      if (mapRef.current) {
        const polyline = L.polyline(pathCoords as L.LatLngExpression[], { color: '#3b82f6', weight: 4, opacity: 0.8 }).addTo(mapRef.current);
        polyline.on('click', () => onRouteClick(route));
        polyline.bindTooltip(route.name);
      }
    });

    return () => {
      // Cleanup? Only if we unmount
    };
  }, [center, zoom, drivers, routes, centers, communities, onDriverClick, onRouteClick, onCenterClick, onCommunityClick]);

  // Clean up on complete unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={mapContainerRef} style={{ height, width: '100%', borderRadius: '1rem', zIndex: 0 }} />
  );
}
