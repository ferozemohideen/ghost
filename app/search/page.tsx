"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapComponent } from "@/components/map-component";
import { LoadingSpinner } from "@/components/loading-spinner";
import { OldComputer } from "@/components/old-computer";
import { TerminalWindow } from "@/components/terminal-window";
import { useRouteData } from "@/hooks/use-route-data";
import { GhostLogo } from "@/components/ghost-logo";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const { routeData, loading, isMapExpanded, setIsMapExpanded } = useRouteData(
    start,
    end
  );

  // Redirect to home if no search params
  useEffect(() => {
    if (!start || !end) {
      router.push("/");
    }
  }, [start, end, router]);

  if (!start || !end) return null;

  return (
    <div className="space-y-4 h-full">
      <div className="min-h-[32rem] flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <GhostLogo className="mb-6" />
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-4 w-full">
            <div className="h-full w-full">
              <MapComponent
                routeData={routeData}
                isExpanded={isMapExpanded}
                onToggleExpand={() => setIsMapExpanded(!isMapExpanded)}
              />
            </div>
            <button
              onClick={() => router.push("/")}
              className="text-hacker-accent hover:text-hacker-text font-mono"
            >
              {`> [Back to Search]`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-2 bg-gray-900">
      <OldComputer>
        <TerminalWindow>
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center min-h-[32rem]">
                <GhostLogo className="mb-6" />
                <LoadingSpinner />
              </div>
            }
          >
            <SearchContent />
          </Suspense>
        </TerminalWindow>
      </OldComputer>
    </main>
  );
}
