import type React from "react";

export function TerminalWindow({
  children,
  hideHeader,
}: {
  children: React.ReactNode;
  hideHeader?: boolean;
}) {
  return (
    <div className="font-mono text-sm flex flex-col h-full">
      {!hideHeader && (
        <div className="flex items-center justify-between bg-gray-800 p-2 rounded-t-lg">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-gray-400 text-xs">
            ghost@surveillance-free-route
          </div>
        </div>
      )}
      <div className="bg-black bg-opacity-75 p-4 rounded-b-lg flex-1">
        {children}
      </div>
    </div>
  );
}
