"use client";

import { useEffect, useState } from "react";
import { GhostLogo } from "@/components/ghost-logo";
import { RouteForm } from "@/components/route-form";
import { OldComputer } from "@/components/old-computer";
import { TerminalWindow } from "@/components/terminal-window";
import { MapComponent } from "@/components/map-component";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useRouter } from "next/navigation";

// Add Google Maps types
declare global {
  interface Window {
    google: {
      maps: {
        Geocoder: new () => {
          geocode(
            request: { address: string },
            callback: (
              results: Array<{
                geometry: {
                  location: {
                    lat(): number;
                    lng(): number;
                  };
                };
              }> | null,
              status: string
            ) => void
          ): void;
        };
      };
    };
  }
}

export default function Home() {
  const router = useRouter();
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
    } else {
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsGoogleMapsLoaded(true);
          clearInterval(checkGoogleMaps);
        }
      }, 100);

      return () => clearInterval(checkGoogleMaps);
    }
  }, []);

  const handleSearch = async (start: string, end: string) => {
    router.push(
      `/search?start=${encodeURIComponent(start)}&end=${encodeURIComponent(
        end
      )}`
    );
  };

  const suggestedRoutes = [
    { start: "142 E 15th St, New York, NY", end: "424 E 9th St, New York, NY" },
    {
      start: "World Trade Center, New York, NY",
      end: "Wall Street, New York, NY",
    },
    { start: "Penn Station, New York, NY", end: "Times Square, New York, NY" },
    {
      start: "Grand Central Terminal, New York, NY",
      end: "Rockefeller Center, New York, NY",
    },
  ];

  const geocodeAddress = async (address: string) => {
    if (!window.google?.maps) {
      throw new Error("Google Maps not loaded");
    }

    const geocoder = new window.google.maps.Geocoder();

    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results?.[0]?.geometry?.location) {
          const location = results[0].geometry.location;
          resolve({ lat: location.lat(), lng: location.lng() });
        } else {
          reject(new Error(`Geocoding failed for ${address}`));
        }
      });
    });
  };

  const handleSuggestedRoute = async (start: string, end: string) => {
    setLoading(true);
    try {
      const startCoords = await geocodeAddress(start);
      const endCoords = await geocodeAddress(end);

      router.push(
        `/search?start=${encodeURIComponent(
          `${startCoords.lng},${startCoords.lat}`
        )}&end=${encodeURIComponent(`${endCoords.lng},${endCoords.lat}`)}`
      );
    } catch (error) {
      console.error("Error processing route:", error);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-2 bg-gray-900">
      <OldComputer>
        <TerminalWindow>
          <div className="space-y-4">
            <GhostLogo className="mb-6" />
            {isGoogleMapsLoaded ? (
              <div>
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <RouteForm onSearch={handleSearch} />
                )}
              </div>
            ) : (
              <div className="text-hacker-text animate-pulse">
                Initializing system...
              </div>
            )}
            {!loading && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4 font-mono">
                  [Suggested Routes]
                </h2>
                <ul className="space-y-2 font-mono">
                  {suggestedRoutes.map((route, index) => (
                    <li key={index}>
                      <button
                        onClick={() =>
                          handleSuggestedRoute(route.start, route.end)
                        }
                        className="text-hacker-accent hover:text-hacker-text"
                      >
                        {`> ${route.start.split(",")[0]} to ${
                          route.end.split(",")[0]
                        }`}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TerminalWindow>
      </OldComputer>
    </main>
  );
}
