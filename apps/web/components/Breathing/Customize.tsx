"use client";

import React from "react";
import { CustomizeProps } from "./breathing.types";

export default function Customize({
  inhaleTime,
  setInhaleTime,
  holdTime,
  setHoldTime,
  exhaleTime,
  setExhaleTime,
  pauseTime,
  setPauseTime,
  sessionDuration,
  setSessionDuration,
  metronome,
  setMetronome,
  isActive,
  onToggleStart,
}: CustomizeProps) {
  const durationOptions = [1, 3, 5, 10, 15];
  const metronomeOptions = ["Off", "Soft", "Med", "Loud"];

  // Helper to update all phases together so all 4 stay equal (e.g. 3-3-3-3, 4-4-4-4, 5-5-5-5)
  const handleBoxTimeChange = (val: number) => {
    setInhaleTime(val);
    setHoldTime(val);
    setExhaleTime(val);
    setPauseTime(val);
  };

  const sliders = [
    { label: "Inhale time", value: inhaleTime },
    { label: "Hold time", value: holdTime },
    { label: "Exhale time", value: exhaleTime },
    { label: "Pause time", value: pauseTime },
  ];

  // Calculated precisely with min=1 and max=6
  const getTrackBackground = (val: number, min = 1, max = 6) => {
    const percentage = ((val - min) / (max - min)) * 100;
    return `linear-gradient(to right, #6A8466 ${percentage}%, #D5DFD1 ${percentage}%)`;
  };

  return (
    <div className="bg-[#E4EBE0] p-8 md:p-9 rounded-[32px] w-full shadow-sm border border-[#D3DEC0]/40">
      <h2 className="text-2xl font-bold text-[#2C3328] mb-1.5">Session settings</h2>
      <p className="text-[#556152] text-sm mb-7 leading-relaxed">
        Any phase from 1 to 6 seconds. Keep them equal for a true box ({inhaleTime}-{holdTime}-{exhaleTime}-{pauseTime}).
      </p>

      {/* Sliders (All sync together to preserve true Box Breathing) */}
      <div className="space-y-6 mb-8">
        {sliders.map((slider) => (
          <div key={slider.label} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#2C3328] text-base">{slider.label}</span>
              <span className="bg-[#D3E0CE] text-[#2C3328] text-xs font-semibold px-3 py-1 rounded-full">
                {slider.value}s
              </span>
            </div>
            <div className="relative flex items-center h-5">
              <input
                type="range"
                min={1}
                max={6}
                step={1}
                value={slider.value}
                onChange={(e) => handleBoxTimeChange(Number(e.target.value))}
                style={{ background: getTrackBackground(slider.value, 1, 6) }}
                className="w-full h-2.5 rounded-full appearance-none cursor-pointer outline-none transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[#B8C8B3]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Session duration */}
      <div className="mb-7">
        <label className="block font-semibold text-[#2C3328] text-base mb-3">
          Session duration
        </label>
        <div className="flex flex-wrap gap-2.5">
          {durationOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSessionDuration(option)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                sessionDuration === option
                  ? "bg-[#6A8466] text-white shadow-xs"
                  : "bg-[#F3F6F1] text-[#2C3328] hover:bg-[#E4ECE0]"
              }`}
            >
              {option} min
            </button>
          ))}
        </div>
      </div>

      {/* Metronome */}
      <div className="mb-9">
        <label className="block font-semibold text-[#2C3328] text-base mb-3">
          Metronome
        </label>
        <div className="flex flex-wrap gap-2.5">
          {metronomeOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMetronome(option)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                metronome === option
                  ? "bg-[#6A8466] text-white shadow-xs"
                  : "bg-[#F3F6F1] text-[#2C3328] hover:bg-[#E4ECE0]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <button
        type="button"
        onClick={onToggleStart}
        className={`w-full py-4 px-6 rounded-full font-semibold text-lg transition-all cursor-pointer shadow-sm ${
          isActive
            ? "bg-[#D96B6B] hover:bg-[#C55757] text-white"
            : "bg-[#6A8466] hover:bg-[#597255] text-white"
        }`}
      >
        {isActive ? "Pause breathing session" : "Start breathing session"}
      </button>
    </div>
  );
}
