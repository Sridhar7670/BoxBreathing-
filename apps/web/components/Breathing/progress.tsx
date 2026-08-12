"use client";

import { ProgressProps } from "./breathing.types";
import { formatClock } from "./breathing.utils";
import "./progress.styles.css";

const PauseIcon = () => (
  <svg className="ProgressIcon" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="ProgressIcon ProgressIconPlay" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export default function Progress({
  totalElapsedSeconds,
  totalDurationSeconds,
  isActive,
  onToggleStart,
  onReset,
}: ProgressProps) {
  // Guard against a zero-length session so we never divide by zero.
  const percentComplete = Math.min(
    100,
    Math.round((totalElapsedSeconds / Math.max(1, totalDurationSeconds)) * 100)
  );

  const elapsedText = formatClock(totalElapsedSeconds, { padMinutes: true });
  const durationText = formatClock(totalDurationSeconds, { padMinutes: true });

  return (
    <div className="Progress">
      {/* Play / pause, reset, and the elapsed-of-total readout */}
      <div className="ProgressControls">
        <button
          type="button"
          onClick={onToggleStart}
          title={isActive ? "Pause" : "Play"}
          className="ProgressPlayButton"
        >
          {isActive ? <PauseIcon /> : <PlayIcon />}
        </button>

        <button type="button" onClick={onReset} className="ProgressResetButton">
          Reset
        </button>

        <span className="ProgressTime">
          {elapsedText} / {durationText}
        </span>
      </div>

      {/* Progress bar */}
      <div className="ProgressBar">
        <div className="ProgressBarTrack">
          <div className="ProgressBarFill" style={{ width: `${percentComplete}%` }} />
        </div>

        <span className="ProgressPercent">{percentComplete}%</span>
      </div>
    </div>
  );
}
