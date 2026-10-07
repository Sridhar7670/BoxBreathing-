"use client";

import type { CustomizeProps } from "./breathing.interfaces";
import type { MetronomeLevel, PhaseSeconds } from "./breathing.types";
import { METRONOME_OPTIONS } from "./breathing.audio";
import {
  PHASES_PER_ROUND,
  PHASE_SECONDS_OPTIONS,
  SESSION_MINUTE_OPTIONS,
} from "./breathing.constants";
import "./Customize.styles.css";

/** Writes a phase length the way people say it out loud: 4 becomes "4-4-4-4". */
function describePattern(seconds: PhaseSeconds): string {
  return Array(PHASES_PER_ROUND).fill(seconds).join("-");
}

/** A rounded option button, used by all three settings. */
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
      aria-pressed={isSelected}
      className={`PillButton ${isSelected ? "PillButtonSelected" : "PillButtonIdle"}`}
    >
      {label}
    </button>
  );
}

export default function Customize({
  phaseSeconds,
  onPhaseSecondsChange,
  sessionMinutes,
  onSessionMinutesChange,
  metronome,
  onMetronomeChange,
  status,
  onToggle,
}: CustomizeProps) {
  const isRunning = status === "running";

  const startButtonLabel = isRunning
    ? "Pause session"
    : status === "paused"
      ? "Resume session"
      : status === "finished"
        ? "Start another session"
        : "Start breathing session";

  return (
    <div className="Customize">
      <h2 className="CustomizeHeading">Session settings</h2>
      <p className="CustomizeIntro">
        Every phase runs the same length — that is what makes it a box. Pick the
        rhythm and the four quarters of the ring follow it exactly.
      </p>

      {/*
        A phase length rather than four separate ones. Box breathing keeps all
        four equal, so a single choice describes the whole pattern.
      */}
      <div className="CustomizeField">
        <span className="CustomizeFieldLabel">Pattern</span>
        <div className="CustomizeOptions">
          {PHASE_SECONDS_OPTIONS.map((seconds) => (
            <PillButton
              key={seconds}
              label={describePattern(seconds)}
              isSelected={phaseSeconds === seconds}
              onClick={() => onPhaseSecondsChange(seconds)}
            />
          ))}
        </div>
        <p className="CustomizeFieldHint">
          {phaseSeconds} seconds in, {phaseSeconds} held, {phaseSeconds} out,{" "}
          {phaseSeconds} held again.
        </p>
      </div>

      <div className="CustomizeField">
        <span className="CustomizeFieldLabel">Session duration</span>
        <div className="CustomizeOptions">
          {SESSION_MINUTE_OPTIONS.map((minutes) => (
            <PillButton
              key={minutes}
              label={`${minutes} min`}
              isSelected={sessionMinutes === minutes}
              onClick={() => onSessionMinutesChange(minutes)}
            />
          ))}
        </div>
      </div>

      <div className="CustomizeField">
        <span className="CustomizeFieldLabel">Metronome</span>
        <div className="CustomizeOptions">
          {METRONOME_OPTIONS.map((level: MetronomeLevel) => (
            <PillButton
              key={level}
              label={level}
              isSelected={metronome === level}
              onClick={() => onMetronomeChange(level)}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className={`StartButton ${isRunning ? "StartButtonActive" : "StartButtonIdle"}`}
      >
        {startButtonLabel}
      </button>
    </div>
  );
}
