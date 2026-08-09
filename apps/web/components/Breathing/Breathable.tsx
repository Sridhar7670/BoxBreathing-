"use client";

import React from "react";
import { BreathableProps, PhaseType } from "./breathing.types";

export default function Breathable({
  currentPhase,
  phaseTimeLeft,
  isActive,
  onToggleStart,
  totalElapsedSeconds,
  totalDurationSeconds,
  currentRound,
  totalRounds,
}: BreathableProps) {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const phasesList: PhaseType[] = ["Inhale", "Hold", "Exhale", "Pause"];

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 w-full select-none">
      {/* Circle Container */}
      <div
        onClick={onToggleStart}
        className="relative flex items-center justify-center w-[300px] h-[300px] md:w-[340px] md:h-[340px] rounded-full border border-[#D1DDD0] cursor-pointer hover:border-[#B5C7B3] transition-all my-6"
      >
        {/* Inner Solid Circle */}
        <div className="flex flex-col items-center justify-center w-[190px] h-[190px] md:w-[210px] md:h-[210px] rounded-full bg-[#E5ECE2] text-center shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#5A6656] mb-1">
            {currentPhase === "Pause" ? "HOLD" : currentPhase}
          </span>
          <span className="text-6xl md:text-7xl font-bold text-[#2C3328] my-0.5 font-sans">
            {phaseTimeLeft}
          </span>
          <span className="text-xs font-medium text-[#5A6656]">
            {isActive ? "Breathe steadily" : "Ready when you are"}
          </span>
        </div>
      </div>

      {/* Round Info */}
      <div className="text-[#2C3328] font-bold text-xl mb-3">
        Round {currentRound} of {Math.max(1, totalRounds)}
      </div>

      {/* 4 Phase Dots */}
      <div className="flex items-center gap-2 mb-3">
        {phasesList.map((p) => {
          const isCurrent = currentPhase === p;
          return (
            <div
              key={p}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                isCurrent ? "bg-[#6A8466]" : "bg-[#D3E0CE]"
              }`}
            />
          );
        })}
      </div>

      {/* Round Breakdown Subtitle */}
      <p className="text-xs text-[#6A7566] mb-6">
        One round = inhale · hold · exhale · hold
      </p>

      {/* Elapsed & Session Timer Display */}
      <div className="flex items-center gap-6 text-sm text-[#4B554B] font-medium">
        <span>
          Elapsed <span className="font-semibold text-[#2C3328] ml-1">{formatTime(totalElapsedSeconds)}</span>
        </span>
        <span className="text-[#C2D0BE]">|</span>
        <span>
          Session <span className="font-semibold text-[#2C3328] ml-1">{formatTime(totalDurationSeconds)}</span>
        </span>
      </div>
    </div>
  );
}
