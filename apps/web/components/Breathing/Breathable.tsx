"use client";

import { motion, useReducedMotion, useTransform } from "motion/react";

import PhaseRing from "./PhaseRing";
import type { BreathableProps } from "./breathing.interfaces";
import { PHASE_HINTS, PHASE_LABELS, PHASE_ORDER } from "./breathing.constants";
import { formatClock } from "./breathing.utils";
import "./Breathable.styles.css";

/**
 * How small the circle gets at the bottom of an exhale, and how big at the top
 * of an inhale. The lower bound is deliberately not smaller than this: the phase
 * name and the count sit on the circle, and they have to stay inside its edge
 * even when it is at its smallest.
 */
const ORB_SCALE_EXHALED = 0.78;
const ORB_SCALE_INHALED = 1;

/**
 * The text breathes too, but only slightly. Enough that it reads as part of the
 * circle rather than floating over it, and little enough that the letters are
 * not visibly resampled as they scale.
 */
const READOUT_SCALE_EXHALED = 0.94;
const READOUT_SCALE_INHALED = 1;

/** The glow behind the circle breathes a little wider, and fades in as the lungs fill. */
const GLOW_SCALE_EXHALED = 0.8;
const GLOW_SCALE_INHALED = 1.1;
const GLOW_OPACITY_EXHALED = 0.18;
const GLOW_OPACITY_INHALED = 0.5;

/** What the line under the circle says when the session is not running. */
const STATUS_HINTS = {
  idle: "Tap the circle to begin",
  paused: "Paused — tap to resume",
  finished: "Session complete",
} as const;

export default function Breathable({
  phase,
  secondsLeft,
  phaseSeconds,
  round,
  totalRounds,
  status,
  breath,
  roundProgress,
  elapsedSeconds,
  totalSeconds,
  onToggle,
}: BreathableProps) {
  const prefersReducedMotion = useReducedMotion();

  // The circle is scaled straight from the breath signal, which the session
  // clock writes on every frame. Nothing here holds its own timing, so the
  // animation cannot fall out of step with the number in the middle.
  const orbScale = useTransform(
    breath,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [ORB_SCALE_EXHALED, ORB_SCALE_INHALED]
  );
  const readoutScale = useTransform(
    breath,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [READOUT_SCALE_EXHALED, READOUT_SCALE_INHALED]
  );
  const glowScale = useTransform(
    breath,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [GLOW_SCALE_EXHALED, GLOW_SCALE_INHALED]
  );
  const glowOpacity = useTransform(breath, [0, 1], [GLOW_OPACITY_EXHALED, GLOW_OPACITY_INHALED]);

  const isRunning = status === "running";
  const hint = isRunning ? PHASE_HINTS[phase] : STATUS_HINTS[status];

  // The count is a countdown within a phase. Once the session is over the last
  // phase has run out, so there is nothing left to count.
  const countdown = status === "finished" ? 0 : secondsLeft;

  return (
    <div className="Breathable">
      {/*
        The whole circle is the start/pause control. It is a real button so that
        it can be reached by keyboard and announced by a screen reader.
      */}
      <button
        type="button"
        onClick={onToggle}
        aria-label={isRunning ? "Pause breathing session" : "Start breathing session"}
        className="BreathableStage"
        data-phase={phase}
      >
        <PhaseRing roundProgress={roundProgress} activePhase={phase} />

        <motion.span className="BreathableGlow" style={{ scale: glowScale, opacity: glowOpacity }} />

        <motion.span className="BreathableOrb" style={{ scale: orbScale }} />

        {/*
          The phase name and the count ride on the circle. They are their own
          layer rather than a child of it, so they scale by a few percent
          instead of by the full breath — text scaled that far would visibly
          blur as it is resampled.
        */}
        <motion.span className="BreathableReadout" style={{ scale: readoutScale }}>
          <span className="BreathablePhaseLabel">{PHASE_LABELS[phase]}</span>
          <span className="BreathableCountdown">{countdown}</span>
          <span className="BreathablePhaseLength">{phaseSeconds}s</span>
        </motion.span>
      </button>

      {/* The guidance line is a full sentence, so it sits under the circle
          rather than on it, where a shrinking circle would clip it. */}
      <p className="BreathableHint">{hint}</p>

      <p className="BreathableRound">
        Round {Math.min(round, totalRounds)} of {totalRounds}
      </p>

      {/* One dot per phase; the dot for the current phase is highlighted. */}
      <div className="BreathablePhaseDots" aria-hidden="true">
        {PHASE_ORDER.map((phaseName) => (
          <span
            key={phaseName}
            className={`PhaseDot ${phaseName === phase ? "PhaseDotActive" : ""}`}
          />
        ))}
      </div>

      <p className="BreathableCaption">One round = inhale · hold · exhale · hold</p>

      <div className="BreathableTimers">
        <span>
          Elapsed
          <span className="BreathableTimerValue">{formatClock(elapsedSeconds)}</span>
        </span>

        <span className="BreathableTimerDivider">|</span>

        <span>
          Session
          <span className="BreathableTimerValue">{formatClock(totalSeconds)}</span>
        </span>
      </div>
    </div>
  );
}
