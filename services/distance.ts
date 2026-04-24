// services/distance.ts
interface Point {
  lat: number;
  lng: number;
}

export interface RouteResult {
  distanceKm: number; // real driving distance in km
  durationMin: number; // driving time in minutes
  geometry: [number, number][]; // route coordinates for drawing
}

export const calculateRoadDistance = async (
  origin: Point,
  destination: Point
): Promise<RouteResult | null> => {
  try {
    // OSRM format: lng,lat (not lat,lng!)
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== "Ok" || !data.routes?.[0]) {
      return null;
    }

    const route = data.routes[0];

    return {
      distanceKm: Number((route.distance / 1000).toFixed(2)),
      durationMin: Math.round(route.duration / 60),
      geometry: route.geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng] // swap to Leaflet format
      ),
    };
  } catch (error) {
    console.error("Failed to calculate road distance:", error);
    return null;
  }
};