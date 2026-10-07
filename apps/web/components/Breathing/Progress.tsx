"use client";

import { motion, useTransform } from "motion/react";

import type { ProgressProps } from "./breathing.interfaces";
import { formatClock } from "./breathing.utils";
import "./Progress.styles.css";

const PauseIcon = () => (
  <svg className="ProgressIcon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="ProgressIcon ProgressIconPlay" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export default function Progress({
  sessionProgress,
  elapsedSeconds,
  totalSeconds,
  roundsCompleted,
  totalRounds,
  status,
  onToggle,
  onReset,
}: ProgressProps) {
  const isRunning = status === "running";

  // The bar is scaled by the session clock every frame, so it creeps forward
  // smoothly instead of jumping once a second.
  const percentText = useTransform(sessionProgress, (progress) => `${Math.round(progress * 100)}%`);

  const elapsedText = formatClock(elapsedSeconds, { padMinutes: true });
  const durationText = formatClock(totalSeconds, { padMinutes: true });

  return (
    <div className="Progress">
      {/* Play / pause, reset, and the elapsed-of-total readout */}
      <div className="ProgressControls">
        <button
          type="button"
          onClick={onToggle}
          aria-label={isRunning ? "Pause session" : "Play session"}
          className="ProgressPlayButton"
        >
          {isRunning ? <PauseIcon /> : <PlayIcon />}
        </button>

        <button
          type="button"
          onClick={onReset}
          disabled={status === "idle"}
          className="ProgressResetButton"
        >
          Reset
        </button>

        {/* Full rounds finished so far — the number most people actually track. */}
        <span className="ProgressStat">
          Cycles
          <span className="ProgressStatValue">
            {roundsCompleted} / {totalRounds}
          </span>
        </span>

        <span className="ProgressStat">
          Time
          <span className="ProgressStatValue">
            {elapsedText} / {durationText}
          </span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="ProgressBar">
        <div className="ProgressBarTrack">
          {/*
            Scaling one element is far cheaper than animating a width, because
            the browser can do it on the compositor without re-laying out the row.
          */}
          <motion.div className="ProgressBarFill" style={{ scaleX: sessionProgress }} />
        </div>

        <motion.span className="ProgressPercent">{percentText}</motion.span>
      </div>
    </div>
  );
}
