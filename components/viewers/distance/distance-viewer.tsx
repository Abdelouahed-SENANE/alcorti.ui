"use client";

import { Card, CardContent } from "@/components/ui/card";
import { calculateDistance } from "@/services";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Custom marker factory with pulse animation
const createCustomMarker = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="marker-container">
        <div class="marker-pulse" style="background: ${color}"></div>
        <div class="marker-dot" style="background: ${color}"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

// Custom zoom controls component
const CustomZoomControls = dynamic(
  () =>
    Promise.resolve(() => {
      const { useMap } = require("react-leaflet");
      const map = useMap();

      return (
        <div className="absolute right-3 top-3 z-400 flex flex-col overflow-hidden rounded-md border border-border bg-background shadow-sm">
          <button
            type="button"
            onClick={() => map.zoomIn()}
            aria-label="Zoom in"
            className="flex size-7 items-center justify-center border-b border-border hover:bg-accent transition-colors"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => map.zoomOut()}
            aria-label="Zoom out"
            className="flex size-7 items-center justify-center hover:bg-accent transition-colors"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      );
    }),
  { ssr: false },
);

// Auto-fit bounds component — centers and zooms the map to show both markers
const FitBounds = dynamic(
  () =>
    Promise.resolve(({ points }: { points: [number, number][] }) => {
      const { useMap } = require("react-leaflet");
      const map = useMap();

      useEffect(() => {
        if (points.length < 2) return;
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 10 });
      }, [points, map]);

      return null;
    }),
  { ssr: false },
);

interface DistanceViewerProps {
  origin: { lat: number; lng: number; label: string };
  destination: { lat: number; lng: number; label: string };
}

export const DistanceViewer = ({
  origin,
  destination,
}: DistanceViewerProps) => {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !origin || !destination) {
    return null;
  }

  const originLat = Number(origin.lat);
  const originLng = Number(origin.lng);
  const destLat = Number(destination.lat);
  const destLng = Number(destination.lng);

  if (
    isNaN(originLat) ||
    isNaN(originLng) ||
    isNaN(destLat) ||
    isNaN(destLng)
  ) {
    return null;
  }

  const distance = calculateDistance(originLat, originLng, destLat, destLng);

  const originIcon = createCustomMarker("oklch(0.43 0.04 41.99)");
  const destinationIcon = createCustomMarker("oklch(0.43 0.04 41.99)");

  const center: [number, number] = [
    (originLat + destLat) / 2,
    (originLng + destLng) / 2,
  ];

  const positions: [number, number][] = [
    [originLat, originLng],
    [destLat, destLng],
  ];

  return (
    <>
      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }

        .marker-container {
          position: relative;
          width: 20px;
          height: 20px;
        }

        .marker-dot {
          position: absolute;
          inset: 0px;
          border-radius: 50%;
          border: 6px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          z-index: 2;
        }

        .marker-pulse {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          opacity: 0.5;
          z-index: 1;
          animation: marker-pulse 2s ease-out infinite;
        }

        @keyframes marker-pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }

        /* Modern popup styling */
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 0.5px solid hsl(var(--border));
        }

        .leaflet-popup-content {
          margin: 10px 14px;
          font-size: 13px;
          font-weight: 500;
        }

        .leaflet-popup-tip {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
      `}</style>

      <Card className="overflow-hidden p-0 border-none shadow-none bg-transparent">
        <CardContent className="p-0 space-y-4">
          <div className="h-[320px] w-full relative rounded-xl overflow-hidden border border-border">
            <MapContainer
              center={center}
              zoom={6}
              scrollWheelZoom={false}
              zoomControl={false}
              style={{ height: "100%", width: "100%", background: "#aad3df" }}
            >
              {/* Modern clean tile layer */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
                maxZoom={10}
                detectRetina={true}
              />

              {/* Origin marker (blue) */}
              <Marker position={[originLat, originLng]} icon={originIcon}>
                <Popup>{origin.label}</Popup>
              </Marker>

              {/* Destination marker (green) */}
              <Marker position={[destLat, destLng]} icon={destinationIcon}>
                <Popup>{destination.label}</Popup>
              </Marker>

              {/* Route line (Solid blue like the image) */}
              <Polyline
                positions={positions}
                pathOptions={{
                  color: "oklch(0.43 0.04 41.99)",
                  weight: 3,
                  opacity: 0.9,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />

              {/* Auto-fit to show both markers */}
              <FitBounds points={positions} />

              {/* Custom zoom controls */}
              <CustomZoomControls />
            </MapContainer>

            {/* Distance pill — bottom left */}
            <div className="absolute bottom-3 left-3 z-400">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-2 shadow-sm backdrop-blur-md">
                <Navigation className="size-4 text-primary" />
                <div className="flex items-center gap-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-foreground">
                    {t("shipments.form.summary.estimated_distance")}
                  </p>
                  <p className="text-xs font-bold leading-tight text-primary">
                    {distance} {t("global.km")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
