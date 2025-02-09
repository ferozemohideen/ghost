"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MapComponent } from "@/components/map-component";
import { LoadingSpinner } from "@/components/loading-spinner";
import { RouteForm } from "@/components/route-form";
import { OldComputer } from "@/components/old-computer";

export default function RoutePage() {
  const searchParams = useSearchParams();
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        const response = await fetch(`/api/getRoute?start=${start}&end=${end}`);
        const data = await response.json();
        setRouteData(data);
      } catch (error) {
        console.error("Error fetching route data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteData();
  }, [start, end]);

  const handleSearch = (start: string, end: string) => {
    // Implement the search functionality
  };

  const handleToggleExpand = () => {
    setIsMapExpanded((prev) => !prev);
  };

  return (
    <OldComputer>
      <div className="space-y-8">
        <RouteForm onSearch={handleSearch} />
        {routeData && (
          <MapComponent
            routeData={routeData}
            isExpanded={isMapExpanded}
            onToggleExpand={handleToggleExpand}
          />
        )}
      </div>
    </OldComputer>
  );
}
