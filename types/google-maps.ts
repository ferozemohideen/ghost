declare global {
  interface Window {
    google: {
      maps: {
        // Places API types
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
        // Geocoding API types
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
        // Events
        event: {
          clearInstanceListeners(instance: any): void;
        };
      };
    };
  }
}

export {}; 