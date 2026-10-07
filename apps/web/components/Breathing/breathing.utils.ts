/**
 * Small pure helpers. Nothing here touches React, the clock, or the DOM — give
 * each function the same numbers and it returns the same answer every time.
 */

import type { PhaseType } from "./breathing.types";

/** Keeps a number inside 0…1, so a late animation frame can never overshoot. */
export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * Eases 0 → 1 along a sine curve: slow at both ends, quickest in the middle.
 *
 * This is what makes the circle feel like a breath rather than a machine —
 * lungs do not fill at a constant rate.
 */
export function easeInOutSine(progress: number): number {
  return 0.5 * (1 - Math.cos(Math.PI * clamp01(progress)));
}

/**
 * How full of air the lungs are during a phase, from 0 (empty) to 1 (full).
 *
 * The circle scales straight from this number, so the picture cannot drift away
 * from the countdown — both are read from the same clock.
 */
export function getBreathAmount(phase: PhaseType, phaseProgress: number): number {
  switch (phase) {
    case "Inhale":
      return easeInOutSine(phaseProgress);
    case "Hold":
      return 1;
    case "Exhale":
      return 1 - easeInOutSine(phaseProgress);
    case "Pause":
      return 0;
  }
}

/**
 * Formats a number of seconds as a clock string.
 * `formatClock(65)` -> "1:05", `formatClock(65, { padMinutes: true })` -> "01:05"
 */
export function formatClock(
  totalSeconds: number,
  { padMinutes = false }: { padMinutes?: boolean } = {}
): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  const minutesText = padMinutes ? String(minutes).padStart(2, "0") : String(minutes);
  const secondsText = String(seconds).padStart(2, "0");

  return `${minutesText}:${secondsText}`;
}
