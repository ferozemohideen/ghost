"use client";

import { useState, useCallback } from "react";
import AutocompleteInput from "./autocomplete-input";

// Add Google Maps types
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: any;
          PlaceResult: {
            formatted_address?: string;
            geometry?: {
              location?: {
                lat(): number;
                lng(): number;
              };
            };
          };
        };
        event: {
          clearInstanceListeners(instance: any): void;
        };
      };
    };
  }
}

interface RouteFormProps {
  onSearch: (start: string, end: string) => void;
}

interface LocationData {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export function RouteForm({ onSearch }: RouteFormProps) {
  const [start, setStart] = useState<LocationData | null>(null);
  const [end, setEnd] = useState<LocationData | null>(null);
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (start?.coordinates && end?.coordinates) {
      const startStr = `${start.coordinates.lng},${start.coordinates.lat}`;
      const endStr = `${end.coordinates.lng},${end.coordinates.lat}`;
      onSearch(startStr, endStr);
    }
  };

  const handleStartChange = useCallback(
    (address: string, place?: google.maps.places.PlaceResult) => {
      if (place?.geometry?.location) {
        setStart({
          address,
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
        });
      }
    },
    []
  );

  const handleEndChange = useCallback(
    (address: string, place?: google.maps.places.PlaceResult) => {
      if (place?.geometry?.location) {
        setEnd({
          address,
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
        });
      }
    },
    []
  );

  const handleStartInputChange = useCallback((value: string) => {
    setStartInput(value);
    if (!value) {
      setStart(null);
    }
  }, []);

  const handleEndInputChange = useCallback((value: string) => {
    setEndInput(value);
    if (!value) {
      setEnd(null);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
      <div>
        <div className="text-hacker-accent mb-1">$ enter start_location:</div>
        <AutocompleteInput
          id="start-location"
          placeholder="Starting Location"
          value={startInput}
          onChange={handleStartChange}
          onInputChange={handleStartInputChange}
        />
      </div>
      <div>
        <div className="text-hacker-accent mb-1">$ enter destination:</div>
        <AutocompleteInput
          id="end-location"
          placeholder="Destination"
          value={endInput}
          onChange={handleEndChange}
          onInputChange={handleEndInputChange}
        />
      </div>
      <button
        type="submit"
        className="w-full p-2 rounded hacker-button mt-4"
        disabled={!start?.coordinates || !end?.coordinates}
      >
        [Execute Route Search]
      </button>
    </form>
  );
}
