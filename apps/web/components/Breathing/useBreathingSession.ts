"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMotionValue } from "motion/react";

import type {
  BreathingDisplay,
  BreathingSession,
  UseBreathingSessionOptions,
} from "./breathing.interfaces";
import type { SessionStatus } from "./breathing.types";
import { playCue, unlockMetronome } from "./breathing.audio";
import { PHASES_PER_ROUND, PHASE_ORDER } from "./breathing.constants";
import { clamp01, getBreathAmount } from "./breathing.utils";

/**
 * The longest slice of time a single animation frame is allowed to count.
 *
 * Without this, a stalled tab or a slow garbage collection would hand us one
 * enormous frame and skip the user through several phases at once.
 */
const MAX_FRAME_DELTA_MS = 250;

/**
 * Everything that changes many times a second. It lives in a ref rather than in
 * state so that an animation frame never costs a React render.
 */
interface Clock {
  phaseIndex: number;
  /** Time spent in the current phase. */
  phaseMs: number;
  /** Time spent in the session as a whole. */
  sessionMs: number;
  /** Completed rounds so far. */
  roundsDone: number;
  /** Timestamp of the previous frame, used to measure real elapsed time. */
  lastFrameMs: number;
  /** Which whole second of the phase we last ticked, so we tick each one once. */
  lastTickedSecond: number;
}

function createClock(): Clock {
  return {
    phaseIndex: 0,
    phaseMs: 0,
    sessionMs: 0,
    roundsDone: 0,
    lastFrameMs: 0,
    lastTickedSecond: 0,
  };
}

function isSameDisplay(a: BreathingDisplay, b: BreathingDisplay): boolean {
  return (
    a.phase === b.phase &&
    a.secondsLeft === b.secondsLeft &&
    a.round === b.round &&
    a.roundsCompleted === b.roundsCompleted &&
    a.elapsedSeconds === b.elapsedSeconds
  );
}

/**
 * Runs a box-breathing session.
 *
 * There is exactly one clock, read from `performance.now()` on every animation
 * frame, and the countdown, the circle and the ring are all derived from it.
 * That is the whole design: because they share a source, the number on screen
 * and the picture around it cannot drift apart, and a slow frame corrects itself
 * on the next one instead of accumulating error the way a `setInterval` does.
 */
