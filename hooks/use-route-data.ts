import { useState, useEffect } from "react";

export function useRouteData(start: string | null, end: string | null) {
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!start || !end) return;
      
      setLoading(true);
      try {
        const response = await fetch(
          `/api/getRoute?start=${encodeURIComponent(
            start
          )}&end=${encodeURIComponent(end)}`
        );
        const data = await response.json();
        setRouteData(data);
      } catch (error) {
        console.error("Error fetching route data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [start, end]);

  return { routeData, loading, isMapExpanded, setIsMapExpanded };
} 