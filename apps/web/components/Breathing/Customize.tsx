"use client";

import React from "react";
import { CustomizeProps } from "./breathing.types";
import {
  METRONOME_OPTIONS,
  PHASE_SECONDS_MAX,
  PHASE_SECONDS_MIN,
} from "./breathing.utils";
import "./Customize.styles.css";

const SESSION_DURATION_OPTIONS = [1, 3, 5, 10, 15]; // minutes

/** Fills the slider track green up to the current value and grey after it. */
function getTrackBackground(value: number) {
  const filledPercent =
    ((value - PHASE_SECONDS_MIN) / (PHASE_SECONDS_MAX - PHASE_SECONDS_MIN)) * 100;
  return `linear-gradient(to right, #6A8466 ${filledPercent}%, #D5DFD1 ${filledPercent}%)`;
}

/** A rounded option button, used for both session duration and metronome. */
function PillButton({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`PillButton ${isSelected ? "PillButtonSelected" : "PillButtonIdle"}`}
    >
      {label}
    </button>
  );
}

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
  const phaseSliders = [
    { label: "Inhale time", value: inhaleTime },
    { label: "Hold time", value: holdTime },
    { label: "Exhale time", value: exhaleTime },
    { label: "Pause time", value: pauseTime },
  ];

  // Box breathing means all four phases are the same length, so moving any one
  // slider moves all of them together (3-3-3-3, 4-4-4-4, and so on).
  const setAllPhaseTimes = (seconds: number) => {
    setInhaleTime(seconds);
    setHoldTime(seconds);
    setExhaleTime(seconds);
    setPauseTime(seconds);
  };

  return (
    <div className="Customize">
      <h2 className="CustomizeHeading">Session settings</h2>
      <p className="CustomizeIntro">
        Any phase from {PHASE_SECONDS_MIN} to {PHASE_SECONDS_MAX} seconds. Keep them equal for a
        true box ({inhaleTime}-{holdTime}-{exhaleTime}-{pauseTime}).
      </p>

      {/* Phase length sliders */}
      <div className="CustomizeSliders">
        {phaseSliders.map((slider) => (
          <div key={slider.label} className="SliderRow">
            <div className="SliderLabelRow">
              <span className="SliderLabel">{slider.label}</span>
              <span className="SliderValue">{slider.value}s</span>
            </div>

            <div className="SliderTrack">
              <input
                type="range"
                min={PHASE_SECONDS_MIN}
                max={PHASE_SECONDS_MAX}
                step={1}
                value={slider.value}
                onChange={(event) => setAllPhaseTimes(Number(event.target.value))}
                style={{ background: getTrackBackground(slider.value) }}
                className="SliderInput"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Session duration */}
      <div className="CustomizeFieldDuration">
        <label className="CustomizeFieldLabel">Session duration</label>
        <div className="CustomizeOptions">
          {SESSION_DURATION_OPTIONS.map((minutes) => (
            <PillButton
              key={minutes}
              label={`${minutes} min`}
              isSelected={sessionDuration === minutes}
              onClick={() => setSessionDuration(minutes)}
            />
          ))}
        </div>
      </div>

      {/* Metronome */}
      <div className="CustomizeFieldMetronome">
        <label className="CustomizeFieldLabel">Metronome</label>
        <div className="CustomizeOptions">
          {METRONOME_OPTIONS.map((option) => (
            <PillButton
              key={option}
              label={option}
              isSelected={metronome === option}
              onClick={() => setMetronome(option)}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleStart}
        className={`StartButton ${isActive ? "StartButtonActive" : "StartButtonIdle"}`}
      >
        {isActive ? "Pause breathing session" : "Start breathing session"}
      </button>
    </div>
  );
}
