// components/RoutingMachine.tsx
"use client";

import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface RoutingMachineProps {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  color?: string;
  onRouteFound?: (distance: number, duration: number) => void;
}

export const RoadViewer = ({
  origin,
  destination,
  color = "oklch(0.43 0.04 41.99)",
  onRouteFound,
}: RoutingMachineProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // @ts-ignore — L.Routing is added by the plugin
    const routingControl = (L.Routing as any)
      .control({
        waypoints: [
          L.latLng(origin.lat, origin.lng),
          L.latLng(destination.lat, destination.lng),
        ],
        lineOptions: {
          styles: [
            {
              color,
              weight: 4,
              opacity: 0.9,
            },
          ],
          extendToWaypoints: true,
          missingRouteTolerance: 0,
        },
        addWaypoints: false,
        fitSelectedRoutes: false,
        showAlternatives: false,
        show: false,
        createMarker: () => null,
        router: (L.Routing as any).osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
          profile: "driving",
        }),
      })
      .addTo(map);

    // Listen for route events
    routingControl.on("routesfound", (e: any) => {
      const route = e.routes[0];
      if (onRouteFound) {
        onRouteFound(route.summary.totalDistance, route.summary.totalTime);
      }

      // Zoom out: fit bounds with extra padding
      if (map && route.coordinates) {
        const bounds = L.latLngBounds(route.coordinates);
        map.fitBounds(bounds, { padding: [80, 80] });
      }
    });

    return () => {
      if (map && routingControl) {
        try {
          routingControl.getPlan().setWaypoints([]);
          map.removeControl(routingControl);
        } catch (e) {}
      }
    };
  }, [map, origin.lat, origin.lng, destination.lat, destination.lng, color]);

  return null;
};
