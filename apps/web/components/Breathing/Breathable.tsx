"use client";

import { motion, useReducedMotion, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";

import PhaseRing from "./PhaseRing";
import type { BreathableProps } from "./breathing.interfaces";
import type { PhaseType } from "./breathing.types";
import { PHASE_HINTS, PHASE_LABELS, PHASE_ORDER } from "./breathing.constants";
import { formatClock } from "./breathing.utils";
import "./Breathable.styles.css";

/* ---- How far each layer of the circle breathes ---- */

/** A `[exhaled, inhaled]` pair: the value a layer has at each end of the breath. */
type BreathRange = readonly [exhaled: number, inhaled: number];

/**
 * The circle itself. The low end is deliberately not smaller than this: the
 * phase name and the count sit on the circle, and they have to stay inside its
 * edge even when it is at its smallest.
 */
const ORB_SCALE: BreathRange = [0.78, 1];

/**
 * The text breathes too, but only slightly. Enough that it reads as part of the
 * circle rather than floating over it, and little enough that the letters are
 * not visibly resampled as they scale.
 */
const READOUT_SCALE: BreathRange = [0.94, 1];

/** The glow behind the circle breathes a little wider, and fades in as the lungs fill. */
const GLOW_SCALE: BreathRange = [0.8, 1.1];
const GLOW_OPACITY: BreathRange = [0.18, 0.5];

/** What the line under the circle says when the session is not running. */
const STATUS_HINTS = {
  idle: "Tap the circle to begin",
  paused: "Paused — tap to resume",
  finished: "Session complete",
} as const;

/**
 * Maps the breath signal (0 = exhaled, 1 = inhaled) onto a range of values.
 *
 * The result is a motion value the session clock updates on every frame, so a
 * layer driven by it can never fall out of step with the number in the middle.
 * With `holdStill` the range collapses to a single value, which is how scale
 * is switched off for people who have asked for reduced motion.
 */
function useBreathRange(
  breath: MotionValue<number>,
  range: BreathRange,
  holdStill = false
): MotionValue<number> {
  return useTransform(breath, [0, 1], holdStill ? [1, 1] : [...range]);
}

/* ---- Small pieces of the layout ---- */

/** One dot per phase; the dot for the current phase is highlighted. */
function PhaseDots({ activePhase }: { activePhase: PhaseType }) {
  return (
    <div className="BreathablePhaseDots" aria-hidden="true">
      {PHASE_ORDER.map((phase) => (
        <span
          key={phase}
          className={`PhaseDot ${phase === activePhase ? "PhaseDotActive" : ""}`}
        />
      ))}
    </div>
  );
}

/** Time spent so far, beside the length of the whole session. */
function SessionTimers({
  elapsedSeconds,
  totalSeconds,
}: {
  elapsedSeconds: number;
  totalSeconds: number;
}) {
  return (
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
  );
}

/* ---- The component ---- */

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
  const prefersReducedMotion = useReducedMotion() ?? false;

  const orbScale = useBreathRange(breath, ORB_SCALE, prefersReducedMotion);
  const readoutScale = useBreathRange(breath, READOUT_SCALE, prefersReducedMotion);
  const glowScale = useBreathRange(breath, GLOW_SCALE, prefersReducedMotion);
  const glowOpacity = useBreathRange(breath, GLOW_OPACITY);

  const isRunning = status === "running";
  const hint = isRunning ? PHASE_HINTS[phase] : STATUS_HINTS[status];

  // The count is a countdown within a phase. Once the session is over the last
  // phase has run out, so there is nothing left to count.
  const countdown = status === "finished" ? 0 : secondsLeft;

  // `round` can step one past the end as the session finishes; never show that.
  const displayedRound = Math.min(round, totalRounds);

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
        Round {displayedRound} of {totalRounds}
      </p>

      <PhaseDots activePhase={phase} />

      <p className="BreathableCaption">One round = inhale · hold · exhale · hold</p>

      <SessionTimers elapsedSeconds={elapsedSeconds} totalSeconds={totalSeconds} />
    </div>
  );
}
