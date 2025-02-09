"use client";
import { useEffect, useState } from "react";

/**
 * Props:
 * - cameraId: the ID of the camera
 * - onClose: callback to close/hide this fullscreen
 */
export function CameraFullscreenView({
  cameraId,
  onClose,
}: {
  cameraId: string;
  onClose: () => void;
}) {
  const [showStatic, setShowStatic] = useState(true);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [refreshIntervalId, setRefreshIntervalId] = useState<number | null>(
    null
  );

  // Helper to build the timestamped camera image URL
  function getCameraImageUrl(id: string): string {
    return `https://webcams.nyctmc.org/api/cameras/${id}/image?t=${Date.now()}`;
  }

  // Show static for ~1 second, then display the feed and start refreshing
  useEffect(() => {
    // Start the "static" by default
    setShowStatic(true);

    // After 1 second, hide static, show feed
    const staticTimeout = setTimeout(() => {
      setShowStatic(false);
      // Start feed refresh
      setCurrentImageUrl(getCameraImageUrl(cameraId));

      const interval = window.setInterval(() => {
        setCurrentImageUrl(getCameraImageUrl(cameraId));
      }, 2000);

      setRefreshIntervalId(interval);
    }, 1000); // 1 second of static

    return () => {
      // Cleanup on unmount
      clearTimeout(staticTimeout);
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraId]);

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-hacker-accent text-black px-3 py-1 rounded hover:bg-opacity-80"
      >
        [X]
      </button>

      <div className="text-hacker-accent mb-4">
        $ accessing_camera_feed: {cameraId}
      </div>

      {/* TV Static or the live feed */}
      {showStatic ? (
        <div
          className="w-full h-[50vh] bg-cover bg-center"
          style={{
            backgroundImage: "url('/static.gif')",
          }}
        />
      ) : (
        <img
          src={currentImageUrl || ""}
          alt="Live Camera"
          className="w-full h-[50vh] object-contain"
        />
      )}
    </div>
  );
}
