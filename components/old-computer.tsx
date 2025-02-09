import type React from "react";

export function OldComputer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gray-800 p-3 rounded-t-3xl shadow-lg">
        <div className="bg-gray-900 p-2 rounded-t-2xl border-2 border-gray-700">
          <div className="bg-hacker-bg p-3 rounded-lg border border-hacker-accent h-[650px] overflow-y-auto">
            <div>{children}</div>
          </div>
        </div>
      </div>
      <div className="bg-gray-700 h-4 rounded-b-3xl shadow-lg"></div>
      <div className="bg-gray-600 h-2 mx-8 rounded-b-3xl shadow-lg"></div>
    </div>
  );
}
