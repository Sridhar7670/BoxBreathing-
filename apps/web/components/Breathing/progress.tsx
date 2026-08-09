"use client";

import React from "react";
import { ProgressProps } from "./breathing.types";

export default function Progress({
  totalElapsedSeconds,
  totalDurationSeconds,
  isActive,
  onToggleStart,
  onReset,
}: ProgressProps) {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const percentage = Math.min(
    100,
    Math.round((totalElapsedSeconds / Math.max(1, totalDurationSeconds)) * 100)
  );

  return (
    <div className="w-full bg-[#E4EBE0] p-6 rounded-[24px] border border-[#D5E0D0] shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
      {/* Controls & Elapsed Time */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleStart}
          className="w-12 h-12 rounded-full bg-[#6B8566] text-white flex items-center justify-center font-bold text-lg hover:bg-[#5A7355] transition-colors cursor-pointer"
          title={isActive ? "Pause" : "Play"}
        >
          {isActive ? (
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 rounded-full text-xs font-semibold text-[#4B554B] bg-[#D3E0CE] hover:bg-[#C2D2BC] transition-colors cursor-pointer"
        >
          Reset
        </button>

        <span className="text-sm font-medium text-[#2C3328]">
          {formatTime(totalElapsedSeconds)} / {formatTime(totalDurationSeconds)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="flex-1 w-full flex items-center gap-3">
        <div className="w-full h-3 bg-[#D1DEC9] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#6B8566] transition-all duration-300 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-[#4B554B] w-10 text-right">
          {percentage}%
        </span>
      </div>
    </div>
  );
}