export function useBreathingSession({
  phaseSeconds,
  sessionMinutes,
  metronome,
}: UseBreathingSessionOptions): BreathingSession {
  // Every phase is the same length, so a round is simply four of them.
  const roundSeconds = phaseSeconds * PHASES_PER_ROUND;

  /**
   * A session runs for a whole number of rounds, not for a flat number of
   * minutes.
   *
   * Five minutes at 4-4-4-4 is 18.75 rounds, and stopping the clock dead on
   * 5:00 would cut the last round off three phases in — the hold at the end
   * would simply never happen. So the chosen duration is rounded to the nearest
   * whole round and the session runs exactly that long, ending on a completed
   * breath. Five minutes becomes 19 rounds, or 5:04.
   */
  const totalRounds = Math.max(1, Math.round((sessionMinutes * 60) / roundSeconds));
  const totalSeconds = totalRounds * roundSeconds;

  const [status, setStatus] = useState<SessionStatus>("idle");
  const [display, setDisplay] = useState<BreathingDisplay>({
    phase: "Inhale",
    secondsLeft: phaseSeconds,
    round: 1,
    roundsCompleted: 0,
    elapsedSeconds: 0,
  });

  // Smooth signals for the animation. Writing to a motion value updates the DOM
  // directly, so these can change every frame without re-rendering anything.
  const breath = useMotionValue(0);
  const phaseProgress = useMotionValue(0);
  const roundProgress = useMotionValue(0);
  const sessionProgress = useMotionValue(0);

  const clockRef = useRef<Clock>(createClock());
  const frameRef = useRef<number | null>(null);

  /**
   * The frame loop reads the settings through a ref. That way changing the
   * pattern mid-session does not tear down and restart the loop — which is what
   * used to make the countdown stutter at every phase change.
   */
  const settingsRef = useRef({ phaseSeconds, totalSeconds, totalRounds, metronome });
  useEffect(() => {
    settingsRef.current = { phaseSeconds, totalSeconds, totalRounds, metronome };
  }, [phaseSeconds, totalSeconds, totalRounds, metronome]);

  /** Copies the clock out to the motion values and, if it changed, to state. */
  const publish = useCallback(() => {
    const clock = clockRef.current;
    const settings = settingsRef.current;

    const phaseLengthMs = settings.phaseSeconds * 1000;
    const progressThroughPhase = clamp01(clock.phaseMs / phaseLengthMs);
    const phase = PHASE_ORDER[clock.phaseIndex];

    phaseProgress.set(progressThroughPhase);
    breath.set(getBreathAmount(phase, progressThroughPhase));
    sessionProgress.set(clamp01(clock.sessionMs / (settings.totalSeconds * 1000)));

    // Three phases done and half way through the fourth is 3.5 quarters, which
    // is seven eighths of the way around the ring.
    roundProgress.set((clock.phaseIndex + progressThroughPhase) / PHASES_PER_ROUND);

    const next: BreathingDisplay = {
      phase,
      // `ceil` gives the natural "4, 3, 2, 1" countdown: the label reads 4 for
      // the whole first second, not for the single instant the phase begins.
      secondsLeft: Math.max(1, Math.ceil((phaseLengthMs - clock.phaseMs) / 1000)),
      round: clock.roundsDone + 1,
      roundsCompleted: clock.roundsDone,
      elapsedSeconds: Math.floor(clock.sessionMs / 1000),
    };

    // Returning the current object when nothing visible changed means React
    // re-renders roughly once a second instead of sixty times.
    setDisplay((current) => (isSameDisplay(current, next) ? current : next));
  }, [breath, phaseProgress, roundProgress, sessionProgress]);

  // Run the loop while the session is active, and stop it the moment it is not.
  useEffect(() => {
    if (status !== "running") return;

    /** Advances the clock by however much real time has passed since the last frame. */
    function runFrame(now: number) {
      const clock = clockRef.current;
      const { phaseSeconds, totalSeconds, totalRounds, metronome } = settingsRef.current;

      const totalMs = totalSeconds * 1000;
      const phaseLengthMs = phaseSeconds * 1000;

      const elapsedSinceLastFrame = Math.min(now - clock.lastFrameMs, MAX_FRAME_DELTA_MS);
      clock.lastFrameMs = now;
      clock.sessionMs = Math.min(clock.sessionMs + elapsedSinceLastFrame, totalMs);
      clock.phaseMs += elapsedSinceLastFrame;

      // A `while`, not an `if`: if one frame covered more than a whole phase, we
      // walk through every phase it covered rather than stalling on the first.
      // Subtracting the phase length (instead of resetting to zero) carries the
      // leftover milliseconds forward, which is what keeps the session drift-free.
      while (clock.phaseMs >= phaseLengthMs) {
        clock.phaseMs -= phaseLengthMs;
        clock.phaseIndex = (clock.phaseIndex + 1) % PHASES_PER_ROUND;
        clock.lastTickedSecond = 0;

        // Wrapping back to the first phase means a round just completed.
        if (clock.phaseIndex === 0) clock.roundsDone += 1;

        playCue(metronome, "phase");
      }

      // Tick once for each whole second inside the phase. The phase change above
      // already played its own, brighter cue, so second 0 is skipped here.
      const secondsIntoPhase = Math.floor(clock.phaseMs / 1000);
      if (secondsIntoPhase !== clock.lastTickedSecond) {
        clock.lastTickedSecond = secondsIntoPhase;
        if (secondsIntoPhase > 0) playCue(metronome, "second");
      }

      const sessionComplete = clock.sessionMs >= totalMs;

      if (sessionComplete) {
        // The session lasts a whole number of rounds, so running out of time
        // means the final hold has just finished. Park the clock exactly on
        // that last instant: left alone, the loop above would have wrapped it
        // straight round to the start of a new round, emptying the ring at the
        // very moment it should be full and making the closing hold look skipped.
        clock.roundsDone = totalRounds;
        clock.phaseIndex = PHASES_PER_ROUND - 1;
        clock.phaseMs = phaseLengthMs;
      }

      publish();

      if (sessionComplete) {
        setStatus("finished");
        return;
      }

      frameRef.current = requestAnimationFrame(runFrame);
    }

    // Start measuring from now, so time spent paused is never counted.
    clockRef.current.lastFrameMs = performance.now();
    frameRef.current = requestAnimationFrame(runFrame);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [status, publish]);

  // Animation frames stop while a tab is hidden, so a session left in the
  // background would silently freeze. Pausing makes that behaviour explicit.
  useEffect(() => {
    if (status !== "running") return;

    const pauseWhenHidden = () => {
      if (document.hidden) setStatus("paused");
    };

    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, [status]);

  // While the session is not running, the countdown and the circle should follow
  // the settings as the user changes them.
  useEffect(() => {
    if (status !== "running") publish();
  }, [phaseSeconds, totalSeconds, status, publish]);

  const reset = useCallback(() => {
    clockRef.current = createClock();
    setStatus("idle");
    publish();
  }, [publish]);

  const toggle = useCallback(() => {
    // Must happen inside the click handler: browsers only let audio start in
    // response to a real user gesture.
    unlockMetronome();

    if (status === "running") {
      setStatus("paused");
      return;
    }

    // Starting again after the session ended begins a fresh one.
    if (status === "finished") reset();
    setStatus("running");
  }, [status, reset]);

  return useMemo(
    () => ({
      ...display,
      status,
      isActive: status === "running",
      totalRounds,
      totalSeconds,
      breath,
      phaseProgress,
      roundProgress,
      sessionProgress,
      toggle,
      reset,
    }),
    [
      display,
      status,
      totalRounds,
      totalSeconds,
      breath,
      phaseProgress,
      roundProgress,
      sessionProgress,
      toggle,
      reset,
    ]
  );
}
