import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import polyline from "@mapbox/polyline"  // <-- Add this import

type LatLng = [number, number]
type Camera = {
  id: string
  location: {
    lat: number
    lng: number
  }
  type: string
}

// Helper function to read the JSON file
function readCamerasData(): Camera[] {
  const filePath = path.join(process.cwd(), "data", "cameras.json")
  const fileContents = fs.readFileSync(filePath, "utf8")
  const data = JSON.parse(fileContents)

  return data.map((camera: any) => {
    if (!camera.location || typeof camera.location.lat !== "number" || typeof camera.location.lng !== "number") {
      const loc = Array.isArray(camera.location)
        ? { lat: camera.location[1], lng: camera.location[0] }
        : { lat: camera.latitude || camera.lat || 0, lng: camera.longitude || camera.lng || 0 }

      return {
        id: camera.id || String(Math.random()),
        location: loc,
        type: camera.type || "unknown",
      }
    }
    return camera
  })
}

// Approximate a circle around each camera to avoid
function circleToPolygon(center: LatLng, radiusMeters: number, numSegments = 12): number[][] {
  const [lngCenter, latCenter] = center
  // Quick conversions for small distances (rough approximation):
  const metersPerDegLat = 111_320
  const metersPerDegLng = 111_320 * Math.cos((latCenter * Math.PI) / 180)

  const radiusDegLat = radiusMeters / metersPerDegLat
  const radiusDegLng = radiusMeters / metersPerDegLng

  const coords: number[][] = []
  for (let i = 0; i < numSegments; i++) {
    const angle = (2 * Math.PI * i) / numSegments
    const lat = latCenter + radiusDegLat * Math.sin(angle)
    const lng = lngCenter + radiusDegLng * Math.cos(angle)
    coords.push([lng, lat])
  }
  // Close the ring
  coords.push(coords[0])
  return coords
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const startCoords = searchParams.get("start")?.split(",").map(Number)
  const endCoords = searchParams.get("end")?.split(",").map(Number)

  if (!startCoords || !endCoords || startCoords.length !== 2 || endCoords.length !== 2) {
    return NextResponse.json({ error: "Invalid coordinates provided" }, { status: 400 })
  }

  // Create LatLng points from the coordinates
  const startPoint: LatLng = [startCoords[0], startCoords[1]] // [lng, lat]
  const endPoint: LatLng = [endCoords[0], endCoords[1]]       // [lng, lat]

  // Load camera data
  const cameras = readCamerasData()

  // Create small polygons (circles) around each camera to avoid
  const polygons = cameras.map((cam) => {
    const center: LatLng = [cam.location.lng, cam.location.lat]
    const coords = circleToPolygon(center, 80, 12) // ~80m radius
    return [coords] // Each polygon is a single polygon ring
  })

  // Combine into a MultiPolygon for ORS (if you want to re-enable "avoid_polygons")
  const multiPolygon = {
    type: "MultiPolygon" as const,
    coordinates: polygons,
  }

  // Call OpenRouteService
  const ORS_API_KEY = process.env.ORS_API_KEY || "YOUR_ORS_API_KEY_HERE"
  const profile = "foot-walking" // or "driving-car", etc.

  try {    
    // Fetch both routes in parallel
    const [avoidingResponse, directResponse] = await Promise.all([
      // Route avoiding cameras
      fetch(`https://api.openrouteservice.org/v2/directions/${profile}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ORS_API_KEY,
        },
        body: JSON.stringify({
          coordinates: [
            [startPoint[0], startPoint[1]],
            [endPoint[0], endPoint[1]],
          ],
          geometry: true,
          instructions: true,
          options: {
            avoid_polygons: multiPolygon,
          },
        }),
      }),
      // Direct route
      fetch(`https://api.openrouteservice.org/v2/directions/${profile}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ORS_API_KEY,
        },
        body: JSON.stringify({
          coordinates: [
            [startPoint[0], startPoint[1]],
            [endPoint[0], endPoint[1]],
          ],
          geometry: true,
          instructions: false,
        }),
      }),
    ]);

    if (!avoidingResponse.ok || !directResponse.ok) {
      const errorData = await Promise.all([
        avoidingResponse.json(),
        directResponse.json(),
      ]).catch(() => null);
      console.error("OpenRouteService error:", errorData);
      return NextResponse.json(
        { error: "Failed to fetch routes from ORS", details: errorData },
        { status: 500 }
      );
    }

    const [avoidingData, directData] = await Promise.all([
      avoidingResponse.json(),
      directResponse.json(),
    ]);

    // Process avoiding route
    const avoidingRoute = avoidingData.routes?.[0];
    if (!avoidingRoute?.geometry || typeof avoidingRoute.geometry !== "string") {
      return NextResponse.json(
        { error: "No valid geometry in avoiding route", data: avoidingData },
        { status: 500 }
      );
    }

    // Process direct route
    const directRoute = directData.routes?.[0];
    if (!directRoute?.geometry || typeof directRoute.geometry !== "string") {
      return NextResponse.json(
        { error: "No valid geometry in direct route", data: directData },
        { status: 500 }
      );
    }

    // Decode both polylines
    const avoidingLatLngs = polyline.decode(avoidingRoute.geometry);
    const directLatLngs = polyline.decode(directRoute.geometry);

    // Convert both to [lng, lat] format
    const avoidingLngLat: LatLng[] = avoidingLatLngs.map(([lat, lng]) => [lng, lat]);
    const directLngLat: LatLng[] = directLatLngs.map(([lat, lng]) => [lng, lat]);

    return NextResponse.json({
      route: avoidingLngLat,        // The camera-avoiding route
      directRoute: directLngLat,    // The direct route
      cameras,
      bbox: avoidingData.bbox,      // Use the avoiding route's bbox
      metadata: {
        avoiding: avoidingData.metadata,
        direct: directData.metadata,
      },
      directions: {
        distance: avoidingData.routes[0].summary.distance,
        duration: avoidingData.routes[0].summary.duration,
        steps: avoidingData.routes[0].segments[0].steps.map((step: any) => ({
          instruction: step.instruction,
          distance: step.distance,
          duration: step.duration,
        })),
      },
    });
  } catch (err) {
    console.error("Error fetching routes from ORS:", err);
    return NextResponse.json(
      { error: "Could not complete route request" },
      { status: 500 }
    );
  }
}
