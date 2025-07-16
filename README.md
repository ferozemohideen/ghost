# Ghost - Surveillance-Free Route Planning in NYC

Ghost is a privacy-focused web application that helps users navigate cities while avoiding surveillance cameras. It provides alternative routes that minimize exposure to known surveillance systems.

## Features

- 🗺️ Interactive map visualization
- 📸 Real-time camera location display
- 🔍 Intelligent route planning around surveillance
- 🎯 Address autocomplete
- 💻 Retro terminal aesthetic
- 📱 Mobile-responsive design

## Tech Stack

- **Frontend Framework**: Next.js 14 with React
- **Styling**: TailwindCSS
- **Maps**: Mapbox GL JS
- **Geocoding**: Google Maps API
- **Language**: TypeScript

## Project Structure

```
ghost/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── getRoute/      # Route calculation endpoint
│   ├── search/           # Search results page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── map-component.tsx # Main map display
│   ├── route-form.tsx    # Route input form
│   └── ...
├── types/                # TypeScript type definitions
└── public/              # Static assets
```

## How It Works

### Route Planning Algorithm

1. **Input Processing**

   - Users enter start and end locations
   - Addresses are geocoded to coordinates using Google Maps API

2. **Camera Detection**

   - System identifies surveillance cameras near the direct route
   - Calculates "danger zones" around each camera

3. **Route Calculation**

   - Generates direct route between points
   - Creates alternative route minimizing camera exposure
   - Balances distance vs. surveillance avoidance

4. **Visualization**
   - Displays both routes on interactive map
   - Shows camera locations with click interaction
   - Provides route comparison details

## Getting Started

1. **Prerequisites**

   - Node.js 18+ installed
   - Mapbox account and token
   - Google Maps API key

2. **Installation**

   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/ghost.git

   # Install dependencies
   cd ghost
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with:

   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
   ```

4. **Development**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## API Routes

### `GET /api/getRoute`

Calculates surveillance-free routes between two points.

**Parameters:**

- `start`: Starting coordinates (lng,lat)
- `end`: Ending coordinates (lng,lat)

**Response:**

```json
{
  "route": [[lng, lat], ...],        // Surveillance-avoiding route
  "directRoute": [[lng, lat], ...],  // Direct route
  "cameras": [{                      // Nearby cameras
    "id": "string",
    "location": {
      "lat": number,
      "lng": number
    }
  }],
  "metadata": {
    "avoiding": {
      "distance": number,
      "duration": number
    },
    "direct": {
      "distance": number,
      "duration": number
    }
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security Considerations

- This application is designed for privacy enhancement but should not be relied upon for critical privacy needs
- Camera data may not be comprehensive or up-to-date
- Users should exercise their own judgment when choosing routes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Mapbox for mapping services
- Google Maps for geocoding
- All contributors and supporters
