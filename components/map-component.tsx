"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { CameraFullscreenView } from "@/components/camera-fullscreen-view";
import { TerminalWindow } from "./terminal-window";

interface RouteData {
  route: [number, number][];
  directRoute: [number, number][];
  cameras: Array<{
    id: string;
    location: {
      lat: number;
      lng: number;
    };
    type: string;
  }>;
  bbox?: number[];
  metadata?: {
    avoiding: any;
    direct: any;
  };
  directions?: {
    distance: number;
    duration: number;
    steps: Array<{
      instruction: string;
      distance: number;
      duration: number;
    }>;
  };
}

interface MapComponentProps {
  routeData: RouteData | null;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

mapboxgl.accessToken =
  "pk.eyJ1IjoiZmVyb3plbW9oaWRlZW4iLCJhIjoiY202eTFjaWJkMDFiNzJqb2k2NzdyM3poOCJ9.G9psrkBI_eno4W-bHNuxyQ";

export function MapComponent({
  routeData,
  isExpanded,
  onToggleExpand,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);

  // Add effect to resize map when expanded state changes
  useEffect(() => {
    if (map.current) {
      // Add a small delay to ensure the container has finished transitioning
      setTimeout(() => {
        map.current?.resize();
        // If we have bbox data, re-fit the map to the bounds
        if (
          routeData?.bbox &&
          Array.isArray(routeData.bbox) &&
          routeData.bbox.length === 4
        ) {
          const [minLng, minLat, maxLng, maxLat] = routeData.bbox;
          map.current?.fitBounds(
            [
              [minLng, minLat],
              [maxLng, maxLat],
            ],
            { padding: 40 }
          );
        }
      }, 300);
    }
  }, [isExpanded, routeData?.bbox]);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [-74.006, 40.7128],
      zoom: 12,
    });

    map.current.on("load", () => {
      if (!routeData) return;

      // --- 1) Fit map to route bbox ---
      if (
        routeData.bbox &&
        Array.isArray(routeData.bbox) &&
        routeData.bbox.length === 4
      ) {
        const [minLng, minLat, maxLng, maxLat] = routeData.bbox;
        map.current?.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          { padding: 40 }
        );
      }

      // --- 2) Add both routes as GeoJSON sources ---
      // Avoiding route
      map.current?.addSource("avoiding-route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: routeData.route || [],
          },
        },
      });

      // Direct route
      map.current?.addSource("direct-route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: routeData.directRoute || [],
          },
        },
      });

      // --- 3) Add layers for both routes ---
      // Direct route (dashed, appears first)
      map.current?.addLayer({
        id: "direct-route",
        type: "line",
        source: "direct-route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
          visibility: "visible",
        },
        paint: {
          "line-color": "rgb(0, 143, 17)",
          "line-width": 3,
          "line-dasharray": [2, 2],
          "line-opacity": 0.4,
        },
      });

      // Avoiding route (solid, appears on top)
      map.current?.addLayer({
        id: "avoiding-route",
        type: "line",
        source: "avoiding-route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "rgb(0, 143, 17)",
          "line-width": 4,
          "line-opacity": 0.8,
        },
      });

      // --- 4) Animate the avoiding route ---
      const animateRoute = (timestamp: number) => {
        const progress = Math.min(timestamp / 1000, 1);

        map.current?.setPaintProperty("direct-route", "line-gradient", [
          "step",
          ["line-progress"],
          "rgba(0, 143, 17, 0)",
          progress,
          "rgba(0, 143, 17, 0.8)",
        ]);

        if (progress < 1) {
          requestAnimationFrame(animateRoute);
        } else {
          // --- 5) Add camera markers ---
          if (routeData.cameras && Array.isArray(routeData.cameras)) {
            routeData.cameras.forEach((camera) => {
              const { location, id } = camera;
              if (!location || !id) return;

              const marker = new mapboxgl.Marker({
                color: "#FF0000",
                scale: 1.0, // Slightly larger than the default
              })
                .setLngLat([location.lng, location.lat])
                .addTo(map.current!);

              // Add click handler
              marker.getElement().addEventListener("click", () => {
                setSelectedCameraId(id);
              });
            });
          }
        }
      };

      requestAnimationFrame(animateRoute);
    });
  }, [routeData]);

  return (
    <div className="flex flex-col">
      <div className="flex gap-4 h-[32rem]">
        <div
          className={`relative rounded overflow-hidden transition-all duration-300 ${
            isExpanded ? "w-full" : "w-2/3"
          }`}
        >
          <div ref={mapContainer} className="w-full h-full" />
          {selectedCameraId && (
            <div className="absolute inset-0 bg-black bg-opacity-90 z-20">
              <CameraFullscreenView
                cameraId={selectedCameraId}
                onClose={() => setSelectedCameraId(null)}
              />
            </div>
          )}
          <button
            type="button"
            onClick={onToggleExpand}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-hacker-accent px-3 py-1 rounded hover:bg-opacity-70 z-10"
          >
            {isExpanded ? "[ < ]" : "[ > ]"}
          </button>
        </div>

        {!isExpanded && routeData?.directions && (
          <div className="w-1/3 flex-shrink-0">
            <TerminalWindow hideHeader>
              <div className="text-hacker-accent h-full overflow-hidden group">
                <div className="mb-4 group-hover:text-hacker-text transition-colors">
                  $ route_details.exe
                  <br />
                  {">"} Distance:{" "}
                  {(routeData.directions.distance / 1000).toFixed(2)} km
                  <br />
                  {">"} Duration:{" "}
                  {Math.round(routeData.directions.duration / 60)} minutes
                </div>

                <div className="mb-2 group-hover:text-hacker-text transition-colors">
                  $ cat route_steps.txt
                </div>
                <div className="overflow-y-auto max-h-[24rem] pr-2 custom-scrollbar">
                  <div className="space-y-2 group-hover:text-hacker-text transition-colors">
                    {routeData.directions.steps.map((step, index) => (
                      <div
                        key={index}
                        className="pl-4 border-l border-hacker-accent group-hover:border-hacker-text"
                      >
                        <span className="opacity-50">
                          {(index + 1).toString().padStart(2, "0")}:
                        </span>{" "}
                        {step.instruction}
                        <div className="text-sm opacity-50 pl-4">
                          {step.distance.toFixed(0)}m |{" "}
                          {Math.round(step.duration / 60)}min
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TerminalWindow>
          </div>
        )}
      </div>
    </div>
  );
}
