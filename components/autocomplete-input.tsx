"use client";

import { useEffect, useRef, useCallback } from "react";

interface AutocompleteInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string, place?: google.maps.places.PlaceResult) => void;
  onInputChange: (value: string) => void;
  id: string;
}

export default function AutocompleteInput({
  placeholder,
  value,
  onChange,
  onInputChange,
  id,
}: AutocompleteInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.formatted_address) {
      onInputChange(place.formatted_address);
      onChange(place.formatted_address, place);
    }
  }, [onChange, onInputChange]);

  useEffect(() => {
    if (!inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"],
      }
    );

    autocompleteRef.current = autocomplete;
    autocomplete.addListener("place_changed", handlePlaceChanged);

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [handlePlaceChanged]);

  return (
    <div className="flex items-center bg-black bg-opacity-50 border border-hacker-accent rounded">
      <span className="text-hacker-accent px-2">{">"}</span>
      <input
        ref={inputRef}
        type="text"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onInputChange(e.target.value)}
        className="w-full p-2 bg-transparent text-hacker-text focus:outline-none"
      />
    </div>
  );
}
