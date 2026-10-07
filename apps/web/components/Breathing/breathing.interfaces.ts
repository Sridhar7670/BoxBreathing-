/**
 * Every object shape used by the breathing screen, in one place: what the hook
 * is given, what it hands back, and what each component expects as props.
 * The small named types they are built from live in `breathing.types.ts`.
 */

import type { MotionValue } from "motion/react";

import type {
  MetronomeLevel,
  PhaseSeconds,
  PhaseType,
  SessionStatus,
} from "./breathing.types";

/** The values shown on screen. These change about once a second, not once a frame. */
export interface BreathingDisplay {
  phase: PhaseType;
  /** Whole seconds remaining in the current phase, counting down 4 → 3 → 2 → 1. */
  secondsLeft: number;
  /** 1-based round the user is on. */
  round: number;
  /** Rounds finished end to end. One behind `round` for all but the first. */
  roundsCompleted: number;
  /** Whole seconds of the session completed so far. */
  elapsedSeconds: number;
}

/** The settings a session runs on. */
export interface UseBreathingSessionOptions {
  phaseSeconds: PhaseSeconds;
  sessionMinutes: number;
  metronome: MetronomeLevel;
}

/**
 * Smooth 0 → 1 signals, updated on every animation frame.
 *
 * They are motion values rather than React state, so the circle, the ring and
 * the progress bar can animate at 60fps without re-rendering the tree each frame.
 */
export interface BreathingSignals {
  /** 0 = fully exhaled, 1 = fully inhaled. The circle scales straight from this. */
  breath: MotionValue<number>;
  /** How far through the current phase. */
  phaseProgress: MotionValue<number>;
  /** How far around one full round, which is how far around the ring. */
  roundProgress: MotionValue<number>;
  /** How far through the whole session. */
  sessionProgress: MotionValue<number>;
}

/** What `useBreathingSession` hands back to the screen. */
export interface BreathingSession extends BreathingDisplay, BreathingSignals {
  status: SessionStatus;
  isActive: boolean;
  totalRounds: number;
  totalSeconds: number;

  /** Start, pause or resume, depending on where the session currently is. */
  toggle: () => void;
  /** Put the session back to its very beginning. */
  reset: () => void;
}

/** How a single metronome cue sounds. */
export interface CueSettings {
  frequencyHz: number;
  lengthSeconds: number;
  /** Multiplier on the chosen metronome volume, so cues can differ in weight. */
  gain: number;
}

/** Props for one quarter of the ring. */
export interface PhaseArcProps {
  phase: PhaseType;
  /** Position in `PHASE_ORDER`, which is also the quarter of the ring it owns. */
  phaseIndex: number;
  roundProgress: MotionValue<number>;
}

/** Props for the four-quarter ring around the circle. */
export interface PhaseRingProps extends Pick<BreathingSignals, "roundProgress"> {
  activePhase: PhaseType;
}

/** Props for the animated breathing circle and everything under it. */
export interface BreathableProps
  extends Pick<BreathingSignals, "breath" | "roundProgress"> {
  phase: PhaseType;
  secondsLeft: number;
  phaseSeconds: PhaseSeconds;
  round: number;
  totalRounds: number;
  status: SessionStatus;
  elapsedSeconds: number;
  totalSeconds: number;
  onToggle: () => void;
}

/** Props for the settings panel. */
export interface CustomizeProps {
  phaseSeconds: PhaseSeconds;
  onPhaseSecondsChange: (seconds: PhaseSeconds) => void;
  sessionMinutes: number;
  onSessionMinutesChange: (minutes: number) => void;
  metronome: MetronomeLevel;
  onMetronomeChange: (level: MetronomeLevel) => void;
  status: SessionStatus;
  onToggle: () => void;
}

/** Props for the session progress bar and its controls. */
export interface ProgressProps extends Pick<BreathingSignals, "sessionProgress"> {
  elapsedSeconds: number;
  totalSeconds: number;
  roundsCompleted: number;
  totalRounds: number;
  status: SessionStatus;
  onToggle: () => void;
  onReset: () => void;
}
